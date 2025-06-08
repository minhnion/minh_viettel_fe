import React, { useState, useEffect } from 'react';
import '../components/Home/HomePage.scss';import { toast } from 'react-toastify';
import { analyzeImageApi, getHistoryApi, logoutApi } from '../api/index';

// Component AnalysisItem
const AnalysisItem = ({ analysis }) => {
  const getResultStyle = () => {
    if (analysis.result.prediction.toLowerCase().includes('real')) {
      return { color: '#28a745', icon: '✅', backgroundColor: '#e6ffe6' };
    } else if (analysis.result.prediction.toLowerCase().includes('fake')) {
      return { color: '#dc3545', icon: '❌', backgroundColor: '#ffe6e6' };
    }
    return { color: '#555', icon: 'ℹ️', backgroundColor: '#f0f0f0' };
  };

  const resultStyle = getResultStyle();

  return (
    <div className="analysis-item" style={{ backgroundColor: resultStyle.backgroundColor }}>
      <img src={analysis.storage_url} alt="Analyzed" className="analysis-image" />
      <p>
        Result: <span style={{ color: resultStyle.color }}>{resultStyle.icon} {analysis.result.prediction}</span>
      </p>
      <p>Confidence: {(analysis.result.confidence * 100).toFixed(2)}%</p>
      <p>Time: {new Date(analysis.created_at).toLocaleString()}</p>
    </div>
  );
};

// Component HistoryList
const HistoryList = ({ history }) => {
  if (history.length === 0) {
    return <p>No analysis history available.</p>;
  }
  return (
    <div className="history-list">
      {history.map((item, index) => (
        <AnalysisItem key={index} analysis={item} />
      ))}
    </div>
  );
};

// Component UploadForm
const UploadForm = ({ onAnalysisComplete, token }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please select a file first!');
      return;
    }
    setLoading(true);
    try {
      const response = await analyzeImageApi(file, token);
      setResult(response);
      onAnalysisComplete(response);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <input type="file" onChange={handleFileChange} />
      {preview && (
        <div className="preview-frame">
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {result && (
        <div className="analysis-result">
          <p>Result: {result.prediction}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

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
          setAnalysisHistory(history);
        } catch (error) {
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