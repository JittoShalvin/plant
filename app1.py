from flask import Flask, request, jsonify
from flask_cors import CORS

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
import os


app = Flask(__name__)

# Enable CORS
CORS(app)

# Load the trained model

model_path = 'E:/miniproject/PlantDoc-Dataset-master/plant_disease_best_model.h5'
model = load_model(model_path)

# Define the classes based on the training data
class_labels = [
    'Apple Scab',
    'Apple Black Rot',
    'Cedar Apple Rust',
    'Corn Gray Leaf Spot',
    'Corn Northern Leaf Blight',
    'Corn Southern Leaf Blight',
    'Grape Black Rot',
    'Grape Esca',
    'Grape Leaf Blight',
    'Peach Bacterial Spot',
    'Peach Leaf Curl',
    'Peach Scab',
    'Potato Early Blight',
    'Potato Late Blight',
    'Potato Scab',
    'Tomato Bacterial Spot',
    'Tomato Early Blight',
    'Tomato Late Blight',
    'Tomato Septoria Leaf Spot',
    'Tomato Yellow Leaf Curl Virus',
    'Tomato Mosaic Virus',
    'Tomato Leaf Mold',
    'Tomato Target Spot',
    'Tomato Blight',
    'Tomato Wilt',
    'Tomato Powdery Mildew'
]


@app.route('/classes', methods=['GET'])
def get_classes():
    return jsonify(class_labels)

@app.route('/predict', methods=['POST'])

def predict():
    os.makedirs('temp', exist_ok=True)  # Create temp directory if it doesn't exist
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided. Please upload an image file.'}), 400


    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected. Please select an image file to upload.'}), 400


    # Validate file type
    if not file.content_type.startswith('image/'):
        return jsonify({'error': 'Invalid file type. Please upload an image file.'}), 400

    # Load and preprocess the image

    img_path = os.path.join('temp', file.filename)
    file.save(img_path)
    image = load_img(img_path, target_size=(224, 224))
    image = img_to_array(image) / 255.0
    image = np.expand_dims(image, axis=0)

    # Make prediction
    prediction = model.predict(image)
    predicted_class = class_labels[np.argmax(prediction)]

    # Clean up the temporary file
    os.remove(img_path)

    return jsonify({'prediction': predicted_class})

if __name__ == '__main__':
    app.run(debug=True)
