import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { createProject } from '../actions/projectActions';
import { PROJECT_CREATE_RESET } from '../constants/projectConstants';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from '../utils/quillEditer';
import { toast } from 'react-toastify';

const ProjectCreateScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [post, setPost] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const { userInfo } = useSelector((state) => state.userLogin);

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = useSelector((state) => state.projectCreate);

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
    if (successCreate) {
      dispatch({ type: PROJECT_CREATE_RESET });
      navigate('/admin/projects');
    }
    dispatch(createProject);
  }, [dispatch, navigate, successCreate, userInfo]);

  const validateForm = () => {
    const { title, targetDonation, startTime, endTime } = form;
    const newErrors = {};

    if (!title || title === '') newErrors.title = 'Please enter title';
    if (!targetDonation || targetDonation === '')
      newErrors.targetDonation = 'Please enter target donation';
    if (!startTime || startTime === '')
      newErrors.startTime = 'Please enter start time';
    if (!endTime || endTime === '') newErrors.endTime = 'Please enter end time';

    return newErrors;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Please Enter Data');
    } else {
      dispatch(
        createProject({ ...form, userId: userInfo._id, desc, image, post })
      );
      toast.success('Project created successfully!');
    }
  };

  return (
    <Container>
      <Meta title="Project create" />
      <Link to="/admin/projects" className="btn btn-primary my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Project</h1>
        {loadingCreate && <Loader />}
        {errorCreate && <Message variant="danger">{errorCreate}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="title">
            <Form.Label>Tile</Form.Label>
            <Form.Control
              className="mb-2"
              type="text"
              placeholder="Enter title"
              value={form.title || ''}
              onChange={(e) => setField('title', e.target.value)}
              isInvalid={!!errors.title}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
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
              accept="image/png, image/jpeg"
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
              value={form.targetDonation || ''}
              onChange={(e) => setField('targetDonation', e.target.value)}
              isInvalid={!!errors.targetDonation}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.targetDonation}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="startTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              className="mb-2"
              type="date"
              placeholder="Enter start time"
              value={form.startTime || ''}
              onChange={(e) => setField('startTime', e.target.value)}
              isInvalid={!!errors.startTime}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.startTime}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="endTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              className="mb-2"
              type="date"
              placeholder="Enter end time"
              value={form.endTime || ''}
              onChange={(e) => setField('endTime', e.target.value)}
              isInvalid={!!errors.endTime}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.endTime}
            </Form.Control.Feedback>
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
            Create
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default ProjectCreateScreen;
