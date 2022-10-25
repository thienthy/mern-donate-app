import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  projectListReducer,
  projectDetailsReducer,
  projectDeleteReducer,
  projectCreateReducer,
  projectUpdateReducer,
  projectListByAdminReducer,
} from './reducers/projectReducers';
import {
  userCreateReducer,
  userDeleteFailedReducer,
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userProfileReducer,
  userRegisterReducer,
  userResetPasswordReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from './reducers/userReducers';
import {
  donationWithoutLoginReducer,
  donationCreateReducer,
  myDonationsListReducer,
  userDonationsListReducer,
  donationListReducer,
} from './reducers/donationReducers';

const reducer = combineReducers({
  projectList: projectListReducer,
  projectListByAdmin: projectListByAdminReducer,
  projectDetails: projectDetailsReducer,
  projectDelete: projectDeleteReducer,
  projectCreate: projectCreateReducer,
  projectUpdate: projectUpdateReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userResetPassword: userResetPasswordReducer,
  userDetails: userDetailsReducer,
  userProfile: userProfileReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userCreate: userCreateReducer,
  userDelete: userDeleteReducer,
  userDeleteFailed: userDeleteFailedReducer,
  userUpdate: userUpdateReducer,
  donationCreate: donationCreateReducer,
  donationWithoutLogin: donationWithoutLoginReducer,
  myDonationsList: myDonationsListReducer,
  donationList: donationListReducer,
  userDonationsList: userDonationsListReducer,
});

const initialState = {
  userLogin: {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
