/**
 * Filename: sophisticated_code.js
 * 
 * Description: This code demonstrates a sophisticated implementation of a real-time chat application using JavaScript,
 * HTML, and CSS. It includes features like user authentication, real-time messaging, typing indicators, and message
 * deletion. The code is organized using an MVC (Model-View-Controller) architecture for modularity and scalability.
 * 
 * Please note that this is a simplified version of a real-world chat application and may not include all necessary
 * dependencies, libraries, or error handling.
 */

// Model: Responsible for managing data and interactions with servers and databases
const model = (() => {
  // Private variables
  let currentUser;
  let messageList = [];

  // Private methods
  const saveMessageToServer = (message) => {
    // Simulate server request to save message
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.9) {
          resolve();
        } else {
          reject("Failed to save message to server.");
        }
      }, 500);
    });
  };

  // Public methods
  const loginUser = (username, password) => {
    // Simulate authentication request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "admin" && password === "password") {
          currentUser = { username };
          resolve();
        } else {
          reject("Invalid username or password.");
        }
      }, 500);
    });
  };

  const getCurrentUser = () => {
    return currentUser;
  };

  const sendMessage = async (message) => {
    messageList.push(message);
    await saveMessageToServer(message);
    return message;
  };

  const deleteMessage = (messageId) => {
    messageList = messageList.filter((message) => message.id !== messageId);
  };

  return {
    loginUser,
    getCurrentUser,
    sendMessage,
    deleteMessage,
  };
})();

// View: Responsible for rendering HTML elements and handling user interactions
const view = (() => {
  // Private constants
  const MESSAGE_CONTAINER_ID = "message-container";
  const MESSAGE_INPUT_ID = "message-input";
  const LOGIN_FORM_ID = "login-form";
  const USERNAME_INPUT_ID = "username";
  const PASSWORD_INPUT_ID = "password";

  // Private variables
  let typingTimeout;

  // Private methods
  const createMessageElement = (message) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `
      <div class="message-sender">${message.sender}</div>
      <div class="message-content">${message.content}</div>
    `;

    return messageElement;
  };

  const scrollToBottom = () => {
    const messageContainer = document.getElementById(MESSAGE_CONTAINER_ID);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };

  const showTypingIndicator = () => {
    document.getElementById("typing-indicator").style.opacity = "1";
  };

  const hideTypingIndicator = () => {
    document.getElementById("typing-indicator").style.opacity = "0";
  };

  // Public methods
  const init = () => {
    document.getElementById(LOGIN_FORM_ID).addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById(USERNAME_INPUT_ID).value;
      const password = document.getElementById(PASSWORD_INPUT_ID).value;

      model
        .loginUser(username, password)
        .then(() => {
          showChatInterface();
        })
        .catch((error) => {
          alert(error);
        });
    });

    document.getElementById(MESSAGE_INPUT_ID).addEventListener("input", () => {
      clearTimeout(typingTimeout);
      showTypingIndicator();
      typingTimeout = setTimeout(() => {
        hideTypingIndicator();
      }, 1000);
    });

    document.getElementById("send-button").addEventListener("click", () => {
      const messageContent = document.getElementById(MESSAGE_INPUT_ID).value;
      if (messageContent.trim() !== "") {
        model.sendMessage({
          id: Date.now(),
          content: messageContent,
          sender: model.getCurrentUser().username,
        });
        document.getElementById(MESSAGE_INPUT_ID).value = "";
      }
    });
  };

  const showChatInterface = () => {
    document.getElementById(LOGIN_FORM_ID).style.display = "none";
    document.getElementById("chat-interface").style.display = "block";
    document.getElementById(MESSAGE_INPUT_ID).focus();
  };

  const renderMessage = (message) => {
    const messageContainer = document.getElementById(MESSAGE_CONTAINER_ID);
    const messageElement = createMessageElement(message);
    messageContainer.appendChild(messageElement);
    scrollToBottom();
  };

  const deleteMessage = (messageId) => {
    document.getElementById(messageId).remove();
  };

  return {
    init,
    renderMessage,
    deleteMessage,
  };
})();

// Controller: Responsible for handling user inputs and updating the model and view
const controller = ((model, view) => {
  // Private methods
  const handleIncomingMessage = (message) => {
    view.renderMessage(message);
  };

  // Public methods
  const init = () => {
    view.init();
  };

  const handleOutgoingMessage = async () => {
    const message = await model.sendMessage(/* message content */);
    view.renderMessage(message);
  };

  const handleDeleteMessage = (messageId) => {
    model.deleteMessage(messageId);
    view.deleteMessage(messageId);
  };

  return {
    init,
    handleIncomingMessage,
    handleOutgoingMessage,
    handleDeleteMessage,
  };
})(model, view);

// Initialize the application
controller.init();