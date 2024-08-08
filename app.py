from flask import Flask, Blueprint, request, jsonify
import services

app = Flask(__name__)

# Create blueprint with a url prefix
api = Blueprint('api', __name__, url_prefix='/api')

# Global variables
questions = ""

@api.route('/questions', methods=['POST'])
def create_questions(): 
    global questions # Access the global variable
    request_data = request.get_json() # Get the request data

    open_ai_response = services.get_questions(request_data['topic']) # Call the get_questions function from services.py
    questions = [q.strip() for q in open_ai_response.split("\n") if q.strip()] # Store the questions in the global variable, strip trailing spaces, and filter out empty strings

    return jsonify(questions), 200

@api.route('/script', methods=['POST'])
def generate_script():
    request_data = request.get_json() # Get the request data

    character = request_data['character'] # Store the character in the global variable

    open_ai_response = services.get_script(questions, character) # Call get_script function to generate script using questions and character
    script = open_ai_response.split("\n")
    script = [q for q in open_ai_response.split("\n") if q.strip()] # Store in script variable, split the response into lines and filter out empty strings

    return jsonify(script), 200

# Register blueprint to the app
app.register_blueprint(api)

if __name__ == '__main__':
    app.run(debug=True)
