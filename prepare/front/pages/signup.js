import React, {useCallback, useEffect, useState} from 'react';
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import {Button, Checkbox, Form, Input} from 'antd';
import useInput from "../hooks/useInput";
import styled from 'styled-components';
import {LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST} from "../reducers/user";
import {useDispatch, useSelector} from "react-redux";
import Router from "next/router";
import wrapper from "../store/configureStore";
import axios from "axios";
import {LOAD_POSTS_REQUEST} from "../reducers/post";
import {END} from "redux-saga";

const ErrorMessage = styled.div`
  color: red;
`

const Signup = () => {
    const dispatch = useDispatch();
    const {signUpLoading, signUpDone, signUpError, me} = useSelector((state) => state.user);

    // useEffect(() => {
    //     if (me && me.id) {
    //         Router.replace('/');
    //     }
    // }, [me && me.id]);

    useEffect(() => {
        if (signUpDone) {
            Router.replace('/');
        }
    }, [signUpDone]);

    useEffect(() => {
        if (signUpError) {
            alert(signUpError);
        }
    }, [signUpError]);

    const [email, onChangeEmail] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [term, setTerm] = useState('');
    const [termError, setTermError] = useState(false);

    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setPasswordError(e.target.value !== password);
    }, [password]);

    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(false);
    }, [password, term]);


    const onSubmit = useCallback(() => {
        if (password !== passwordCheck) {
            return setPasswordError(true);
        }
        if (!term) {
            return setTermError(true);
        }
        dispatch({
            type: SIGN_UP_REQUEST,
            data: {email, password, nickname},
        })
    }, [password, passwordCheck, term]);

    return (<AppLayout>
        <Head>
            <title>회원가입</title>
        </Head>
        <Form onFinish={onSubmit}>
            <div>
                <label htmlFor="user-id">이메일</label>
                <br/>
                <Input name="user-id" type="email" value={email} required onChange={onChangeEmail}/>
            </div>
            <div>
                <label htmlFor="user-nick">닉네임</label>
                <br/>
                <Input name="user-nick" value={nickname} required onChange={onChangeNickname}/>
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br/>
                <Input name="user-password" type="password" value={password} required onChange={onChangePassword}/>
            </div>
            <div>
                <label htmlFor="user-password-check">비밀번호체크</label>
                <br/>
                <Input name="user-password-check" type="password" value={passwordCheck} required
                       onChange={onChangePasswordCheck}/>
                {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
            </div>
            <div>
                <Checkbox name="use-term" checked={term} onChange={onChangeTerm}>약관에 동의합니다.</Checkbox>
                {termError && <div style={{color: 'red'}}>약관에 동의하셔야 합니다.</div>}
            </div>
            <div style={{marginTop: 10}}>
                <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
            </div>
        </Form>
    </AppLayout>);
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

export default Signup;
