import {Button, Form, Input} from 'antd';
import {useCallback, useMemo} from 'react';
import Link from 'next/link';
import styled from "styled-components";
import useInput from "../hooks/useInput";
import {useDispatch, useSelector} from 'react-redux';
import {loginRequestAction} from "../reducers/user";

const ButtonWrapper = styled.div`
  marginTop: 10px;`

const FormWrapper = styled(Form)`
  padding: 10px;
`

const LoginForm = () => {
    const dispatch = useDispatch();
    const {isLoggingIn} = useSelector((state) => state.user);

    //useInput.js에 커스텀훅으로 중복 제거
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');

    const style = useMemo(() => ({marginTop: 10}), []);

    const onSubmitForm = useCallback(() => {
        dispatch(loginRequestAction({id, password}));
    }, [id, password]);

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
                <Button type="primary" htmlType="submit" loading={isLoggingIn}>로그인</Button>
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
