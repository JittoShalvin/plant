import React, { useState } from 'react';
import './css/App.css';

const DiseasePrediction = () => {
  const [locationName, setLocationName] = useState('');
  const [cropType, setCropType] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [highestDisease, setHighestDisease] = useState(null);
  const [solution, setSolution] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictions(null);
    setHighestDisease(null);
    setSolution('');
    setLocationData(null);

    try {
      // Use the new combined endpoint
      const response = await fetch('http://127.0.0.1:8054/predict_by_location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location_name: locationName,
          crop_type: cropType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Update state with all the data
      setPredictions(data.disease_probabilities);
      setHighestDisease(data.highest_predicted_disease);
      setSolution(data.solution);
      setLocationData(data.location_data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plant Disease Prediction</h1>
        <p>Enter location and crop type to predict possible diseases</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-group">
            <label htmlFor="location">Location Name:</label>
            <input 
              id="location"
              type="text" 
              placeholder="e.g. OMR, Anna Nagar" 
              value={locationName} 
              onChange={(e) => setLocationName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="crop">Crop Type:</label>
            <input 
              id="crop"
              type="text" 
              placeholder="e.g. Tomato, Grapes, Watermelon" 
              value={cropType} 
              onChange={(e) => setCropType(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Predict Diseases'}
          </button>
        </form>

        {loading && <div className="loading">Loading predictions...</div>}

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {locationData && (
          <div className="location-data">
            <h2>Environmental Conditions for {locationData.location_name}</h2>
            <div className="data-grid">
              <div className="data-item">
                <span className="label">Soil Type:</span>
                <span className="value">{locationData.soil_type}</span>
              </div>
              <div className="data-item">
                <span className="label">Temperature:</span>
                <span className="value">{locationData.temperature}°C</span>
              </div>
              <div className="data-item">
                <span className="label">Humidity:</span>
                <span className="value">{locationData.humidity}%</span>
              </div>
              <div className="data-item">
                <span className="label">Air Quality:</span>
                <span className="value">{locationData.air_quality}</span>
              </div>
            </div>
          </div>
        )}

        {highestDisease && (
          <div className="highest-prediction">
            <h2>Highest Risk: {highestDisease}</h2>
            <div className="solution">
              <h3>Recommended Solution:</h3>
              <p>{solution}</p>
            </div>
          </div>
        )}

        {predictions && (
          <div className="results">
            <h2>All Disease Probabilities</h2>
            <table className="prediction-table">
              <thead>
                <tr>
                  <th>Disease</th>
                  <th>Risk %</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(predictions)
                  .sort((a, b) => b[1] - a[1]) // Sort by highest probability
                  .map(([disease, probability]) => (
                    <tr key={disease} className={disease === highestDisease ? 'highest-risk' : ''}>
                      <td>{disease}</td>
                      <td>{typeof probability === 'number' ? probability.toFixed(2) : 'N/A'}%</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default DiseasePrediction;
