from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import sys, io

current_input, current_output = '',  ''

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

@socketio.on('connect')
def handle_connect():
    socketio.emit('recieve-input-changes', current_input)
    socketio.emit('recieve-output-changes', current_output)

@socketio.on('send-input-changes')
def handle_send_changes(data):
    global current_input
    current_input = data
    socketio.emit('recieve-input-changes', data)

@socketio.on('disconnect')
def handle_disconnect():
    print('User disconnected')

@socketio.on('execute-code')
def handle_execution(code):
    global current_output

    old_stdout = sys.stdout
    new_stdout = io.StringIO()
    sys.stdout = new_stdout
    
    try:
        exec(code)
        output = new_stdout.getvalue()
    except Exception as e:
        output = str(e)
    finally:
        sys.stdout = old_stdout

    current_output = output
    socketio.emit('recieve-output-changes', output)
    
if __name__ == '__main__':
    PORT = 5000  
    socketio.run(app, host='localhost', port=PORT)
