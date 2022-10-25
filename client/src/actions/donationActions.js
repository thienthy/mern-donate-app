import axios from 'axios';
import {
  DONATION_CREATE_FAIL,
  DONATION_CREATE_REQUEST,
  DONATION_CREATE_SUCCESS,
  DONATION_MY_LIST_FAIL,
  DONATION_MY_LIST_REQUEST,
  DONATION_MY_LIST_SUCCESS,
  DONATION_USER_LIST_FAIL,
  DONATION_USER_LIST_SUCCESS,
  DONATION_USER_LIST_REQUEST,
  DONATION_WITHOUT_LOGIN_REQUEST,
  DONATION_WITHOUT_LOGIN_SUCCESS,
  DONATION_WITHOUT_LOGIN_FAIL,
  DONATION_LIST_REQUEST,
  DONATION_LIST_SUCCESS,
  DONATION_LIST_FAIL,
} from '../constants/donationConstants';

export const userDonate = (donation) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DONATION_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/donations`, donation, config);

    dispatch({
      type: DONATION_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DONATION_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const donateWithoutLogin = (donation) => async (dispatch) => {
  try {
    dispatch({
      type: DONATION_WITHOUT_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      'http://127.0.0.1:5000/api/donations/no-login',
      donation,
      config
    );

    dispatch({
      type: DONATION_WITHOUT_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DONATION_WITHOUT_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const myDonationsList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DONATION_MY_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/donations/my-donations`, config);

    dispatch({
      type: DONATION_MY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DONATION_MY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listDonations = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DONATION_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/donations`, config);

    dispatch({
      type: DONATION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DONATION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listUserDonations = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DONATION_USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/donations/${id}`, config);

    dispatch({
      type: DONATION_USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DONATION_USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
