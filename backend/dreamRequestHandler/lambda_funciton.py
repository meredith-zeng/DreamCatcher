import json
import boto3
import os
import uuid
import requests
from botocore.exceptions import ClientError

# Initialize AWS clients
dynamodb = boto3.client('dynamodb')
lambda_client = boto3.client('lambda')

# Environment variables
DREAMS_TABLE_NAME = os.environ.get('DREAMS_TABLE_NAME', 'dreams')
DREAM_INFO_TABLE_NAME = os.environ.get('DREAM_INFO_TABLE_NAME', 'dream_info')
DREAM_QUESTION_TABLE_NAME = os.environ.get('DREAM_QUESTION_TABLE_NAME', 'dream_questions')
mcq_service_url = "http://35.160.154.129:8000/generate_mcq"


def validate_input(body):
    """Validate input parameters."""
    required_fields = ['userId', 'dreamData']
    missing_fields = [field for field in required_fields if not body.get(field)]
    

    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
    
    return body['userId'], body['dreamData']

def insert_dream_records(dream_id, user_id, dream_data):
    """Insert records into dreams and dream_info tables."""
    try:
        # Insert into dreams table
        dreams_item = {
            "dream_id": {"S": dream_id},
            "user_id": {"S": user_id}
        }
        print("the Dream_item", dreams_item)

        dynamodb.put_item(TableName=DREAMS_TABLE_NAME, Item=dreams_item)
        print("the Dream table put success")
        # Insert into dream_info table
        dream_info_item = {
            "dream_id": {"S": dream_id},
            "dreamData": {"S": json.dumps(dream_data)}
        }
        dynamodb.put_item(TableName=DREAM_INFO_TABLE_NAME, Item=dream_info_item)
        print("the Dream info table put success")
        
    except ClientError as e:
        print(f"Failed to insert dream records: {str(e)}")
        raise

def generate_and_store_mcqs(dream_id, dream_data):
    """Generate MCQs using another Lambda and store them."""
    try:
        # Prepare payload for the MCQ generation service
        payload = {
            "userId": dream_id,  
            "dreamData": dream_data
        }
        
        # Make HTTP POST request to the external service
        print(f"Sending payload to MCQ service: {json.dumps(payload, indent=2)}")
        response = requests.post(mcq_service_url, json=payload)
        print(f"MCQ service response status code: {response.status_code}")
        
        if response.status_code != 200:
            raise Exception(f"MCQ service returned error: {response.text}")
        
        mcq_result = response.json()
        
        if mcq_result.get("status") != "success":
            raise Exception(f"MCQ service returned failure: {mcq_result.get('errorMessage', 'Unknown error')}")
        
        mcqs = mcq_result.get("result", {}).get("questions", [])
        
        # Store all MCQs as a single record
        question_item = {
            "dream_id": {"S": dream_id},
            "mcqs": {"S": json.dumps(mcqs)}
        }
        dynamodb.put_item(TableName=DREAM_QUESTION_TABLE_NAME, Item=question_item)
            
        return len(mcqs)
        
    except Exception as e:
        print(f"Failed to generate or store MCQs: {str(e)}")
        raise

def create_response(status_code, success, error_message="", data=None):
    """Create standardized API response."""
    body = {
        "success": success,
        "errorMessage": error_message,
        "data": data if data else {}
    }

    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body)
    }

def lambda_handler(event, context):
    """Main Lambda handler function."""
    print("Received event:", json.dumps(event, indent=2))

    try:
        # Log incoming request
        print(event["body"])
        # Parse and validate input
        
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})

        print("LOADS")
        user_id, dream_data = validate_input(body)
        print("log")

        # Generate new dream_id
        dream_id = str(uuid.uuid4())
        
        # Insert dream records
        insert_dream_records(dream_id, user_id, dream_data)
        
        # Generate and store MCQs
        generate_and_store_mcqs(dream_id, dream_data)
        
        return create_response(200, True, "", {
            "dreamId": dream_id
        })
        
    except ValueError as e:
        return create_response(200, False, str(e))
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return create_response(200, False, str(e))