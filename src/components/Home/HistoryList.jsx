// Component AnalysisItem
const AnalysisItem = ({ analysis }) => {
  const getResultStyle = () => {
    const pred = analysis.prediction || (analysis.result && analysis.result.prediction) || 'Unknown';
    if (pred.toLowerCase().includes('real')) {
      return { color: '#28a745', icon: '✅', backgroundColor: '#e6ffe6' };
    } else if (pred.toLowerCase().includes('fake')) {
      return { color: '#dc3545', icon: '❌', backgroundColor: '#ffe6e6' };
    }
    return { color: '#555', icon: 'ℹ️', backgroundColor: '#f0f0f0' };
  };

  const resultStyle = getResultStyle();
  const confidence = analysis.confidence || (analysis.result && analysis.result.confidence) || 0;
  const isDeepfake = analysis.is_deepfake || (analysis.result && analysis.result.is_deepfake) || false;
  const prediction = analysis.prediction || (analysis.result && analysis.result.prediction) || 'Unknown';

  return (
    <div className="analysis-item" style={{ backgroundColor: resultStyle.backgroundColor }}>
      <div className="analysis-content">
        <img src={analysis.storage_url} alt="Analyzed" className="analysis-image" />
        <div className="analysis-details">
          <p>
            Result: <span style={{ color: resultStyle.color, fontWeight: 'bold' }}>{resultStyle.icon} {prediction}</span>
          </p>
          <p><span style={{ fontWeight: 'bold' }}>Confidence:</span> {(confidence * 100).toFixed(2)}%</p>
          <p><span style={{ fontWeight: 'bold' }}>Deepfake:</span> {isDeepfake ? 'Yes' : 'No'}</p>
          <p><span style={{ fontWeight: 'bold' }}>Time:</span> {analysis.created_at ? new Date(analysis.created_at).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
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

export default HistoryList;