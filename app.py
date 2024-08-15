from flask import Flask, Blueprint, request, jsonify
import services

app = Flask(__name__)

# Create blueprint with a url prefix
api = Blueprint('api', __name__, url_prefix='/api')

# Global variables
questions = ""
script = ""
character = ""

@api.route('/questions', methods=['POST'])
def generate_questions(): 
    global questions # Access the global variable

    request_data = request.get_json() # Get the request data

    open_ai_response = services.get_questions(request_data['topic']) # Call the get_questions function from services.py
    
    questions = [q.strip() for q in open_ai_response.split("\n") if q.strip()] # Store the questions in the global variable, strip trailing spaces, and filter out empty strings

    return jsonify(questions), 200

@api.route('/script', methods=['POST'])
def generate_script():
    global script, character # Access the global variable

    request_data = request.get_json() # Get the request data

    character = request_data['character'] # Store the character in the global variable

    open_ai_response = services.get_script(questions, character) # Call get_script function to generate script using questions and character

    script = [q for q in open_ai_response.split("\n") if q.strip()] # Store in script variable, split the response into lines and filter out empty strings

    script = " ".join(script) # Join the lines into a single string

    return jsonify(script), 200

@api.route('/voiceover', methods=['GET'])
def generate_voiceover():
    response = services.get_voiceover(script, character) # Call get_voiceover function to generate voiceover using script

    return jsonify(response), 200

@api.route('/timestamps', methods=['POST'])
def split_voiceover():
    request_data = request.get_json() # Get the request data

    timestamps = request_data # Get the timestamps

    response = services.split_voiceover(timestamps) # Call apply_timestamps function

    return jsonify(response), 200

@api.route('/video', methods=['GET'])
def create_video():
    response = services.create_video(questions, character) # Call create_video function to create video

    return jsonify(response), 200

@api.route('/reset', methods=['GET'])
def reset():
    global questions, script, character

    questions = ""
    script = ""
    character = ""

    return jsonify("Reset successful"), 200

# Register blueprint to the app
app.register_blueprint(api)

if __name__ == '__main__':
    app.run(debug=True)
