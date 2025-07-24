from flask import Flask, request, jsonify
import boto3
import os
from datetime import datetime
from flask_cors import CORS
from time import time

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Create uploads folder if it doesn't exist
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# AWS Clients
rekognition = boto3.client('rekognition', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
s3 = boto3.client('s3')

# AWS Resources
collection_id = 'my-rekognition-collection'
bucket_name = 'my-face-image-recognition'
users_table = dynamodb.Table('users')
login_logs_table = dynamodb.Table('LoginLogs')

# ✅ Registration Endpoint
@app.route('/api/register', methods=['POST'])
def api_register():
    username = request.form['username']
    file = request.files['image']

    filename = f"{username}_register.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Upload image to S3
    s3.upload_file(filepath, bucket_name, filename)

    # Index face in Rekognition
    rekognition.index_faces(
        CollectionId=collection_id,
        Image={"S3Object": {"Bucket": bucket_name, "Name": filename}},
        ExternalImageId=username,
        DetectionAttributes=['DEFAULT']
    )

    # Save user data in DynamoDB
    users_table.put_item(Item={
        'username': username,
        'registration_time': datetime.utcnow().isoformat(),
        'role': 'user',
        'image_path': f"s3://{bucket_name}/{filename}"
    })

    return jsonify({'message': f'User {username} registered successfully'})

# ✅ Login Endpoint
@app.route('/api/login', methods=['POST'])
def api_login():
    file = request.files.get('image')
    if not file:
        return jsonify({'error': 'No image uploaded'}), 400

    filename = f"login_{int(time())}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Upload image to S3
    s3.upload_file(filepath, bucket_name, filename)

    try:
        # Search face in collection
        response = rekognition.search_faces_by_image(
            CollectionId=collection_id,
            Image={'S3Object': {'Bucket': bucket_name, 'Name': filename}},
            FaceMatchThreshold=90,
            MaxFaces=1
        )
    except Exception as e:
        print(f"Rekognition error: {e}")
        return jsonify({'error': 'Rekognition failed'}), 500

    matches = response.get('FaceMatches', [])
    if matches:
        matched_user_id = matches[0]['Face']['ExternalImageId']

        # Log login attempt
        login_logs_table.put_item(Item={
            'username': matched_user_id,
            'timestamp': int(time()),
            'ip': request.remote_addr,
            'device': request.user_agent.string
        })

        return jsonify({'message': f'Welcome, {matched_user_id}!'})
    else:
        return jsonify({'error': 'Face not recognized'}), 401

# ✅ Logs Viewer Endpoint
@app.route('/api/logs')
def api_logs():
    response = login_logs_table.scan()
    logs = response.get('Items', [])
    logs.sort(key=lambda x: x['timestamp'], reverse=True)
    return jsonify(logs)

# ✅ Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
