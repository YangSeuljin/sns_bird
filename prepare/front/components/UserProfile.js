import {useState,useCallback} from 'react';
import {Card,Button,Avatar} from 'antd';
import {useDispatch} from "react-redux";
import {logoutAction} from "../reducers/user";

const UserProfile = ({}) => {
    const dispatch = useDispatch();

    const onLogOut = useCallback(()=>{
        dispatch(logoutAction());
    },[]);

    return (
        <Card actions={[
            <div key="twit">짹짹<br/>0</div>,
            <div key="followings">팔로잉<br/>0</div>,
            <div key="followings">팔로워<br/>0</div>,
        ]}>
            <Card.Meta avatar={<Avatar>SJ</Avatar>} title="Seuljin"></Card.Meta>
            <Button onClick={onLogOut}>로그아웃</Button>
        </Card>

    );
}

export default UserProfile;