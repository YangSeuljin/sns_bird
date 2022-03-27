import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import {LOAD_POSTS_REQUEST} from '../reducers/post';
import {LOAD_MY_INFO_REQUEST} from '../reducers/user';
import wrapper from "../store/configureStore";
import {END} from "redux-saga";
import axios from "axios";

const Home = () => {
    const dispatch = useDispatch();
    const {me} = useSelector((state) => state.user);
    const {mainPosts, hasMorePosts, loadPostsLoading, retweetError} = useSelector((state) => state.post);

    useEffect(() => {
        if (retweetError) {
            alert(retweetError);
        }
    }, [retweetError]);

    /*    useEffect(() => {
            dispatch({
                type: LOAD_USER_REQUEST,
            });
            dispatch({
                type: LOAD_POSTS_REQUEST,
            });
        }, []);*/

    useEffect(() => {
        function onScroll() {
            if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (hasMorePosts && !loadPostsLoading) {
                    const lastId = mainPosts[mainPosts.length - 1]?.id;
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                        lastId,
                    });
                }
            }
        }

        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [hasMorePosts, loadPostsLoading, mainPosts]);

    return (
        <AppLayout>
            {me && <PostForm/>}
            {mainPosts.map((post) => <PostCard key={post.id} post={post}/>)}
        </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';

    //쿠키가 다른 사용자와 공유될 수 있음..
    axios.defaults.headers.cookie = '';
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type: LOAD_POSTS_REQUEST
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});

export default Home;
