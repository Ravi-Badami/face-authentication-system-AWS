import boto3

rekognition = boto3.client('rekognition', region_name='us-east-1')

stream_processor_name = "face-auth-stream-proc"

response = rekognition.start_stream_processor(Name=stream_processor_name)
print("✅ Stream processor started:", response)
