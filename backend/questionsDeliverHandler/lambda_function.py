import json
import boto3
import os
from botocore.exceptions import ClientError

# Create DynamoDB client
dynamodb = boto3.client('dynamodb')

# Get table name from environment variable
DREAM_QUESTION_TABLE_NAME = os.environ.get('DREAM_QUESTION_TABLE_NAME', 'dream_questions')

def create_response(status_code, success, error_message="", data=None):
    """Create a standardized API response"""
    body = {
        "success": success,
        "errorMessage": error_message
    }
    if data:
        body["data"] = data

    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"  # Enable CORS
        },
        "body": json.dumps(body)
    }

def get_dream_questions(dream_id):
    """Retrieve MCQs for a given dream ID from DynamoDB"""
    try:
        # Query DynamoDB with the correct attribute name
        response = dynamodb.query(
            TableName=DREAM_QUESTION_TABLE_NAME,
            KeyConditionExpression="dream_id = :dream_id",
            ExpressionAttributeValues={
                ":dream_id": {"S": dream_id}  # Provide the partition key value
            }
        )
        
        if not response['Items']:
            return None
            
        # Access the mcqs attribute and process it
        mcqs_raw = response['Items'][0]['mcqs']['S']  # Adjusted for mcqs attribute
        return json.loads(mcqs_raw)
        
    except ClientError as e:
        print(f"DynamoDB error: {str(e)}")
        raise
    except Exception as e:
        print(f"Error processing questions: {str(e)}")
        raise


def lambda_handler(event, context):
    """Main Lambda handler function"""
    try:
        # Log the incoming request
        print("Received event:", json.dumps(event, indent=2))
        
        # Get and validate dreamId from query parameters
        query_parameters = event.get('queryStringParameters', {})
        if not query_parameters:
            return create_response(200, False, "No query parameters provided")
            
        dream_id = query_parameters.get('dreamId')
        if not dream_id:
            return create_response(200, False, "Missing dreamId parameter")
        
        # Get MCQs for the dream
        mcqs = get_dream_questions(dream_id)
        if mcqs is None:
            return create_response(200, False, "No MCQs found for this dreamId")
        
        # Return successful response with MCQs
        return create_response(200, True, data={
            "dreamId": dream_id,
            "mcqs": mcqs
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return create_response(200, False, f"Internal server error: {str(e)}")