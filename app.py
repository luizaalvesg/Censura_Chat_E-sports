from flask import Flask, render_template, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

app = Flask(__name__)

API_KEY = '7f04473048824fd08f0471279aee5b48'
API_KEYTEXT = '085752d0a73a4d1289075a99ba23e4e2'
ENDPOINT = 'https://censura-chat-esports-text-analysis.cognitiveservices.azure.com/'
REGIAO = "brazilsouth"

@app.route('/')
def index():
    return render_template('index.html')

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

if __name__ == '__main__':
    app.run(debug=True)
