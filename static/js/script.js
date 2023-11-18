function analyzeText() {
    var textInput = document.getElementById('textInput').value;

    $.ajax({
        type: 'POST',
        url: '/analyze_text',
        data: {text_input: textInput},
        success: function(response) {
            var resultElement = document.getElementById('result');
            resultElement.innerHTML = 'Resultado da frase: ' + response.sentiment;
        }
    });
}

// var subscriptionKey = "7f04473048824fd08f0471279aee5b48";
//         var region = "brazilsouth";
//         var speechConfig = {
//           subscriptionKey: subscriptionKey,
//           region: region
//         };
    
//         var recognizer = new CognitiveServices.Speech.Recognizer(speechConfig);
//         var audioConfig = new CognitiveServices.Speech.AudioConfig({
//           useDefaultMicrophone: true
//         });
    
//         recognizer.recognizeOnceAsync(audioConfig, function (result) {
//           if (result.error) {
//             console.error(result.error);
//             return;
//           }
    
//           var output = result.text;
//           $("#output").text(output);
    
//           var documents = [output];
//           var client = new TextAnalyticsClient({
//             endpoint: "https://censura-chat-esports-text-analysis.cognitiveservices.azure.com/",
//             credential: new CognitiveServices.Credentials.AzureKeyCredential("085752d0a73a4d1289075a99ba23e4e2"),
//           });
    
//           client.analyzeSentiment(documents, "pt-BR", { showOpinionMining: true }).then(function (response) {
//             var sentiment = response.documents[0].sentiment;
//             console.log(sentiment);
    
//             if (sentiment === "negative") {
//               alert("Profanity detected!");
//             }
//           });
//         });

// var recognition = new webkitSpeechRecognition() || new SpeechRecognition();
//         recognition.lang = 'pt-BR';
//         recognition.continuous = true;
//         recognition.interimResults = true;

//         recognition.onresult = function(event) {
//             var transcript = event.results[event.results.length - 1][0].transcript;
//             document.getElementById('output').textContent = transcript;
//             sendVoiceData(transcript);
//         };

//         function startRecording() {
//             recognition.start();
//         }

//         function stopRecording() {
//             recognition.stop();
//         }

//         function sendVoiceData(transcript) {
//             $.ajax({
//                 type: 'POST',
//                 url: '/analyze_text',
//                 data: {text_input: transcript},
//                 success: function(response) {
//                     var resultElement = document.getElementById('output');
//                     resultElement.textContent = 'Sentimento: ' + response.sentiment;
//                 }
//             });
//         }