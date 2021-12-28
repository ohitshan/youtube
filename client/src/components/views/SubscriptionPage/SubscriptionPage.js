import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import Axios from 'axios';
import moment from 'moment';
const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {

    const subscriptionVariable = {
      userFrom: localStorage.getItem('userId')
    }


    Axios.post('/api/video/getSubscriptionVideos',subscriptionVariable)
      .then(response => {
        if (response.data.success) {
          setVideos(response.data.videos)
        } else {
          alert('fail to bring ')
        }
      })
  }, []);

  const renderCards = videos.map((video, i) => {
    
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return <Col lg={6} md={8} xs={24}>
      <div style={{ position: 'relative' }}>
        <a href={`/video/${video._id}`}>
          <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
          <div className="duration">
            <span>{minutes} : {seconds}</span>
          </div>
        </a>
      </div>
      <br />
      <Meta
        avatar={
          <Avatar src={video.writer.image} />
        }
        title={video.title}
      />
      <span>{video.writer.name}</span><br />
      <span style={{ marginLeft: '3rem' }}>{video.views}views</span>
      -<span>{moment(video.createAt).format("MM Do YY")}</span>
    </Col >
  });

  return (

    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}> Recommened</Title>
      <hr />
      <Row gutter={[32, 16]}>
        {renderCards}

      </Row>



    </div>

  )
}

export default SubscriptionPage
