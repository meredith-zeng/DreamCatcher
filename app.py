from flask import Flask, request, jsonify
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from dreamCathcer import generate_mcq, generate_query
load_dotenv()

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/generate_mcq', methods=['POST'])
def generate_mcq_api():
    """
    API Endpoint for generating MCQs based on provided dream data.
    """
    # Parse incoming JSON data
    data = request.get_json()

    # Validate input
    if not data or 'dreamData' not in data:
        return jsonify({"error": "Invalid input. 'dreamData' are required."}), 400

    try:
        model = ChatOpenAI(model="gpt-4o-mini")
        result = generate_mcq(model, data)
        return jsonify({"status": "success", "result": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/generate_query', methods=['POST'])
def generate_query_endpoint():
    data = request.get_json()
    if 'mcqs' not in data:
        return jsonify({"error": "'mcqs' are required fields"}), 400

    try:
        model = ChatOpenAI(model="gpt-4o-mini")
        result = generate_query(model, data)
        return jsonify({"status": "success", "prompt": result}), 200

    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
