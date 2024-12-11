// Listener para recibir datos de Chatwoot
window.addEventListener("message", function (event) {
  if (!isJSONValid(event.data)) {
    console.warn("Datos no válidos recibidos:", event.data);
    return;
  }

  const eventData = JSON.parse(event.data);
  
  console.log("Datos recibidos:", eventData); // Imprime la estructura completa

  if (eventData.event === "appContext") {
    const { conversation, contact, currentAgent } = eventData.data;
    console.log("Mensajes de la conversación:", conversation.messages); // Revisa los mensajes
    updateDashboard(conversation, contact, currentAgent);
  }
});

  // Validar JSON
  function isJSONValid(data) {
    try {
      JSON.parse(data);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Solicitamos datos a Chatwoot
  document.getElementById("fetchDataBtn").addEventListener("click", () => {
    window.parent.postMessage("chatwoot-dashboard-app:fetch-info", "*");
  });
  
function updateDashboard(conversation, contact, currentAgent) {
  document.getElementById("contactName").innerText = contact.name || "N/A";
  document.getElementById("conversationStatus").innerText = conversation.status || "N/A";
  document.getElementById("agentName").innerText = currentAgent.name || "N/A";

  const messagesContainer = document.getElementById("messagesContainer");
  messagesContainer.innerHTML = ""; 

  conversation.messages.forEach((message) => {
    const messageElement = document.createElement("div");
    
    // Identificamos el remitente
    const senderName = message.sender?.name || "Desconocido";
    const senderRole = message.sender?.role || "system";

    // Aplicamos estilos según el remitente
    messageElement.textContent = `[${senderRole}] ${senderName}: ${message.content}`;
    messageElement.className = senderRole === "agent" ? "message-agent" : "message-contact";
    
    messagesContainer.appendChild(messageElement);
  });
}

  