import PropTypes from 'prop-types';
import Link from 'next/link';
import {Col, Input, Menu, Row} from 'antd';
import 'antd/dist/antd.css';
import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {useCallback} from "react";
import Router from 'next/router';
import useInput from "../hooks/useInput";

const searchInput = styled(Input.Search)`
  vertical-align: middle`

const AppLayout = ({children}) => {
    const [searchInput, onChangeSearchInput] = useInput('');
    const {me} = useSelector((state) => state.user);
    const onSearch = useCallback(() => {
        Router.push(`/hashtag/${searchInput}`);
    }, [searchInput]);
    return (
        <div>
            <div>
                <Menu mode="horizontal">
                    <Menu.Item>
                        <Link href="/"><a>노드버드</a></Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link href="/profile"><a>프로필</a></Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Input.Search enterButton/>
                    </Menu.Item>
                    <Menu.Item>
                        <Link href="/signup"><a>회원가입</a></Link>
                    </Menu.Item>
{/*                    <Menu.Item>
                        <SearchInput
                            enterButton
                            value={searchInput}
                            onChange={onChangeSearchInput}
                            onSearch={onSearch}
                        />
                    </Menu.Item>*/}
                </Menu>
            </div>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {me ? <UserProfile/> : <LoginForm/>}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    <a href="" target="_blank" rel="noreferrer noopener">Made by Seuljin</a>
                </Col>
            </Row>
        </div>
    )
};

AppLayout.propTypes =
    {
        children: PropTypes.node.isRequired,
    }

export default AppLayout;
