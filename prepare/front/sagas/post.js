import {all, delay, fork, put, takeLatest, throttle, call} from 'redux-saga/effects';
import axios from "axios";
import {
    ADD_COMMENT_FAILURE,
    ADD_COMMENT_SUCCESS,
    ADD_POST_FAILURE,
    ADD_POST_SUCCESS, generateDummyPost, LOAD_POSTS_FAILURE, LOAD_POSTS_SUCCESS,
    REMOVE_POST_SUCCESS
} from "../reducers/post";
import {ADD_POST_TO_ME, REMOVE_POST_OF_ME} from "../reducers/user";
import shortId from "shortid";

function loadPostsApI(data) {
    return axios.get('/posts', data)
}

function* loadPosts(action) {
    try {
        const result = yield call(loadPostsApI, action.data);
        const id = shortId.generate();
        yield put({
            type: LOAD_POSTS_SUCCESS, data: result.data,
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: LOAD_POSTS_FAILURE, data: err.response.data,
        });
    }
}

function addPostAPI(data) {
    console.log(data);
    return axios.post('/post', {content:data});
}

function* addPost(action) {
    console.log(action.data);
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({
            type: ADD_POST_SUCCESS, data: result.data,
        });
        yield put({
            type: ADD_POST_TO_ME, data: result.data.id,
        })
    } catch (err) {
        console.error(err);
        yield put({
            type: ADD_POST_FAILURE, data: err.response.data,
        });
    }
}

function* removePost(action) {
    try {
        //onst result = yield call(addPostAPI, action.data);
        yield delay(1000);
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: action.data,
        });
        yield put({
            type: REMOVE_POST_OF_ME, data: action.data,
        })
    } catch (err) {
        yield put({
            type: ADD_POST_FAILURE, data: err.response.data,
        });
    }
}

function addCommentAPI(data) {
    return axios.post(`/api/post/${data.postId}/comment`, data);
}

function* addComment(action) {
    console.log(action);
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({
            type: ADD_COMMENT_SUCCESS, data: action.data,
        })
    } catch (err) {
        console.error(err);
        yield put({
            type: ADD_COMMENT_FAILURE, data: err.response.data,
        });
    }
}

function* watchLoadPosts() {
    yield throttle(5000, 'LOAD_POSTS_REQUEST', loadPosts);
}

function* watchAddPost() {
    yield takeLatest('ADD_POST_REQUEST', addPost);
}

function* watchRemovePost() {
    yield takeLatest('REMOVE_POST_REQUEST', removePost);
}

function* watchAddComment() {
    yield takeLatest('ADD_COMMENT_REQUEST', addComment);
}

export default function* postSaga() {
    yield all([fork(watchAddPost), fork(watchRemovePost), fork(watchAddComment), fork(watchLoadPosts)])
}
