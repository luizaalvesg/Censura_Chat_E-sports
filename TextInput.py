from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient
API_KEY = '7f04473048824fd08f0471279aee5b48'
API_KEYTEXT = '085752d0a73a4d1289075a99ba23e4e2'
ENDPOINT = 'https://censura-chat-esports-text-analysis.cognitiveservices.azure.com/'
REGIAO = "brazilsouth"

textInput = input("Digite uma frase para ser avaliada: ")

documents = [textInput]

client =  TextAnalyticsClient(
            endpoint = ENDPOINT,
            credential = AzureKeyCredential(API_KEYTEXT),
        )

response = client.analyze_sentiment(
    documents = documents,
    language = "pt-BR",
    show_opinion_mining = True,

)
# print(response)
print(response[0].sentiment)