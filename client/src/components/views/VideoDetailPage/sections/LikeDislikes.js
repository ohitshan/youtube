import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

  const [likeNumber, setLikeNumber] = useState(0);
  const [dislikeNumber, setDislikeNumber] = useState(0);
  const [likeAction, setLikeAction] = useState(null);
  const [dislikeAction, setDislikeAction] = useState(null);

  let variable = {}

  if (props.video) {
    variable = {
      videoId: props.videoId,
      userId: props.userId,
    }
  } else {
    variable = {
      commentId: props.commentId,
      userId: props.userId,
    }
  }

  useEffect(() => {


    Axios.post('/api/like/getLikes', variable)
      .then(response => {
        if (response.data.success) {
          setLikeNumber(response.data.likes.length);

          response.data.likes.map(like => {
            if (like.userId === props.userId) {
              setLikeAction('liked')
            }
          })
        } else {
          alert('fail to bring like')
        }
      })


    Axios.post('/api/like/getDislikes', variable)
      .then(response => {
        if (response.data.success) {
          setDislikeNumber(response.data.dislikes.length);

          response.data.dislikes.map(dislike => {
            if (dislike.userId === props.userId) {
              setDislikeAction('disliked')
            }
          })
        } else {
          alert('fail to bring dislike')
        }
      })



  }, []);


  const onLikeClick = () => {

    if (likeAction === null) {
      Axios.post('/api/like/upLike', variable)
        .then(response => {
          if (response.data.success) {
            setLikeNumber(likeNumber + 1);
            setLikeAction('liked');

            if (dislikeAction !== null) {
              setDislikeAction(null)
              setDislikeNumber(dislikeNumber - 1)
            }
          } else {
            alert('fail to click like')
          }
        })
    } else {
      Axios.post('/api/like/unLike', variable)
        .then(response => {
          if (response.data.success) {
            setLikeNumber(likeNumber - 1);
            setLikeAction(null);


          } else {
            alert('fail to click unlike')
          }
        })
    }
  };

  const onDislikeClick = () => {
    if (dislikeAction !== null) {
      Axios.post('/api/like/unDislike', variable)
        .then(response => {
          if (response.data.success) {
            setDislikeNumber(dislikeNumber - 1)
            setDislikeAction(null)
          } else {
            alert('fail to unclick dislike')
          }
        })
    } else {
      Axios.post('/api/like/upDislike', variable)
        .then(response => {
          if (response.data.success) {
            setDislikeNumber(dislikeNumber + 1)
            setDislikeAction('disliked')

            if (likeAction !== null) {
              setLikeAction(null)
              setLikeNumber(likeNumber - 1)
            }
          } else {
            alert('fail to click dislike')
          }
        })
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon type="like"
            theme={likeAction === 'liked' ? 'filled' : "outlined"}
            onClick={onLikeClick}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{likeNumber}</span>
      </span>&nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon type="dislike"
            theme={dislikeAction === 'disliked' ? 'filled' : "outlined"}
            onClick={onDislikeClick}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{dislikeNumber}</span>
      </span>&nbsp;&nbsp;
    </div>
  )
}

export default LikeDislikes
