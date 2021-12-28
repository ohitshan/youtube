import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';


const { Title } = Typography;
const { TextArea } = Input;

const PrivateOption = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
]

const CategoryOption = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
]


function VideoUploadPage( props ) {
  const user = useSelector(state => state.user);
  const [videoTitle, setVideoTitle] = useState('');
  const [descrip, setDescrip] = useState('');
  const [Private, setPrivate] = useState(0);
  const [category, setCategory] = useState("Film and animation");
  const [filepath, setFilepath] = useState("")
  const [duration, setDuration] = useState("")
  const [thumbnailPath, setThumbnailPath] = useState("")

  const titleOnChange = (e) => setVideoTitle(e.currentTarget.value);
  const descripOnChange = (e) => setDescrip(e.currentTarget.value);
  const privateOnChange = (e) => setPrivate(e.currentTarget.value);
  const categoryOnChange = (e) => setCategory(e.currentTarget.value);

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: videoTitle,
      description: descrip,
      privacy: Private,
      filePath: filepath,
      category: category,
      duration: duration,
      thumbnail: thumbnailPath,
    }

    Axios.post('/api/video/uploadVideo', variables)
      .then(response => {
        if (response.data.success) {
          message.success('success uploading')

          setTimeout(() => {
            props.history.push('/')
          }, 3000)

        } else {
          alert('fail to upload')
        }
      })
  }

  const onDrop = (files) => {
    let formData = new FormData;
    const config = {
      header: { 'content-tyoe': 'multipart/form-data' }
    }
    formData.append("file", files[0])

    Axios.post('/api/video/uploadfiles', formData, config)
      .then(response => {
        if (response.data.success) {
          console.log(response.data)

          let variable = {
            url: response.data.url,
            fileName: response.data.fileName
          }

          setFilepath(response.data.url)

          Axios.post('/api/video/thumbnail', variable)
            .then(response => {
              if (response.data.success) {
                setDuration(response.data.fileDuration)
                setThumbnailPath(response.data.url)
              } else {
                alert('fail to create thumbnail')
              }
            })
        } else {
          alert('fail to upload')
        }
      })
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

          <Dropzone
            onDrop={onDrop}
            multiple={false}
          >
            {({ getRootProps, getInputProps }) => (
              <div style={{
                width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }} {...getRootProps()}>
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />

              </div>
            )}
          </Dropzone>

          {thumbnailPath &&
            <div>
              <img src={`http://localhost:5000/${thumbnailPath}`} alt="thumbnail" />
            </div>}
        </div>

        <br />
        <br />
        <label>Title</label>
        <Input value={videoTitle} onChange={titleOnChange} />
        <br />
        <br />
        <label>Description</label>
        <TextArea value={descrip} onChange={descripOnChange} />
        <br />
        <br />

        <select onChange={privateOnChange}>
          {PrivateOption.map((item, i) => (
            <option key={i} value={item.value}>{item.label}</option>
          ))}
        </select>

        <br />
        <br />

        <select onChange={categoryOnChange}>
          {CategoryOption.map((item, i) => (
            <option key={i} value={item.value}>{item.label}</option>
          ))}
        </select>

        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>

      </Form>

    </div>
  )
}

export default VideoUploadPage
