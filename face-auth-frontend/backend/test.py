import boto3

# Set up client
kinesis = boto3.client('kinesis', region_name='us-east-1')

# Your stream name
stream_name = 'face-auth-results'

# Step 1: Describe stream to get ShardId
stream_desc = kinesis.describe_stream(StreamName=stream_name)
shard_id = stream_desc['StreamDescription']['Shards'][0]['ShardId']

# Step 2: Get Shard Iterator
shard_iterator_response = kinesis.get_shard_iterator(
    StreamName=stream_name,
    ShardId=shard_id,
    ShardIteratorType='LATEST'
)

shard_iterator = shard_iterator_response['ShardIterator']

# Step 3: Get Records
record_response = kinesis.get_records(ShardIterator=shard_iterator, Limit=10)

print("📥 Records from stream:")
for record in record_response['Records']:
    print(record['Data'].decode())
