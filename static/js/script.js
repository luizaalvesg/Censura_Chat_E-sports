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