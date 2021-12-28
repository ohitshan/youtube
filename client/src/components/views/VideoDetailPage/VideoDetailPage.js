
import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './sections/SideVideo';
import Subscribe from './sections/Subscribe';
import Comment from './sections/Comment';
import LikeDislikes from './sections/LikeDislikes';

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId
  const variable = { videoId: videoId }

  const [videoDetail, setVideoDetail] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {

    Axios.post('/api/video/getVideoDetail', variable)
      .then(response => {
        if (response.data.success) {
          setVideoDetail(response.data.videoDetail)
          //console.log(videoDetail)
        } else {
          alert('fail to bring')
        }
      })

    Axios.post('/api/comment/getComments', variable)
      .then(response => {
        if (response.data.success) {
          setComments(response.data.comments)
          console.log(response.data.comments)
        } else {
          alert('fail to bring comment info')
        }
      })
  }, [])

  const refreshFunction = (newComment) => {
    setComments(comments.concat(newComment))
  }


  if (videoDetail.writer) {

    const subscribeButton = videoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={videoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video style={{ width: '100%' }} src={`http://localhost:5000/${videoDetail.filePath}`} controls />
            <List.Item
              actions={[
                <LikeDislikes
                 video userId={localStorage.getItem('userId')} 
                 videoId={videoId}
                 />,
                subscribeButton
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={videoDetail.writer.image} />}
                title={videoDetail.writer.name}
                description={videoDetail.description}
              />

            </List.Item>
            <Comment refreshFunction={refreshFunction} commentLists={comments} postId={videoId} />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    )
  } else {
    return (
      <div>..loading</div>
    )
  }
}

export default VideoDetailPage
