import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProjectDetailScreen from './screens/ProjectDetailScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProjectCreateScreen from './screens/ProjectCreateScreen';
import ProjectEditScreen from './screens/ProjectEditScreen';
import EmailVerify from './screens/EmailVerifyScreen';
import ProjectListScreen from './screens/ProjectListScreen';
import ProfileScreen from './screens/ProfileScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import UserCreateScreen from './screens/UserCreateScreen';
import UserDonationScreen from './screens/UserDonationScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import PageNotFound from './screens/PageNotFoundScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DonationListScreen from './screens/DonationListScreen';
import MyDonationScreen from './screens/MyDonationScreen';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main>
          <Container fluid style={{ padding: 0 }}>
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route
                path="/users/:id/verify/:token"
                element={<EmailVerify />}
              />
              <Route
                path="/forgot-password"
                element={<ForgotPasswordScreen />}
              />
              <Route
                path="/users/reset-password/:id/:token"
                element={<ResetPasswordScreen />}
              />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/my-donations" element={<MyDonationScreen />} />
              <Route path="/admin/users" element={<UserListScreen />} />
              <Route
                path="/admin/users/create"
                element={<UserCreateScreen />}
              />
              <Route path="/admin/user/edit/:id" element={<UserEditScreen />} />
              <Route
                path="/admin/user/donations/:id"
                element={<UserDonationScreen />}
              />
              <Route path="/admin/projects" element={<ProjectListScreen />} />
              <Route
                path="/admin/projects/create"
                element={<ProjectCreateScreen />}
              />
              <Route
                path="/admin/project/edit/:id"
                element={<ProjectEditScreen />}
              />
              <Route path="/admin/donations" element={<DonationListScreen />} />

              <Route path="/project/:id" element={<ProjectDetailScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/page/:pageNumber" element={<HomeScreen />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Container>
        </main>
        <Footer />
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
