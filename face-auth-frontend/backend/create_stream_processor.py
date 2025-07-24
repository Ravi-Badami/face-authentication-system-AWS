import boto3

rekognition = boto3.client('rekognition', region_name='us-east-1')

response = rekognition.create_stream_processor(
    Name="face-auth-stream-proc",
    Input={
        "KinesisVideoStream": {
            "Arn": "arn:aws:kinesisvideo:us-east-1:202533527757:stream/face-auth-stream/1697444123493"
        }
    },
    Output={
        "KinesisDataStream": {
            "Arn": "arn:aws:kinesis:us-east-1:202533527757:stream/face-auth-results"
        }
    },
    RoleArn="arn:aws:iam::202533527757:role/RekognitionStreamSNSRole",
    Settings={
        "FaceSearch": {
            "CollectionId": "my-rekognition-collection",
            "FaceMatchThreshold": 85.0
        }
    }
)

print("✅ Stream processor created:", response)
