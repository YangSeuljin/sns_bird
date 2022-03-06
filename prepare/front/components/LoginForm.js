import {Button, Form, Input} from 'antd';
import {useCallback, useMemo, useState} from 'react';
import Link from 'next/link';
import styled from "styled-components";
import PropTypes from "prop-types";
import useinput from "../hooks/useInput";
import useInput from "../hooks/useInput";
import {useDispatch} from 'react-redux';
import {loginAction} from "../reducers";

const ButtonWrapper = styled.div`
  marginTop: 10px;`

const FormWrapper = styled(Form)`
    padding: 10px;
`

const LoginForm = () => {
    const dispatch = useDispatch();
    
    //useInput.js에 커스텀훅으로 중복 제거
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');

    const style = useMemo(() => ({marginTop: 10}), []);

    const onSubmitForm = useCallback(()=>{
        dispatch(loginAction({id,password}));
    },[id,password]);

    return (
        <FormWrapper onFinish={onSubmitForm}>
            <div>
                <label htmlFor="user-id">아이디</label>
                <br/>
                <Input name="user-id" value={id} onChange={onChangeId} required/>
            </div>
            <div>
                <label htmlFor="user-id">비밀번호</label>
                <br/>
                <Input name="user-password" type="password" value={password} onChange={onChangePassword} required/>
            </div>
            <ButtonWrapper>
                <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
                <Link href="/signup"><a>회원가입</a></Link>
            </ButtonWrapper>
        </FormWrapper>
    );
}

/*//validation 체크
LoginForm.propTypes = {
    setIsLoggedIn:PropTypes.func.isRequired,
}*/

export default LoginForm;