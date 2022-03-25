import React, {useCallback, useState} from 'react';

import {EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined} from "@ant-design/icons";
import {Avatar, Button, Card, Comment, List, Popover} from "antd";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import {LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST} from "../reducers/post";
import FollowButton from "./FollowButton";

const PostCard = ({post}) => {
    // const {me} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const {removePostLoading} = useSelector((state => state.post));
    //const [liked, setLiked] = useState(false);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const id = useSelector((state) => state.user.me?.id);

    const onLike = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);
    const onUnlike = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);

    const onRemovePost = useCallback(() => {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        })
    },[id]);
    const liked = post.Likers.find((v) => v.id === id);
    //const id = me && me.id;
    return (
        <div style={{marginBottom: 10}}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images}/>}
                actions={[
                    <RetweetOutlined key="retweet"/>,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike}/>
                        : <HeartOutlined key="heart" onClick={onLike}/>,
                    <MessageOutlined key="comment" onClick={onToggleComment}/>,
                    <Popover key="more" content={(
                        <Button.Group>
                            {id && post.User.id === id ? (
                                    <>
                                        <Button>수정</Button>
                                        <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                                    </>
                                ) :
                                <Button>신고</Button>}
                        </Button.Group>
                    )}>
                        <EllipsisOutlined/>
                    </Popover>


                ]}
                extra={<FollowButton post={post}/>}
            >
                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content}/>}
                />
            </Card>
            {commentFormOpened && (<div>
                <CommentForm post={post}/>
                <List
                    header={`${post.Comments.length}개의 댓글`}
                    itemLayout="horizontal"
                    dataSource={post.Comments}
                    renderItem={(item) => (
                        <li>
                            <Comment
                                author={item.User.nickname}
                                avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                                content={item.content}
                            />
                        </li>
                    )}
                />
            </div>)}
            {/*<CommentForm/>*/}
            {/*<Comments>*/}

            {/*</Comments>*/}
        </div>);
};

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
        Likers: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
}

export default PostCard;
