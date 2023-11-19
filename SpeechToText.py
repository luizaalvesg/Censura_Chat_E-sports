import azure.cognitiveservices.speech as speechsdk
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient
API_KEY = '7f04473048824fd08f0471279aee5b48'
API_KEYTEXT = '085752d0a73a4d1289075a99ba23e4e2'
ENDPOINT = 'https://censura-chat-esports-text-analysis.cognitiveservices.azure.com/'
REGIAO = "brazilsouth"

speech_config = speechsdk.translation.SpeechTranslationConfig(
    subscription = API_KEY, region = REGIAO)

speech_config.speech_recognition_language = "pt-BR"
audio_config = speechsdk.audio.AudioConfig(use_default_microphone = True)
speech_recognizer = speechsdk.SpeechRecognizer(speech_config = speech_config, audio_config = audio_config)

print("O microfone está sendo capturado! \n")

speech_recognition_result = speech_recognizer.recognize_once_async().get()
output = speech_recognition_result.text

print(output, "\n")

documents = [output]

client =  TextAnalyticsClient(
            endpoint = ENDPOINT,
            credential = AzureKeyCredential(API_KEYTEXT),
        )

response = client.analyze_sentiment(
    documents = documents,
    language = "pt-BR",
    show_opinion_mining = True,

)

print(response[0].sentiment)