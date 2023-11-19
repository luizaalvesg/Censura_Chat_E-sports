$(document).ready(function () {
    $('#enviar_mensagem').click(function () {
        var userMessage = $('#userMessage').val()
        if (userMessage.trim() !== '') {
            $.post('/send_message', { user_message: userMessage }, function (data) {
                if (data.success) {
                    $('#userMessage').val('')
                    $('#chat').append('<div class="row"><div class="col"><div class="mensagem"><p>' + userMessage + '</p></div></div></div>')
                }
            });
        }
    });
});

$(document).ready(function () {
    function limparChat() {
        $('#chat').empty();
    }

    limparChat();

    $('#enviar_mensagem').click(function () {
        var userMessage = $('#userMessage').val().toLowerCase();

        if (userMessage.trim() !== '') {
            $.post('/analyze_text', { text_input: userMessage }, function (data) {
                var sentiment = data.sentiment;

                if (sentiment === 'negative') {
                    alert('Mensagem negativa! Cuidado com o conteúdo.');
                    exibirMensagemNoChat(userMessage);
                }
            });
        }
    });

    function exibirMensagemNoChat(message) {
        $.post('/send_message', { user_message: message }, function (data) {
            if (data.success) {
                $('#userMessage').val('');

                $.post('/analyze_text', { text_input: message }, function (data) {
                    var sentiment = data.sentiment;

                    if (sentiment === 'negative') {
                        message = '[Esta mensagem foi reportada devido ao seu conteúdo negativo.]';
                    }

                    $('#chat').append('<div class="row"><div class="col"><div class="mensagem"><p>' + message + '</p></div></div></div>');
                });
            }
        });
    }
});


