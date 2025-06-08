import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/"> 
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
        <ToastContainer theme="dark" position="top-right" autoClose={2500} />
      </BrowserRouter>
    </div>
  );
}

export default App;