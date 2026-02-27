document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const methodSelect = document.getElementById('methodSelect');
    const urlInput = document.getElementById('urlInput');
    const jsonInput = document.getElementById('jsonInput');
    const bodyContainer = document.getElementById('bodyContainer'); 

    const responseOutput = document.getElementById('responseOutput');
    const statusCodeSpan = document.getElementById('statusCode');
    const responseTimeSpan = document.getElementById('responseTime');

    function updateMethodColor() {
        const method = methodSelect.value;
        methodSelect.style.color = 
            method === 'GET' ? 'var(--color-get)' : 
            method === 'POST' ? 'var(--color-post)' : 
            method === 'PUT' ? 'var(--color-put)' : 'var(--color-delete)';
        
        const tabMethodSpan = document.querySelector('.tab.active .method');
        if(tabMethodSpan) {
            tabMethodSpan.innerText = method;
            tabMethodSpan.style.color = methodSelect.style.color;
        }
    }

    if (methodSelect) {
        updateMethodColor();
        methodSelect.addEventListener('change', (e) => {
            const method = e.target.value;
            const hasBody = (method === 'POST' || method === 'PUT');
            
            if (hasBody) {
                bodyContainer.classList.remove('hidden');
            } else {
                bodyContainer.classList.add('hidden');
            }
            
            updateMethodColor();
        });
    }

    if (sendBtn) sendBtn.addEventListener('click', handleRequest);

    async function handleRequest() {
        const url = urlInput.value.trim();
        if (!url) {
            alert("Please enter a valid URL");
            return;
        }

        const method = methodSelect.value;
        const bodyText = jsonInput.value;

        responseOutput.innerText = "Sending request...";
        statusCodeSpan.innerText = "---";
        statusCodeSpan.className = "";
        responseTimeSpan.innerText = "---";

        let options = { method: method, headers: {} };

        try {
            const configRes = await fetch('http://localhost:8085/api/config/apikey');
            if (configRes.ok) {
                const configData = await configRes.json();
                if (configData.apiKey && configData.apiKey.trim() !== '') {
                    options.headers['x-api-key'] = configData.apiKey;
                    options.headers['Authorization'] = `Bearer ${configData.apiKey}`;
                }
            }
        } catch (error) {
            console.warn("No se pudo conectar con el backend para obtener la API Key. Se continuará sin ella.");
        }

        if (method !== 'GET' && method !== 'DELETE') {
            options.headers['Content-Type'] = 'application/json';
            try {
                if (bodyText.trim()) {
                    JSON.parse(bodyText);
                    options.body = bodyText;
                }
            } catch (error) {
                alert("Invalid JSON Syntax! Check quotes and commas.");
                responseOutput.innerText = "Error: Invalid JSON format.";
                return;
            }
        }

        const startTime = Date.now();

        try {
            const response = await fetch(url, options);
            const endTime = Date.now();

            statusCodeSpan.innerText = response.status + (response.ok ? " OK" : " ERR");
            responseTimeSpan.innerText = endTime - startTime;

            if (response.ok) {
                statusCodeSpan.className = 'status-green';
            } else {
                statusCodeSpan.className = 'status-red';
            }

            const textData = await response.text();

            try {
                if (textData) {
                    const jsonData = JSON.parse(textData);
                    responseOutput.innerText = JSON.stringify(jsonData, null, 2);
                } else {
                    responseOutput.innerText = "No content returned (Status " + response.status + ")";
                }
            } catch (e) {
                responseOutput.innerText = textData; 
            }

        } catch (networkError) {
            responseOutput.innerText = `Network/CORS Error: ${networkError.message}\n\nMake sure your Spring Boot server is running and accessible.`;
            statusCodeSpan.className = 'status-red';
            statusCodeSpan.innerText = "FAILED";
        }
    }
});