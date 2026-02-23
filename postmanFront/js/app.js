document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const sendBtn = document.getElementById('sendBtn');
    const methodSelect = document.getElementById('methodSelect');
    const urlInput = document.getElementById('urlInput');
    const jsonInput = document.getElementById('jsonInput');
    const bodyContainer = document.querySelector('.request-body-container');

    const responseOutput = document.getElementById('responseOutput');
    const statusCodeSpan = document.getElementById('statusCode');
    const responseTimeSpan = document.getElementById('responseTime');

    if (methodSelect) {
        methodSelect.addEventListener('change', (e) => {
            const method = e.target.value;
            const hasBody = (method === 'POST' || method === 'PUT');
            bodyContainer.style.display = hasBody ? 'block' : 'none';
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleRequest);
    }

    async function handleRequest() {
        console.log("Processing request...");

        const url = urlInput.value.trim();
        if (!url) {
            alert("⚠️ Please enter a valid URL (e.g., http://localhost:8085/api/users)");
            responseOutput.innerText = "Error: URL cannot be empty.";
            return;
        }

        const method = methodSelect.value;
        const bodyText = jsonInput.value;

        responseOutput.innerText = "Loading...";
        statusCodeSpan.innerText = "---";
        statusCodeSpan.style.color = "#d4d4d4";
        responseTimeSpan.innerText = "---";

        let options = {
            method: method,
            headers: {}
        };

        if (method !== 'GET' && method !== 'DELETE') {
            options.headers['Content-Type'] = 'application/json';
            try {
                if (bodyText.trim()) {
                    JSON.parse(bodyText);
                    options.body = bodyText;
                }
            } catch (error) {
                alert("Invalid JSON Syntax! Please check quotes and commas.");
                responseOutput.innerText = "Error: Invalid JSON format.";
                return;
            }
        }

        if (method !== 'GET' && method !== 'DELETE') {
            try {
                if (bodyText.trim()) {
                    JSON.parse(bodyText);
                    options.body = bodyText;
                }
            } catch (error) {
                alert("Invalid JSON Syntax! Please check quotes and commas.");
                responseOutput.innerText = "Error: Invalid JSON format.";
                return;
            }
        }

        const startTime = Date.now();

        try {
            const response = await fetch(url, options);
            const endTime = Date.now();

            statusCodeSpan.innerText = response.status;
            responseTimeSpan.innerText = endTime - startTime;

            if (response.ok) {
                statusCodeSpan.style.color = '#4caf50';
            } else {
                statusCodeSpan.style.color = '#f44336';
            }

            const textData = await response.text();

            try {
                const jsonData = JSON.parse(textData);

                if (Array.isArray(jsonData)) {

                    const formattedText = jsonData.map(item => {
                        const { id, ...rest } = item;

                        return Object.values(rest).join("\n");
                    })
                        .join("\n------------------------\n");

                    responseOutput.innerText = formattedText;

                } else {
                    const { id, ...rest } = jsonData;
                    responseOutput.innerText = Object.values(rest).join("\n");
                }

            } catch (e) {
                console.error(e);
                responseOutput.innerText = textData;
            }

        } catch (networkError) {
            console.error("Network Error:", networkError);
            responseOutput.innerText = `Network Error: ${networkError.message}\n\nIs your Spring Boot server running? Check CORS settings.`;
            statusCodeSpan.style.color = 'red';
        }
    }
});