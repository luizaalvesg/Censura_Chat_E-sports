from flask import Flask, render_template, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient
import requests

app = Flask(__name__)

API_KEY = '7f04473048824fd08f0471279aee5b48'
API_KEYTEXT = '085752d0a73a4d1289075a99ba23e4e2'
ENDPOINT = 'https://censura-chat-esports-text-analysis.cognitiveservices.azure.com/'
REGIAO = "brazilsouth"

messages = []

@app.route('/')
def index():
    return render_template('index.html', messages=messages)

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.form.get('user_message')
    messages.append({'type': 'user', 'text': user_message})
    return jsonify({'success': True})

@app.route('/analyze_text', methods=['POST'])
def analyze_text():
    text_input = request.form['text_input']

    client = TextAnalyticsClient(
        endpoint=ENDPOINT,
        credential=AzureKeyCredential(API_KEYTEXT),
    )

    documents = [text_input]
    response = client.analyze_sentiment(
        documents=documents,
        language="pt-BR",
        show_opinion_mining=True,
    )

    sentiment = response[0].sentiment
    return jsonify({'sentiment': sentiment})

@app.route('/transcrever_audio', methods=['POST'])
def transcrever_audio():
    try:
        audio_data = request.files['audio'].read()

        headers = {
            'Content-Type': 'audio/wav',
            'Ocp-Apim-Subscription-Key': API_KEY,
        }

        params = {
            'language': 'pt-BR',
        }

        response = requests.post(ENDPOINT + '/speechtotext/v3.0/recognize', headers=headers, params=params, data=audio_data)

        if response.status_code == 200:
            transcribed_text = response.json().get('DisplayText', '')
            return jsonify({'transcribed_text': transcribed_text})
        else:
            return jsonify({'error': f'Erro na transcrição de áudio. Código de status: {response.status_code}'})
    except Exception as e:
        return jsonify({'error': f'Erro interno no servidor: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)