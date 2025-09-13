import Header from './components/Header'
import Main from './components/Main'
import { StrictMode, useState } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login'
import './App.css'
import ShowExpense from './components/ShowExpense';
import TotalExpense from './components/TotalExpense';
import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import MainPage from './components/MainPage';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Header />
          <SignUp />
        </>
      )
    },
    {
      path: '/signup',
      element: (
        <>
          <Header />
          <SignUp />
        </>
      )
    },
    {
      path: '/login',
      element: (
        <>
          <Header />
          <Login />
        </>
      )
    },
    {
      path: '/main',
      element: (
        <>
          <Header />
          <MainPage />
        </>
      )
    }
  ])


  return (
    <div>
      <RouterProvider router = {router} />
    </div>
  )
}

export default App
