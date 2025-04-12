from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Timer
import webbrowser
import pandas as pd
import random
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load the preprocessed soil plant disease dataset
file_path = 'preprocessed_soil_plant_disease_data.csv'
data = pd.read_csv(file_path)

# Load location data
try:
    location_file_path = 'chennaidata.csv'
    location_data = pd.read_csv(location_file_path)

    # Ensure required columns exist in location_data
    if 'Humidity' not in location_data.columns:
        location_data['Humidity'] = round(random.uniform(60, 90), 1)  # Default humidity
    if 'Air_Quality' not in location_data.columns:
        location_data['Air_Quality'] = random.randint(1, 5)  # Default air quality
    
    print(f"Loaded location data with {len(location_data)} entries.")
except FileNotFoundError:
    print("Warning: chennaidata.csv not found. Predictions will be affected.")
    location_data = pd.DataFrame(columns=['Location', 'Soil_Type', 'Temperature', 'Humidity', 'Air_Quality'])

# Features (X) and target variables (y)
X = data[['soil_type', 'temperature', 'humidity', 'air_quality', 'crop_type']]
y = data[['Blight_Score', 'Canker_Score', 'Leaf_Gall_Score', 'Leaf_Curl_Score', 
          'Leaf_Spots_Score', 'Mildew_Score', 'Rot_Score', 'Wilt_Score', 
          'Stunting_Score', 'Chlorosis_Score']]

# Convert categorical variable 'crop_type' to dummy variables
X = pd.get_dummies(X, columns=['crop_type'], drop_first=True)

# Split dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the Random Forest model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Disease treatment solutions dictionary
disease_solutions = {
    'Blight': "Remove infected plant parts and improve air circulation. Apply fungicides if necessary.",
    'Canker': "Cut away affected branches or stems. Disinfect tools before and after cutting.",
    'Leaf Gall': "Prune and discard infected leaves or stems. Use insecticides if pests are involved.",
    'Leaf Curl': "Use appropriate insecticides for pests. Ensure proper watering and avoid windy planting areas.",
    'Leaf Spots': "Remove and discard infected leaves. Avoid overhead watering to reduce humidity.",
    'Mildew': "Improve air circulation and reduce humidity. Remove infected plant parts.",
    'Rot': "Ensure proper drainage and avoid waterlogging. Remove affected plant parts.",
    'Wilt': "Check for proper watering practices. Improve soil drainage.",
    'Stunting': "Ensure balanced fertilization and good soil health. Check for root damage.",
    'Chlorosis': "Often caused by nutrient deficiencies. Test soil and adjust fertilization accordingly."
}

# New endpoint that combines location lookup and prediction
@app.route('/predict_by_location', methods=['POST'])
def predict_by_location():
    try:
        data = request.json
        location_name = data.get('location_name')
        crop_type = data.get('crop_type')

        if not location_name or not crop_type:
            return jsonify({'error': 'Both location_name and crop_type are required'}), 400

        # Find location data - case-insensitive search
        location_info = location_data[location_data['Location'].str.lower() == location_name.lower()]

        if location_info.empty:
            return jsonify({'error': f'Location "{location_name}" not found in dataset'}), 404

        # Extract environmental data from the CSV file
        soil_type = int(location_info['Soil_Type'].iloc[0])
        temperature = float(location_info['Temperature'].iloc[0])
        humidity = float(location_info['Humidity'].iloc[0])
        air_quality = int(location_info['Air_Quality'].iloc[0])

        # Prepare the input data for prediction
        location_features = pd.DataFrame([{
            'soil_type': soil_type,
            'temperature': temperature,
            'humidity': humidity,
            'air_quality': air_quality,
            'crop_type': crop_type
        }])

        # Convert categorical variable 'crop_type' to dummy variables
        location_features = pd.get_dummies(location_features, columns=['crop_type'])

        # Ensure all expected columns exist
        for col in X_train.columns:
            if col not in location_features.columns:
                location_features[col] = 0  # Add missing columns with default 0

        # Reorder columns to match model input format
        location_features = location_features[X_train.columns]

        # Make prediction
        predictions = model.predict(location_features)

        # Define disease names
        disease_names = ['Blight', 'Canker', 'Leaf Gall', 'Leaf Curl', 'Leaf Spots', 
                         'Mildew', 'Rot', 'Wilt', 'Stunting', 'Chlorosis']

        # Prepare response
        response = {
            'location_data': {
                'location_name': location_name,
                'soil_type': soil_type,
                'temperature': temperature,
                'humidity': humidity,
                'air_quality': air_quality,
                'crop_type': crop_type
            },
            'disease_probabilities': {disease: float(prob * 100) for disease, prob in zip(disease_names, predictions[0])}
        }

        # Find highest probability disease and provide solution
        highest_prob_index = predictions[0].argmax()
        highest_prob_disease = disease_names[highest_prob_index]
        response['highest_predicted_disease'] = highest_prob_disease
        response['solution'] = disease_solutions.get(highest_prob_disease, "No solution available")

        return jsonify(response)

    except Exception as e:
        print(f"Error in predict_by_location: {str(e)}")
        return jsonify({'error': f'Error making prediction: {str(e)}'}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

# List sample locations from CSV
@app.route('/sample_locations', methods=['GET'])
def sample_locations():
    try:
        if location_data.empty:
            return jsonify({'error': 'No location data available'}), 404
        return jsonify({'locations': location_data['Location'].tolist(), 'count': len(location_data)})
    except Exception as e:
        return jsonify({'error': f'Error retrieving sample locations: {str(e)}'}), 500

# Display dataset structure
@app.route('/db_structure', methods=['GET'])
def db_structure():
    try:
        return jsonify({
            'location_data': {
                'file': 'chennaidata.csv',
                'columns': location_data.columns.tolist(),
                'sample_rows': location_data.head(3).to_dict('records')
            },
            'soil_plant_disease_data': {
                'file': 'preprocessed_soil_plant_disease_data.csv',
                'columns': data.columns.tolist(),
                'sample_rows': data.head(3).to_dict('records')
            }
        })
    except Exception as e:
        return jsonify({'error': f'Error retrieving database structure: {str(e)}'}), 500

# Run Flask app
if __name__ == '__main__':
    port = 8054  # Set the port number for the main app
    Timer(1, [f'http://127.0.0.1:{port}/']).start()  # Open the main app in the browser
    app.run(debug=True, port=port)


