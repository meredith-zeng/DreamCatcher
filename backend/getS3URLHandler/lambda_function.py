import boto3
import json

# 初始化资源
dynamodb = boto3.resource('dynamodb')
lambda_client = boto3.client('lambda')
url_table = dynamodb.Table("dream_url")

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


def lambda_handler(event, context):
    try:
        # 1. 从 DynamoDB 表中获取 query 参数
        prompt_table = dynamodb.Table("dream_prompt")
        query_parameters = event.get('queryStringParameters', {})
        if not query_parameters:
            return create_response(200, False, "No query parameters provided")
            
        dream_id = query_parameters.get('dreamId')
        if not dream_id:
            return create_response(200, False, "Missing dreamId parameter")
        
        user_id = query_parameters.get('userId')
        if not user_id:
            return create_response(200, False, "Missing userId parameter")

         # 3. 从 dream_prompt 表中获取 prompt
        response = prompt_table.get_item(Key={'dream_id': dream_id})
        if 'Item' not in response:
            raise ValueError(f"No prompt found for dreamId: {dream_id}")

        prompt = response['Item']['prompt']
        print(f"Retrieved prompt: {prompt}")

        # 2. 检查 dream_url 表中是否已有 URL
        url_response = url_table.get_item(Key={'dream_id': dream_id})
        if 'Item' in url_response:
            # 如果 URL 已存在，直接返回
            s3_url = url_response['Item']['url']
            print(f"URL already exists in dream_url table: {s3_url}")
            return create_response(200, True, data={
                'prompt': prompt,  
                's3': s3_url
            })


        # 4. 调用其他 Lambda 函数
        Prompt2Image = "query_to_img"  # 替换为目标 Lambda 函数名
        lambda_payload = {
            'prompt': prompt,
            'user_id': user_id,
            'dream_id': dream_id
        }

        print(f"Invoking Lambda: {Prompt2Image} with payload: {lambda_payload}")
        lambda_response = lambda_client.invoke(
            FunctionName=Prompt2Image,
            InvocationType='RequestResponse',
            Payload=json.dumps(lambda_payload)
        )

        # 读取一次 Payload 内容并存储
        response_payload = lambda_response['Payload'].read().decode('utf-8')
        print(f"Lambda response payload: {response_payload}")

        # 解析 JSON 内容
        lambda_result = json.loads(response_payload)

        if 'http' in response_payload:
            s3_url = response_payload.strip().strip('"')  # 去除多余的空白字符和引号
        else:
            raise ValueError(f"Unexpected Lambda response: {response_payload}")

        print(f"Received S3URL: {s3_url}")

        # 5. 将结果存储到 dream_url 表中
        url_table.put_item(
            Item={
                'dream_id': dream_id,
                'url': s3_url
            }
        )

        # 6. 构建返回值
        result = {
            'prompt': prompt,
            's3': s3_url,
            'success': True
        }
        return create_response(200, True, data=result)

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'success': False
            })
        }