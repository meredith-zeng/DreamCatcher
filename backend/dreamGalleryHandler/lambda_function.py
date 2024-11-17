import boto3
import json
from botocore.exceptions import BotoCoreError, ClientError
# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')

def get_dream_ids(user_id):
    """
    Query the 'dreams' table to retrieve all dream_ids for the given user_id.
    """
    dreams_table = dynamodb.Table("dreams")
    print(f"Querying dreams table for userId: {user_id}")

    try:
        response = dreams_table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('user_id').eq(user_id)
        )
    except Exception as e:
        raise Exception(f"Failed to query dreams table: {str(e)}")

    if 'Items' not in response or len(response['Items']) == 0:
        raise ValueError(f"No dreams found for userId: {user_id}")

    return [item['dream_id'] for item in response['Items']]


def get_dream_details(dream_id):
    """
    Fetch the 'prompt' and 'url' for a given dream_id from the 'dream_prompt' and 'dream_url' tables.
    """
    prompt_table = dynamodb.Table("dream_prompt")
    url_table = dynamodb.Table("dream_url")

    # Fetch prompt
    try:
        prompt_response = prompt_table.get_item(Key={'dream_id': dream_id})
        prompt = prompt_response.get('Item', {}).get('prompt', None)
    except Exception as e:
        print(f"Error fetching prompt for dream_id {dream_id}: {str(e)}")
        prompt = None

    # Fetch URL
    try:
        url_response = url_table.get_item(Key={'dream_id': dream_id})
        url = url_response.get('Item', {}).get('url', None)
    except Exception as e:
        print(f"Error fetching URL for dream_id {dream_id}: {str(e)}")
        url = None

    # Return the details for the current dream_id
    return {
        "dreamId": dream_id,
        "prompt": prompt,
        "url": url
    }


def lambda_handler(event, context):
    """
    Main Lambda function to handle the request.
    """
    try:
        # Extract userId from the event
        
        query_parameters = event.get('queryStringParameters', {})
        if not query_parameters:
            return create_response(200, False, "No query parameters provided")
            
        user_id = query_parameters.get('userId')
        if not user_id:
            return create_response(200, False, "Missing userId parameter")
        
        print(f"Fetching dream IDs for userId: {user_id}")
        dream_ids = get_dream_ids(user_id)

        # Fetch details for each dream_id
        dreams = []
        for dream_id in dream_ids:
            dream_details = get_dream_details(dream_id)
            # Add only if there's valid data
            if dream_details['prompt'] and dream_details['url']:
                dreams.append(dream_details)

        # Construct the response
        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "errorMessage": "",
                "dreams": dreams
            })
        }

    except ValueError as e:
        print(f"Validation error: {str(e)}")
        return {
            "statusCode": 400,
            "body": json.dumps({
                "success": False,
                "errorMessage": str(e),
                "dreams": []
            })
        }
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({
                "success": False,
                "errorMessage": str(e),
                "dreams": []
            })
        }