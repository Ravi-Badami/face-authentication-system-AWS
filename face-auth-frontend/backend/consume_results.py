import boto3
import time
import json

kinesis = boto3.client('kinesis', region_name='us-east-1')

stream_name = 'face-auth-results'

# Describe the stream to get shard ID
response = kinesis.describe_stream(StreamName=stream_name)
shard_id = response['StreamDescription']['Shards'][0]['ShardId']

# Get shard iterator
shard_iterator = kinesis.get_shard_iterator(
    StreamName=stream_name,
    ShardId=shard_id,
    ShardIteratorType='LATEST'
)['ShardIterator']

print("🔁 Listening for face match results...")

# Read data in a loop
while True:
    out = kinesis.get_records(ShardIterator=shard_iterator, Limit=10)
    records = out['Records']

    for record in records:
        data = record['Data'].decode('utf-8')
        print("📦 Match result:", json.loads(data))

    shard_iterator = out['NextShardIterator']
    time.sleep(2)
