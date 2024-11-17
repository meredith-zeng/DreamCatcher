import boto3
import json
import base64
import os

client = boto3.client("bedrock-runtime", region_name="us-west-2")
s3 = boto3.client('s3')

def generate_img(event):
    model_id = "amazon.titan-image-generator-v2:0"

    request_body = {
        "textToImageParams": {
            "text": event["prompt"]
        },
        "taskType": "TEXT_IMAGE",
        "imageGenerationConfig": {
            "cfgScale": 8,
            "seed": 0,
            "quality": "standard",
            "width": 512,
            "height": 512,
            "numberOfImages": 1
        }
    }

    try:
        # Request image generation from the image model
        request = json.dumps(request_body)
        response = client.invoke_model(modelId=model_id, body=request)
        model_response = json.loads(response["body"].read())
        base64_image_data = model_response["images"][0]
        image_data = base64.b64decode(base64_image_data)

        bucket_name = 'dreamsimg'
        user_id = event["user_id"]
        dream_id = event["dream_id"]
        file_key = f'{user_id}/{dream_id}.png'

        # Upload image to S3
        s3.put_object(
            Bucket=bucket_name,
            Key=file_key,
            Body=image_data,
            ContentType='image/png'
        )
        # s3_uri = f"s3://{bucket_name}/{file_key}"
        s3_public_url = f"https://dreamsimg.s3.us-west-2.amazonaws.com/{file_key}"
        return s3_public_url

    except Exception as e:
        print(f"ERROR: {e}")
        return None


def lambda_handler(event, context):
    return generate_img(event)