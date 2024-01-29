import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';    // Importing routing tools
import 'bootstrap/dist/css/bootstrap.min.css';


import HomePage from './components/pages/HomePage.js';
import AboutPage from './components/pages/AboutPage.js'
import Bookings from './components/pages/Bookings.js';
import Listings from './components/pages/Listings.js';
import Branches from './components/pages/Branches.js';
import NotFound from './components/pages/NotFound.js';
import CartPage from './components/pages/CartPage.js';
import SignUpPage from './components/pages/SignUpPage.js';
import LogInPage from './components/pages/LogInPage.js';
import ContactPage from './components/pages/ContactPage.js';
import DetailedListing from './components/pages/DetailedListing.js';
import DetailedPost from './components/pages/DetailedPost.js';
import UserProfilePage from './components/pages/UserProfilePage.js';
import OrdersPage from './components/pages/OrdersPage.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/'element={<App />}>
          <Route index element={<HomePage />} />
          <Route path='about/' element={<AboutPage/>} />
          <Route path='bookings/' element={<Bookings/> }/>
          <Route path='listings/' element={<Listings/> }/>
          <Route path="/listings/:postId" element={<DetailedListing />} />
          <Route path='branches/' element={<Branches/> }/>
          <Route path="/branches/:postId" element={<DetailedPost />} />
          <Route path='cart/' element={<CartPage/>}/>
          <Route path='signup/' element={<SignUpPage/>}/>
          <Route path='login/' element={<LogInPage/>}/>
          <Route path='contact/' element={<ContactPage/>}/>
          <Route path='profile/' element={<UserProfilePage/>}/>
          <Route path='orders/' element={<OrdersPage/>}/>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);