import React, { useState, useEffect } from 'react';
import './css/DiseaseIdentification.css';

function DiseaseIdentification() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Fetch the available disease classes from the backend when component mounts
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/classes');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setError("Failed to connect to the server. Please make sure the backend is running.");
      }
    };
    
    fetchClasses();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    
    // Create preview of the selected image
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error during prediction:", error);
      setError("Failed to get prediction. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Plant Disease Predictor</h1>
          <p className="subtitle">Upload a leaf image to identify plant diseases</p>
        </div>
      </header>
      
      <div className="main-container">
        <div className="card prediction-container">
          <h2>Analyze Your Plant</h2>
          
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="file-input-container">
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                id="file-input"
                className="file-input"
                required 
              />
              <label htmlFor="file-input" className="file-label">
                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Choose Image
              </label>
              {file && <span className="file-name">{file.name}</span>}
            </div>
            
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Plant preview" />
              </div>
            )}
            
            <button 
              type="submit" 
              className="predict-button"
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                'Identify Disease'
              )}
            </button>
          </form>
          
          {prediction && (
            <div className="result">
              <h3>Diagnosis Result</h3>
              <div className="prediction-result">
                <svg className="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>{prediction}</span>
              </div>
            </div>
          )}
          
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <div className="card classes-container">
          <h2>Available Plant Diseases</h2>
          <div className="classes-list">
            {classes.length > 0 ? (
              <ul>
                {classes.map((cls) => (
                  <li key={cls}>
                    <svg className="leaf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                    {cls}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="loading-container">
                <span className="spinner"></span>
                <p>Loading available diseases...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
     
    </div>
  );
}

export default DiseaseIdentification;