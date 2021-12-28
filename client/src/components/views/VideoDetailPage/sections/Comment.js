import React, { useState } from 'react'
import Axios from 'axios';
// import {Button,Input} from 'antd';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
  const videoId = props.postId;
  const user = useSelector(state => state.user);
  const [commentValue, setCommentValue] = useState('');

  const handleClick = (e) => setCommentValue(e.currentTarget.value);
  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId,
    }

    Axios.post('/api/comment/saveComment', variables)
      .then(response => {
        if (response.data.success) {
          console.log(response.data.result)
          props.refreshFunction(response.data.result)
          setCommentValue('');
        } else {
          alert('fail to save')
        }
      })
  }


  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />

      {props.commentLists && props.commentLists.map((comment, i) => (
        (!comment.responseTo &&
          <React.Fragment>
            <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
            <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} commentLists={props.commentLists} postId={videoId}/>
          </React.Fragment>
        )
      ))}

      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleClick}
          value={commentValue}
          placeholder='put comment'
        />
        <br />
        <button style={{ width: '20%', height: '52px' }}>Submit</button>
      </form>
    </div>
  )
}

export default Comment
