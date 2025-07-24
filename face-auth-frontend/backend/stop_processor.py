import boto3

rekognition = boto3.client('rekognition', region_name='us-east-1')

stream_processor_name = "face-auth-stream-proc"

try:
    response = rekognition.stop_stream_processor(Name=stream_processor_name)
    print("🛑 Stream processor stopped successfully:", response)
except Exception as e:
    print("❌ Failed to stop stream processor:", e)
