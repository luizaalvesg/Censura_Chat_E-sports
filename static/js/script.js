$(document).ready(function () {
    $('#enviar_mensagem').click(function () {
        var userMessage = $('#userMessage').val().toLowerCase();

        if (userMessage.trim() !== '') {
            $.post('/analyze_text', { text_input: userMessage }, function (data) {
                var sentiment = data.sentiment;

                if (sentiment === 'negative') {
                    alert('Mensagem negativa! Cuidado com o conteúdo.');
                    exibirMensagemNoChat(userMessage, 'text');
                } else {
                    $.post('/send_message', { user_message: userMessage, type: 'text' }, function (data) {
                        if (data.success) {
                            $('#userMessage').val('');
                            $('#chat').append('<div class="row"><div class="col"><div class="mensagem"><p>' + userMessage + '</p></div></div></div>');
                        }
                    });
                }
            });
        }
    });

    function exibirMensagemNoChat(message, messageType) {
        $.post('/send_message', { user_message: message, type: messageType }, function (data) {
            if (data.success) {
                $('#userMessage').val('');

                $('#chat').append('<div class="row"><div class="col"><div class="mensagem"><p>' + message + '</p></div></div></div>');
            }
        });
    }

    let mediaRecorder;
    let audioChunks = [];

    function enviarAudio() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.addEventListener("dataavailable", function (event) {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                });

                mediaRecorder.addEventListener("stop", function () {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    transcreverAudioParaTexto(audioBlob);
                });

                mediaRecorder.start();

                setTimeout(function () {
                    mediaRecorder.stop();
                }, 5000); // Gravação por 5 segundos (ajuste conforme necessário)
            })
            .catch(function (err) {
                console.error('Erro ao acessar o microfone: ', err);
            });
    }

    function transcreverAudioParaTexto(audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob);
    
        $.ajax({
            type: 'POST',
            url: '/transcrever_audio',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                const transcribedText = data.transcribed_text;
                if (transcribedText) {
                    exibirMensagemNoChat(transcribedText, 'text');
                } else {
                    console.error('Transcrição de áudio retornou texto indefinido.');
                }
            },
            error: function (error) {
                console.error('Erro na requisição AJAX:', error);
            }
        });
    }

    $('#enviar_audio').click(function () {
        enviarAudio();
    });
});