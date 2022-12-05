import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { getProjectDetails, updateProject } from '../actions/projectActions';
import { PROJECT_UPDATE_RESET } from '../constants/projectConstants';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from '../utils/quillEditer';
import { toast } from 'react-toastify';

const ProjectEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [targetDonation, setTargetDonation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [post, setPost] = useState('');
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const { loading, error, project } = useSelector(
    (state) => state.projectDetails
  );

  const { userInfo } = useSelector((state) => state.userLogin);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.projectUpdate);

  // submit file to multer upload, get the url
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (data) => {
          console.log(Math.round((100 * data.loaded) / data.total));
          setUploadProgress(Math.round((100 * data.loaded) / data.total));
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!userInfo && !userInfo?.isAdmin) {
      navigate('/');
    }
    if (successUpdate) {
      dispatch({ type: PROJECT_UPDATE_RESET });
      navigate('/admin/projects');
      toast.success('Project updated successfully!');
    } else {
      if (project?._id !== id) {
        dispatch(getProjectDetails(id));
      } else {
        setTitle(project.title);
        setDesc(project.desc);
        setImage(project.image);
        setTargetDonation(project.targetDonation);
        setStartTime(project.startTime);
        setEndTime(project.endTime);
        setPost(project.post);
        setStatus(project.status);
      }
    }
  }, [dispatch, navigate, id, project, successUpdate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (title === '') {
      setMessage('Title cannot be blank');
    } else if (targetDonation === '') {
      setMessage('Target donation cannot be blank');
    } else if (startTime === '') {
      setMessage('Start time cannot be blank');
    } else if (endTime === '') {
      setMessage('End time cannot be blank');
    } else {
      dispatch(
        updateProject({
          _id: id,
          title,
          desc,
          image,
          targetDonation,
          startTime,
          endTime,
          post,
          status,
        })
      );
    }
  };

  return (
    <Container>
      <Meta title={`Project ${project?._id}`} />
      <Link to="/admin/projects" className="btn btn-primary my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Project</h1>
        {message && <Message variant="danger">{message}</Message>}
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title">
              <Form.Label>Tile</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="desc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                placeholder="Enter description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <div className="text-center">OR</div>
              <Form.Control
                type="file"
                className="mb-2"
                label="Choose File"
                custom="true"
                onChange={uploadFileHandler}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>
            {uploadProgress && (
              <div
                className="progress card-margin mb-2"
                style={{ height: '12px' }}
              >
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  aria-label="Success example"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >{`${uploadProgress}%`}</div>
              </div>
            )}
            <Form.Group controlId="targetDonation">
              <Form.Label>Target Donation</Form.Label>
              <Form.Control
                className="mb-2"
                type="number"
                placeholder="Enter target donation"
                value={targetDonation}
                onChange={(e) => setTargetDonation(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                className="mb-2"
                type="date"
                placeholder="Enter start time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="endTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                className="mb-2"
                type="date"
                placeholder="Enter end time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="post">
              <Form.Label>Post</Form.Label>
              <ReactQuill
                theme="snow"
                value={post}
                onChange={(value) => setPost(value)}
                modules={modules}
                formats={formats}
                placeholder={'Enter new content here...'}
                style={{ height: '300px', marginBottom: '80px' }}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Edit
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default ProjectEditScreen;
