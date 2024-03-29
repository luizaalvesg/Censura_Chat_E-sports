$(document).ready(function () {
  $("#userMessage").keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();
      var userMessage = $(this).val();
      if (userMessage.trim() !== "") {
        $("#enviar_mensagem").click();
      }
    }
  });
  $("#enviar_mensagem").click(function () {
    var userMessage = $("#userMessage").val();
    if (userMessage.trim() !== "") {
      $.post("/send_message", { user_message: userMessage }, function (data) {
        if (data.success) {
          $("#userMessage").val("");
          $("#chat").append(
            '<div class="row"><div class="col"><div class="mensagem"><p>' +
              userMessage +
              "</p></div></div></div>"
          );
        }
      });
    }
  });
});

$(document).ready(function () {
  function limparChat() {
    $("#chat").empty();
  }

  limparChat();

  $("#enviar_mensagem").click(function () {
    var userMessage = $("#userMessage").val().toLowerCase();

    if (userMessage.trim() !== "") {
      $.post("/analyze_text", { text_input: userMessage }, function (data) {
        var sentiment = data.sentiment;

        if (sentiment === "negative") {
          alert("Mensagem negativa! Cuidado com o conteúdo.");
          exibirMensagemNoChat(userMessage);
        }
      });
    }
  });

  function exibirMensagemNoChat(message) {
    $.post("/send_message", { user_message: message }, function (data) {
      if (data.success) {
        $("#userMessage").val("");

        $.post("/analyze_text", { text_input: message }, function (data) {
          var sentiment = data.sentiment;

          if (sentiment === "negative") {
            message =
              "[Esta mensagem foi reportada devido ao seu conteúdo negativo.]";
          }

          $("#chat").append(
            '<div class="row"><div class="col"><div class="mensagem"><p>' +
              message +
              "</p></div></div></div>"
          );
        });
      }
    });
  }
});

$(document).ready(function () {
  $("#btnVoiceChat").click(function () {
    $("#voiceStatus").text(
      "Iniciando chat por voz. Fale para iniciar a transcrição."
    );
    setTimeout(function () {
        $("#voiceStatus").text(""); 
      }, 3000);
    $.ajax({
      type: "GET",
      url: "/speech_to_text", 
      success: function (data) {
        var voiceMessage = data.transcribed_text;
        if (voiceMessage && voiceMessage.trim() !== "") {
          processVoiceMessage(voiceMessage);
        }
      },
      error: function (error) {
        console.log("Erro ao processar a gravação de voz:", error);
      },
    });
  });

  // Função para processar e exibir a mensagem no chat
  function processVoiceMessage(message) {
    $.post("/analyze_text", { text_input: message }, function (data) {
      var sentiment = data.sentiment;

      if (sentiment === "negative") {
        alert("Mensagem negativa! Cuidado com o conteúdo.");
        message =
          "[Esta mensagem foi reportada devido ao seu conteúdo negativo.]";
      }

      exibirMensagemNoChat(message);
    });
  }

  function exibirMensagemNoChat(message) {
    $.post("/send_message", { user_message: message }, function (data) {
      if (data.success) {
        $("#chat").append(
          '<div class="row"><div class="col"><div class="mensagem"><p>' +
            message +
            "</p></div></div></div>"
        );
      }
    });
  }
});
