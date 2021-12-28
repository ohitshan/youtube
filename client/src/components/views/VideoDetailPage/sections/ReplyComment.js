import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';


function ReplyComment(props) {
  const [childCommentNumber, setChildCommentNumber] = useState(0);
  const [openReplyComment, setOpenReplyComment] = useState(false);

  useEffect(() => {
    let commentNumber = 0;

    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++
      }
    })
    setChildCommentNumber(commentNumber);
  }, [props.commentLists]);

  const renderReplyComment = (parentCommentId) => (

    props.commentLists.map((comment, i) => (
      <React.Fragment>
        {
          comment.responseTo === parentCommentId &&
          <div style={{ width: '80%', marginLeft: '40px' }}>
            <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} />
            <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} postId={props.videoId} parentCommentId={comment._id} />
          </div>
        }
      </React.Fragment>
    ))
  );

  const onClick = () => {
    setOpenReplyComment(!openReplyComment)
  }


  return (
    <div>
      {childCommentNumber > 0 &&
        <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onClick}>
          View {childCommentNumber} more comment(s)
        </p>
      }
      {openReplyComment &&
        renderReplyComment(props.parentCommentId)
      }
    </div>
  )
}

export default ReplyComment
