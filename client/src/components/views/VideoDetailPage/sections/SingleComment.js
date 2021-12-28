import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector(state => state.user);
  const [openReply, setOpenReply] = useState(false);
  const [commentValue, setCommentValue] = useState('');


  const onClickReplyOpen = () => {
    setOpenReply(!openReply)
  };

  const onHandleComment = (e) => setCommentValue(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo:props.comment._id,
    }

    Axios.post('/api/comment/saveComment', variables)
      .then(response => {
        if (response.data.success) {
          console.log(response.data.result)
          props.refreshFunction(response.data.result)
          setCommentValue('');
          setOpenReply(false);
        } else {
          alert('fail to save')
        }
      })
  };

  const actions = [
    <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>,
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
  ]
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt />}
        content={<p>{props.comment.content}</p>}
      />
      {openReply &&
        <form style={{ display: 'flex' }} onSubmit={onSubmit} >
          <textarea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onHandleComment}
            value={commentValue}
            placeholder='put comment'
          />
          <br />
          <button style={{ width: '20%', height: '52px' }}>Submit</button>
        </form>
      }
    </div>

  )
}

export default SingleComment
