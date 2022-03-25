import React, {useEffect} from 'react';
import AppLayout from "../components/AppLayout";
import Head from 'next/head';
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import {useDispatch, useSelector} from "react-redux";
import Router from "next/router";
import {LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST} from "../reducers/user";

const Profile = () => {
    const followerList = [{nickname:'제로초'},{nickname:'바보'},{nickname:'노드버드오피셜'}];
    const followingList = [{nickname:'제로초'},{nickname:'바보'},{nickname:'노드버드오피셜'}];
    const {me} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    console.log(me);

    useEffect(()=>{
        dispatch({
            type:LOAD_FOLLOWERS_REQUEST,
        });
        dispatch({
            type:LOAD_FOLLOWINGS_REQUEST,
        })
    },[]);

    useEffect(() => {
        if (!(me && me.id)) {
            Router.push('/');
        }
    }, [me && me.id]);

    if (!me) {
        return null;
    }

    return (<>
            <Head>
                <title>내 프로필</title>
            </Head>
            <AppLayout>
                <NicknameEditForm/>
                <FollowList header="팔로잉" data={me.Followings}/>
                <FollowList header="팔로워" data={me.Followers}/>
            </AppLayout>
        </>);
};

export default Profile;
