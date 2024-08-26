from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS
socketio = SocketIO(app)

app = Flask(__name__)
socketio = SocketIO(app)

@socketio.on('connect')
def handle_connect():
    print('User connected')

@socketio.on('send-changes')
def handle_send_changes(data):
    socketio.emit('recieve-changes', data, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    print('User disconnected')

if __name__ == '__main__':
    PORT = 5000  
    socketio.run(app, host='localhost', port=PORT)
