import React, { useState, useEffect } from 'react';
import '../components/Home/HomePage.scss';
import UploadForm from '../components/Home/UploadForm';
import HistoryList from '../components/Home/HistoryList';
import { toast } from 'react-toastify';
import { getHistoryApi, logoutApi } from '../api/index';

// Component MainLayout
const MainLayout = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (token) {
        try {
          const history = await getHistoryApi(token);
          console.log('History Response:', history); // Debug the response
          setAnalysisHistory(history);
        } catch (error) {
          console.error('History Error:', error);
          toast.error(error.message || 'Failed to fetch history.');
        }
      }
    };
    fetchHistory();
  }, [token]);

  const addToHistory = (result) => {
    setAnalysisHistory([result, ...analysisHistory]);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await logoutApi(token);
        setToken('');
        localStorage.removeItem('token');
        setAnalysisHistory([]);
        setLogout(true);
        toast.success('Logged out successfully!');
      } catch (error) {
        console.error('Logout Error:', error);
        toast.error(error.message || 'Failed to logout.');
      }
    }
  };

  return (
    <div className="main-layout">
      <header className="header">
        <h1>DEEPFAKE ANALYSIS</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>
      <div className="desktop-layout">
        <div className="left-column">
          <HistoryList history={analysisHistory} />
        </div>
        <div className="right-column">
          <UploadForm onAnalysisComplete={addToHistory} token={token} />
        </div>
      </div>
      <div className="mobile-layout">
        {showHistory ? (
          <div className="history-view">
            <button onClick={toggleHistory}>Back</button>
            <HistoryList history={analysisHistory} />
          </div>
        ) : (
          <div className="upload-view">
            <button onClick={toggleHistory}>History</button>
            <UploadForm onAnalysisComplete={addToHistory} token={token} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;