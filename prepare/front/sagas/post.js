import {all, delay, fork, put, takeLatest, throttle, call} from 'redux-saga/effects';
import axios from "axios";
import {
    ADD_COMMENT_FAILURE,
    ADD_COMMENT_SUCCESS,
    ADD_POST_FAILURE,
    ADD_POST_SUCCESS,
    generateDummyPost,
    LIKE_POST_FAILURE,
    LIKE_POST_SUCCESS,
    LOAD_POSTS_FAILURE,
    LOAD_POSTS_SUCCESS,
    REMOVE_POST_FAILURE,
    REMOVE_POST_SUCCESS,
    UNLIKE_POST_FAILURE,
    UNLIKE_POST_SUCCESS
} from "../reducers/post";
import {
    ADD_POST_TO_ME,
    REMOVE_FOLLOWER_FAILURE,
    REMOVE_FOLLOWER_REQUEST,
    REMOVE_FOLLOWER_SUCCESS,
    REMOVE_POST_OF_ME
} from "../reducers/user";
import shortId from "shortid";

function removeFollowerApI(data) {
    return axios.delete(`/user/follower/${data}`);
}

function* removeFollower(action) {
    try {
        const result = yield call(removeFollowerApI, action.data);
        //const id = shortId.generate();
        yield put({
            type: REMOVE_FOLLOWER_SUCCESS, data: result.data,
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: REMOVE_FOLLOWER_FAILURE, data: error.response.data,
        });
    }
}

function likePostsApI(data) {
    return axios.patch(`/post/${data}/like`, data);
}

function* likePost(action) {
    try {
        const result = yield call(likePostsApI, action.data);
        //const id = shortId.generate();
        yield put({
            type: LIKE_POST_SUCCESS, data: result.data,
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: LIKE_POST_FAILURE, data: error.response.data,
        });
    }
}

function unlikePostsApI(data) {
    return axios.delete(`/post/${data}/like`, data);
}

function* unlikePost(action) {
    try {
        const result = yield call(unlikePostsApI, action.data);
        //const id = shortId.generate();
        yield put({
            type: UNLIKE_POST_SUCCESS, data: result.data,
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: UNLIKE_POST_FAILURE, data: error.response.data,
        });
    }
}

function loadPostsApI(data) {
    return axios.get('/posts', data)
}

function* loadPosts(action) {
    try {
        const result = yield call(loadPostsApI, action.data);
        //const id = shortId.generate();
        yield put({
            type: LOAD_POSTS_SUCCESS, data: result.data,
        });
    } catch (error) {
        console.error(error);
        yield put({
            type: LOAD_POSTS_FAILURE, data: error.response.data,
        });
    }
}

function addPostAPI(data) {
    return axios.post('/post', {content: data});
}

function* addPost(action) {
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

function removePostAPI(data) {
    return axios.delete(`/post/${data}`, data);
}

function* removePost(action) {
    try {
        const result = yield call(removePostAPI, action.data);
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: action.data,
        });
        yield put({
            type: REMOVE_POST_OF_ME, data: action.data,
        })
    } catch (err) {
        yield put({
            type: REMOVE_POST_FAILURE, data: err.response.data,
        });
    }
}

function addCommentAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
    try {
        const result = yield call(addCommentAPI, action.data);
        yield put({
            type: ADD_COMMENT_SUCCESS, data: result.data,
        })
    } catch (err) {
        console.error(err);
        yield put({
            type: ADD_COMMENT_FAILURE, data: err.response.data,
        });
    }
}

function* watchRemoveFollower() {
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* watchLikePost() {
    yield takeLatest('LIKE_POST_REQUEST', likePost);
}

function* watchUnlikePost() {
    yield takeLatest('UNLIKE_POST_REQUEST', unlikePost);
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
    yield all([fork(watchRemoveFollower), fork(watchLikePost), fork(watchUnlikePost), fork(watchAddPost), fork(watchRemovePost), fork(watchAddComment), fork(watchLoadPosts)])
}
