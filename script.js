function initializeRavens(apiKey) {
    // Fetch the API key from the HTML attribute
    // const apiKey = document.body.getAttribute('data-ravens-api-key');

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
  chatButton.style.backgroundColor = '#0c0917';
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
  chatHeader.style.backgroundColor = '#0c0917';
  chatHeader.style.color = 'white';
  chatHeader.style.padding = '10px';
  chatHeader.style.fontSize = '16px';
  chatHeader.innerText = 'Ravens';
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
  attachButton.style.backgroundColor = '#0c0917';
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
  chatSendButton.style.backgroundColor = '#0c0917';
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

  addMessageToChat('User', messageText);
  chatInput.value = '';

  // Prepare FormData
  const formData = new FormData();
  formData.append('prompt', messageText);

  if (fileInput.files[0]) {
      formData.append('file', fileInput.files[0]);
  }

  console.log("sended data: ", { messageText, fname: fileInput.files[0]})

  fetch('http://localhost:5000/api/v1/search', {
      method: 'POST',
      headers: {
          'ravens-key': `${apiKey}`
      },
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      const botResponse = data.response || 'Message sent successfully!';
      addMessageToChat('Bot', botResponse);
      if (data.products && data.products.length > 0) {
        addProductCards(data.products); // Display product cards
    }
  })
  .catch(error => {
      console.error('Error sending message:', error);
      addMessageToChat('Bot', 'There was an error sending your message. Please try again.');
  });
}

function handleFileAttachment() {
  const file = fileInput.files[0];
  if (!file) return;

  if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const imagePreview = document.createElement('img');
          imagePreview.src = e.target.result;
          imagePreview.style.maxWidth = '50px';
          imagePreview.style.maxHeight = '50px';
          imagePreview.style.borderRadius = '5px';
          imagePreview.style.marginBottom = '5px';

          addMessageToChat('User', 'Attached image:');
          chatMessages.appendChild(imagePreview);
      };
      reader.readAsDataURL(file);
  } else {
      addMessageToChat('User', `Attached: ${file.name}`);
  } // Clear the file input
}

function addMessageToChat(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.style.marginBottom = '10px';
  messageElement.style.wordWrap = 'break-word';

  if (sender === 'User') {
      messageElement.style.textAlign = 'right';
      messageElement.innerHTML = `<span style="background-color: #0c0917; color: white; padding: 5px 10px; border-radius: 10px;">${message}</span>`;
  } else {
      messageElement.style.textAlign = 'left';
      messageElement.innerHTML = `<p style="background-color: #0c0917; color: white; padding: 5px 10px; border-radius: 10px;">${message}</p>`;
  }

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;  // Auto-scroll to the latest message
}
}

function addProductCards(products) {
    // Create a container for product cards
    const productContainer = document.createElement('div');
    productContainer.style.display = 'flex';
    productContainer.style.flexWrap = 'wrap';
    productContainer.style.marginTop = '10px';
    productContainer.style.borderTop = '1px solid #ccc';
    productContainer.style.padding = '10px 0';

    products.forEach(product => {
        const { title, link, description, imgUrl } = product.payload;

        // Create a card
        const card = document.createElement('div');
        card.style.width = '100px';
        card.style.margin = '5px';
        card.style.border = '1px solid #ccc';
        card.style.borderRadius = '5px';
        card.style.overflow = 'hidden';
        card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        card.style.cursor = 'pointer';

        // Add image
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = title;
        img.style.width = '100%';
        img.style.height = '70px';
        img.style.objectFit = 'cover';

        // Add title
        const cardTitle = document.createElement('div');
        cardTitle.innerText = title;
        cardTitle.style.fontSize = '14px';
        cardTitle.style.fontWeight = 'bold';
        cardTitle.style.padding = '5px';

        // Add description
        const cardDesc = document.createElement('div');
        cardDesc.innerText = description;
        cardDesc.style.fontSize = '12px';
        cardDesc.style.color = '#555';
        cardDesc.style.padding = '0 5px 5px';

        // Append elements to the card
        card.appendChild(img);
        card.appendChild(cardTitle);
        card.appendChild(cardDesc);

        // Add click handler to open link
        card.addEventListener('click', () => {
            window.open(link, '_blank');
        });

        // Append card to the container
        productContainer.appendChild(card);
    });

    const chatMessages = document.getElementById('chat-messages');

    // Append the product container to the chat
    chatMessages.appendChild(productContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to show products
}
