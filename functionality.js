<script>
function displayMessage(message, isUser) {
  var chatDisplay = $("#chat-display");
  var messageClass = isUser ? "user-message" : "ai-message";
  var messageHtml = '<div class="' + messageClass + ' chat-message">' + message + '</div>';
  chatDisplay.append(messageHtml);
  // Scroll to the bottom of the chat display
  chatDisplay.scrollTop(chatDisplay[0].scrollHeight);
}





function sendMessage() {
  var userInput = $("#user-input").val();
  if (!userInput) return;

  var isHelloOrHi = userInput.toLowerCase() === "hello" || userInput.toLowerCase() === "hi";
  
  // Display user's message
  displayMessage(userInput, true);
  
  // Logic to respond with "Yes" if user says "Hello" or "Hi"
  if (isHelloOrHi) {
    displayMessage("Hi there. I am your personal AI doctor maid by Zubair. Please ask me any medical query related to your health or psychological problems", false);
    $("#user-input").val(""); // Clear input field
    return;
  }

  var requestData = {
    "model": "gpt-3.5-turbo-16k",
    "messages": [{"role": "user", "content": "If the question is only related to medical, diseases, treatments then answer and if its off topic respond 'Sorry, Please ask any question related to your medical or Psychological health' only: " + userInput}], // Add "Medical: " prefix
    "temperature": 0.6
  };


  $.ajax({
    url: "https://app.oxyapi.uk/v1/chat/completions",
    type: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer oxy-6aGszfwSYGf3gSSJLr8NIDocwvQGIEXcHs3fO8WIDeVGG"
    },
    data: JSON.stringify(requestData),
    success: function(data) {
      var choices = data.choices;
      for (var i = 0; i < choices.length; i++) {
        var aiResponse = choices[i].message.content;
        displayMessage(formatResponse(aiResponse), false);
      }
    },
    error: function(xhr, status, error) {
      displayMessage("Error: " + error, false);
    }
  });

  // Clear input field
  $("#user-input").val("");
}

function formatResponse(response) {
  // Check if the response contains code
  if (response.includes("```")) {
    // Wrap code in <code> tags
    response = response.replace(/```([^```]+)```/g, '<div class="code-block">$1</div>');
  }
  return response;
}
</script>
