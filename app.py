from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates')

messages = []

@app.route('/')
def index():
    return render_template('index.html', messages=messages)

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.form.get('user_message')
    messages.append({'type': 'user', 'text': user_message})
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)