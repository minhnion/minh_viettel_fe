import React, { useState} from 'react';
import { toast } from 'react-toastify';
import { analyzeImageApi } from '../../api/index';

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
      console.log('API Response:', response); // Debug the response
      const enhancedResponse = {
        ...response,
        storage_url: URL.createObjectURL(file), // Temporary URL for preview
        created_at: new Date().toISOString(),   // Add current time
      };
      setResult(enhancedResponse);
      onAnalysisComplete(enhancedResponse);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Analyze Error:', error);
      toast.error(error.message || 'Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  const getResultStyle = () => {
    const pred = result?.prediction || (result?.result && result.result.prediction) || 'Unknown';
    if (pred.toLowerCase().includes('real')) {
      return { backgroundColor: '#e6ffe6', color: '#28a745' };
    } else if (pred.toLowerCase().includes('fake')) {
      return { backgroundColor: '#ffe6e6', color: '#dc3545' };
    }
    return { backgroundColor: '#f0f0f0', color: '#555' };
  };

  const resultStyle = result ? getResultStyle() : {};

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
        <div className="analysis-result" style={{ backgroundColor: resultStyle.backgroundColor, color: resultStyle.color }}>
          <p><span style={{ fontWeight: 'bold' }}>Result: {result.prediction || (result.result && result.result.prediction) || 'Unknown'} </span><span style={{ fontSize: '1.2em' }}>{resultStyle.icon || (result.prediction.toLowerCase().includes('fake') ? '❌' : '✅')}</span></p>
          <p><span style={{ fontWeight: 'bold' }}>Confidence:</span> {((result.confidence || (result.result && result.result.confidence) || 0) * 100).toFixed(2)}%</p>
          <p><span style={{ fontWeight: 'bold' }}>Deepfake:</span> {(result.is_deepfake || (result.result && result.result.is_deepfake) || false) ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
