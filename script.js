(function() {
    // Fetch the API key from the HTML attribute
    const apiKey = document.body.getAttribute('data-ravens-api-key');

    if (!apiKey) {
        console.error('API key is missing!');
        return;
    }
    
    // Create the chatbot button
  const chatButton = document.createElement('div');
  chatButton.id = 'chatbot-button';
  chatButton.style.position = 'fixed';
  chatButton.style.bottom = '20px';
  chatButton.style.right = '20px';
  chatButton.style.width = '60px';
  chatButton.style.height = '60px';
  chatButton.style.backgroundColor = '#007bff';
  chatButton.style.borderRadius = '50%';
  chatButton.style.cursor = 'pointer';
  chatButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  chatButton.style.display = 'flex';
  chatButton.style.justifyContent = 'center';
  chatButton.style.alignItems = 'center';
  chatButton.style.color = 'white';
  chatButton.style.fontSize = '24px';
  chatButton.innerText = '💬';
  document.body.appendChild(chatButton);

  // Create the chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chatbot-window';
  chatWindow.style.position = 'fixed';
  chatWindow.style.bottom = '100px';
  chatWindow.style.right = '20px';
  chatWindow.style.width = '300px';
  chatWindow.style.height = '400px';
  chatWindow.style.backgroundColor = 'white';
  chatWindow.style.borderRadius = '10px';
  chatWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.overflow = 'hidden';
  document.body.appendChild(chatWindow);

  // Chat window header
  const chatHeader = document.createElement('div');
  chatHeader.style.backgroundColor = '#007bff';
  chatHeader.style.color = 'white';
  chatHeader.style.padding = '10px';
  chatHeader.style.fontSize = '16px';
  chatHeader.innerText = 'Chatbot';
  chatWindow.appendChild(chatHeader);

  // Chat messages container
  const chatMessages = document.createElement('div');
  chatMessages.style.flex = '1';
  chatMessages.style.padding = '10px';
  chatMessages.style.overflowY = 'auto';
  chatMessages.style.backgroundColor = '#f4f4f4';
  chatMessages.id = 'chat-messages';
  chatWindow.appendChild(chatMessages);

  // Chat input and file attachment container
  const chatInputContainer = document.createElement('div');
  chatInputContainer.style.display = 'flex';
  chatInputContainer.style.padding = '10px';
  chatInputContainer.style.borderTop = '1px solid #ccc';

  // File attachment input (hidden by default)
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.display = 'none';

  // Button to trigger file input
  const attachButton = document.createElement('button');
  attachButton.innerText = '📎';
  attachButton.title = 'Attach file';
  attachButton.style.padding = '10px';
  attachButton.style.marginRight = '10px';
  attachButton.style.backgroundColor = '#007bff';
  attachButton.style.color = 'white';
  attachButton.style.border = 'none';
  attachButton.style.borderRadius = '5px';

  // Trigger file input when attach button is clicked
  attachButton.addEventListener('click', () => fileInput.click());

  // Chat text input
  const chatInput = document.createElement('input');
  chatInput.style.flex = '1';
  chatInput.style.padding = '10px';
  chatInput.style.borderRadius = '5px';
  chatInput.style.border = '1px solid #ccc';
  chatInput.type = 'text';
  chatInput.placeholder = 'Type a message...';

  // Send button
  const chatSendButton = document.createElement('button');
  chatSendButton.innerText = 'Send';
  chatSendButton.style.marginLeft = '10px';
  chatSendButton.style.padding = '10px';
  chatSendButton.style.backgroundColor = '#007bff';
  chatSendButton.style.color = 'white';
  chatSendButton.style.border = 'none';
  chatSendButton.style.borderRadius = '5px';

  // Append elements to input container
  chatInputContainer.appendChild(attachButton);
  chatInputContainer.appendChild(fileInput);
  chatInputContainer.appendChild(chatInput);
  chatInputContainer.appendChild(chatSendButton);
  chatWindow.appendChild(chatInputContainer);

  // Open/close chat window on button click
  chatButton.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  });

  // Handle chat logic
  chatSendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  fileInput.addEventListener('change', handleFileAttachment);

  function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === '') return;

    // Add user message to the chat
    addMessageToChat('User', messageText);
    chatInput.value = '';

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      addMessageToChat('Bot', botResponse);
    }, 500);
  }

  function handleFileAttachment() {
    const file = fileInput.files[0];
    if (!file) return;

    // Display the file name in the chat
    addMessageToChat('User', `Attached: ${file.name}`);

    // Clear the file input for future attachments
    fileInput.value = '';

    // Simulate bot response
    setTimeout(() => {
      addMessageToChat('Bot', 'File received. Thank you!');
    }, 500);
  }

  function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.style.marginBottom = '10px';
    messageElement.style.wordWrap = 'break-word';

    if (sender === 'User') {
      messageElement.style.textAlign = 'right';
      messageElement.innerHTML = `<span style="background-color: #007bff; color: white; padding: 5px 10px; border-radius: 10px;">${message}</span>`;
    } else {
      messageElement.style.textAlign = 'left';
      messageElement.innerHTML = `<span style="background-color: #f1f1f1; padding: 5px 10px; border-radius: 10px;">${message}</span>`;
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;  // Auto-scroll to the latest message
  }

  function getBotResponse(message) {
    // Simple keyword-based responses
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('hello')) {
      return 'Hi! How can I help you today?';
    } else if (lowerCaseMessage.includes('help')) {
      return 'I\'m here to assist you with any questions you have.';
    } else {
      return 'Sorry, I didn\'t understand that. Could you please rephrase?';
    }
  }
  })();
  