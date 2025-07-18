import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';

function App() {

  return (
    <>
      <Routes>
        <Route path="/vqm-luma-javascript/" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
