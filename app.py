from flask import Flask, render_template, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient
import azure.cognitiveservices.speech as speechsdk

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

@app.route('/speech_to_text', methods=['GET'])
def speech_to_text():
    
    azure_key = '7f04473048824fd08f0471279aee5b48'
    azure_region = 'brazilsouth'
    speech_config = speechsdk.SpeechConfig(subscription=azure_key, region=azure_region)
    
    speech_config.speech_recognition_language = "pt-BR"
    
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)
    
    result = speech_recognizer.recognize_once_async().get()

    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        recognized_text = result.text
        return jsonify({'transcribed_text': recognized_text})
    elif result.reason == speechsdk.ResultReason.NoMatch:
        return jsonify({'transcribed_text': 'Não foi possível reconhecer a fala'})
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        return jsonify({'transcribed_text': f'Reconhecimento de fala cancelado. Motivo: {cancellation_details.error_details}'})

if __name__ == '__main__':
    app.run(debug=True)
