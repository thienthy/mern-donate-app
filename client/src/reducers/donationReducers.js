import {
  DONATION_CREATE_FAIL,
  DONATION_CREATE_REQUEST,
  DONATION_CREATE_RESET,
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
  DONATION_WITHOUT_LOGIN_RESET,
  DONATION_LIST_REQUEST,
  DONATION_LIST_SUCCESS,
  DONATION_LIST_FAIL,
} from '../constants/donationConstants';

export const donationCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case DONATION_CREATE_REQUEST:
      return { loading: true };
    case DONATION_CREATE_SUCCESS:
      return { loading: false, success: true, donation: action.payload };
    case DONATION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case DONATION_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const donationWithoutLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case DONATION_WITHOUT_LOGIN_REQUEST:
      return { loading: true };
    case DONATION_WITHOUT_LOGIN_SUCCESS:
      return { loading: false, success: true, donation: action.payload };
    case DONATION_WITHOUT_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case DONATION_WITHOUT_LOGIN_RESET:
      return {};
    default:
      return state;
  }
};

export const myDonationsListReducer = (state = { donations: [] }, action) => {
  switch (action.type) {
    case DONATION_MY_LIST_REQUEST:
      return { ...state, loading: true };
    case DONATION_MY_LIST_SUCCESS:
      return { ...state, loading: false, donations: action.payload.donations };
    case DONATION_MY_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const donationListReducer = (state = { donations: [] }, action) => {
  switch (action.type) {
    case DONATION_LIST_REQUEST:
      return { ...state, loading: true };
    case DONATION_LIST_SUCCESS:
      return { ...state, loading: false, donations: action.payload.donations };
    case DONATION_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userDonationsListReducer = (state = { donations: [] }, action) => {
  switch (action.type) {
    case DONATION_USER_LIST_REQUEST:
      return { ...state, loading: true };
    case DONATION_USER_LIST_SUCCESS:
      return { ...state, loading: false, donations: action.payload.donations };
    case DONATION_USER_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
