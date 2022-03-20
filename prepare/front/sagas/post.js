import {all, delay, fork, put, takeLatest} from 'redux-saga/effects';
import {axios} from "axios";
import {
    ADD_COMMENT_FAILURE,
    ADD_COMMENT_SUCCESS,
    ADD_POST_FAILURE,
    ADD_POST_SUCCESS,
    REMOVE_POST_SUCCESS
} from "../reducers/post";
import {ADD_POST_TO_ME, REMOVE_POST_OF_ME} from "../reducers/user";
import shortId from "shortid";

function addPostAPI(data) {
    return axios.post('/api/post', data)
}

function* addPost(action) {
    try {
        //onst result = yield call(addPostAPI, action.data);
        yield delay(1000);
        const id = shortId.generate();
        yield put({
            type: ADD_POST_SUCCESS, data: {
                id,
                content: action.data,
            }
        });
        yield put({
            type: ADD_POST_TO_ME, data: id,
        })
    } catch (err) {
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
    return axios.post(`/api/post/${data.postId}/comment`, data)
}

function* addComment(action) {
    console.log(action);
    try {
        yield delay(1000);
        //const result = yield call(addPostAPI, action.data);
        yield put({
            type: ADD_COMMENT_SUCCESS, data: action.data,
        })
    } catch (err) {
        yield put({
            type: ADD_COMMENT_FAILURE, data: err.response.data,
        });
    }
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
    yield all([fork(watchAddPost), fork(watchRemovePost), fork(watchAddComment)])
}
