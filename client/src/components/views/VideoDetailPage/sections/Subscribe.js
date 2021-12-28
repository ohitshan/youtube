import Axios from 'axios';
import React, { useEffect, useState } from 'react'

function Subscribe(props) {


  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {

    let variable = { userTo: props.userTo }

    Axios.post('/api/subscribe/subscribeNumber', variable)
      .then(response => {
        if (response.data.success) {

          setSubscribeNumber(response.data.subscribeNumber)
        } else {
          alert('fail to bring subcriber')
        }
      })

    let subscribedVaribale = {
      userTo: props.userTo,
      userFrom: localStorage.getItem('userId')
    };

    Axios.post('/api/subscribe/subscribed', subscribedVaribale)
      .then(response => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed)
        } else {
          alert('fail to bring')
        }
      })
      
  }, []);


  const subscribeOnclick = () => {

    let subscribeVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom
    }

    if (subscribed) {
      Axios.post('/api/subscribe/unSubscribe', subscribeVariable)
        .then(response => {
          if (response.data.success) {
            setSubscribeNumber(subscribeNumber - 1)
            setSubscribed(!subscribed)
          } else {
            alert('fail to unsubscribe')
          }
        })
    } else {

      Axios.post('/api/subscribe/subscribe', subscribeVariable)
        .then(response => {
          if (response.data.success) {
            setSubscribeNumber(subscribeNumber + 1)
            setSubscribed(!subscribed)
          } else {
            alert('fail to subscribe')
          }
        })

    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${subscribed ? '#AAAAAA' : '#CC0000'}`, color: 'white',
          borderRadius: '4px', padding: '10px 16px',
          fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
        }}
        onClick={subscribeOnclick}
      >
        {subscribeNumber} {subscribed ? 'SUBSCRIBED' : 'Subscribe'}
      </button>
    </div>
  )
}

export default Subscribe
