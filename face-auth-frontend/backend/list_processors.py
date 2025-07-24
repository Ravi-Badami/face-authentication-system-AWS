import boto3

rekognition = boto3.client('rekognition', region_name='us-east-1')

response = rekognition.list_stream_processors()
processors = response.get('StreamProcessors', [])

if not processors:
    print("⚠️ No stream processors found.")
else:
    for proc in processors:
        print(f"🔍 Name: {proc['Name']}, Status: {proc['Status']}")
