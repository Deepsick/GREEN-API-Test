const API_URL = 'https://api.green-api.com';

function getIdInstance() {
    return document.getElementById('idInstance').value.trim();
}

function getApiToken() {
    return document.getElementById('apiTokenInstance').value.trim();
}

function isDemoMode() {
    return document.getElementById('demoMode').checked;
}

function displayResponse(data) {
    const responseElement = document.getElementById('response');
    responseElement.textContent = JSON.stringify(data, null, 2);
}

function displayError(error) {
    const responseElement = document.getElementById('response');
    responseElement.textContent = JSON.stringify({
        error: error.message || 'Request failed',
        details: error.toString()
    }, null, 2);
}

function validateCredentials() {
    if (isDemoMode()) {
        return true;
    }

    const idInstance = getIdInstance();
    const apiToken = getApiToken();

    if (!idInstance) {
        displayError(new Error('idInstance is required'));
        return false;
    }

    if (!apiToken) {
        displayError(new Error('ApiTokenInstance is required'));
        return false;
    }

    return true;
}

// Mock responses for demo mode
const mockResponses = {
    getSettings: {
        wid: "79001234567@c.us",
        countryInstance: "ru",
        typeAccount: "trial",
        webhookUrl: "",
        webhookUrlToken: "",
        delaySendMessagesMilliseconds: 1000,
        markIncomingMessagesReaded: "yes",
        markIncomingMessagesReadedOnReply: "no",
        outgoingWebhook: "yes",
        outgoingMessageWebhook: "yes",
        outgoingAPIMessageWebhook: "yes",
        incomingWebhook: "yes",
        deviceWebhook: "no",
        statusInstanceWebhook: "yes",
        sendFromUTC: "false",
        sendToUTC: "false"
    },
    getStateInstance: {
        stateInstance: "authorized"
    },
    sendMessage: {
        idMessage: "3EB0C767D097B7C7C030",
        chatId: "77777777777@c.us",
        message: "Message sent successfully"
    },
    sendFileByUrl: {
        idMessage: "3EB0CBEF0E6C380D0C07",
        urlFile: "https://my-site.com/img/horse.png",
        fileName: "horse.png",
        chatId: "77777777777@c.us"
    }
};

function simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
}

async function getSettings() {
    if (!validateCredentials()) return;

    if (isDemoMode()) {
        await simulateDelay();
        displayResponse(mockResponses.getSettings);
        return;
    }

    const idInstance = getIdInstance();
    const apiToken = getApiToken();
    const url = `${API_URL}/waInstance${idInstance}/getSettings/${apiToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResponse(data);
    } catch (error) {
        displayError(error);
    }
}

async function getStateInstance() {
    if (!validateCredentials()) return;

    if (isDemoMode()) {
        await simulateDelay();
        displayResponse(mockResponses.getStateInstance);
        return;
    }

    const idInstance = getIdInstance();
    const apiToken = getApiToken();
    const url = `${API_URL}/waInstance${idInstance}/getStateInstance/${apiToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResponse(data);
    } catch (error) {
        displayError(error);
    }
}

async function sendMessage() {
    if (!validateCredentials()) return;

    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const messageText = document.getElementById('messageText').value.trim();

    if (!phoneNumber) {
        displayError(new Error('Phone number is required'));
        return;
    }

    if (!messageText) {
        displayError(new Error('Message text is required'));
        return;
    }

    if (isDemoMode()) {
        await simulateDelay();
        const mockData = {
            ...mockResponses.sendMessage,
            chatId: `${phoneNumber}@c.us`
        };
        displayResponse(mockData);
        return;
    }

    const idInstance = getIdInstance();
    const apiToken = getApiToken();
    const url = `${API_URL}/waInstance${idInstance}/sendMessage/${apiToken}`;

    const payload = {
        chatId: `${phoneNumber}@c.us`,
        message: messageText
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        displayResponse(data);
    } catch (error) {
        displayError(error);
    }
}

async function sendFileByUrl() {
    if (!validateCredentials()) return;

    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const fileUrl = document.getElementById('fileUrl').value.trim();
    const fileName = document.getElementById('fileName').value.trim();

    if (!phoneNumber) {
        displayError(new Error('Phone number is required'));
        return;
    }

    if (!fileUrl) {
        displayError(new Error('File URL is required'));
        return;
    }

    if (!fileName) {
        displayError(new Error('File name is required'));
        return;
    }

    if (isDemoMode()) {
        await simulateDelay();
        const mockData = {
            ...mockResponses.sendFileByUrl,
            chatId: `${phoneNumber}@c.us`,
            urlFile: fileUrl,
            fileName: fileName
        };
        displayResponse(mockData);
        return;
    }

    const idInstance = getIdInstance();
    const apiToken = getApiToken();
    const url = `${API_URL}/waInstance${idInstance}/sendFileByUrl/${apiToken}`;

    const payload = {
        chatId: `${phoneNumber}@c.us`,
        urlFile: fileUrl,
        fileName: fileName
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        displayResponse(data);
    } catch (error) {
        displayError(error);
    }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('getSettingsBtn').addEventListener('click', getSettings);
    document.getElementById('getStateInstanceBtn').addEventListener('click', getStateInstance);
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('sendFileByUrlBtn').addEventListener('click', sendFileByUrl);
});
