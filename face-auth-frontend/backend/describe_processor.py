import boto3

rekognition = boto3.client('rekognition', region_name='us-east-1')

response = rekognition.describe_stream_processor(Name="face-auth-stream-proc")
print("🔍 Detailed Stream Processor Info:")
print("Status:", response["Status"])
print("Status Message:", response.get("StatusMessage", "No message"))
print("Input:", response["Input"])
print("Output:", response["Output"])
