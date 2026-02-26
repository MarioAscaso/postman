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
                
                // Actualizar visualmente la pequeña etiqueta "GET" en la pestaña superior
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
                    
                    if (hasBody) bodyContainer.classList.remove('hidden');
                    else bodyContainer.classList.add('hidden');
                    
                    updateMethodColor();
                });
            }

            if (sendBtn) sendBtn.addEventListener('click', handleRequest);

            async function handleRequest() {
                const url = urlInput.value.trim();
                if (!url) {
                    alert("⚠️ Please enter a valid URL");
                    return;
                }

                const method = methodSelect.value;
                const bodyText = jsonInput.value;

                responseOutput.innerText = "Sending request...";
                statusCodeSpan.innerText = "---";
                statusCodeSpan.className = "";
                responseTimeSpan.innerText = "---";

                let options = { method: method, headers: {} };

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

                    if (response.ok) statusCodeSpan.className = 'status-green';
                    else statusCodeSpan.className = 'status-red';

                    const textData = await response.text();

                    try {
                        if (textData) {
                            const jsonData = JSON.parse(textData);
                            if (Array.isArray(jsonData)) {
                                const formattedText = jsonData.map(item => {
                                    const { id, ...rest } = item;
                                    return Object.values(rest).join("\n");
                                }).join("\n------------------------\n");
                                responseOutput.innerText = formattedText || "[]";
                            } else {
                                const { id, ...rest } = jsonData;
                                responseOutput.innerText = Object.values(rest).join("\n");
                            }
                        } else {
                            responseOutput.innerText = "No content returned (Status " + response.status + ")";
                        }
                    } catch (e) {
                        responseOutput.innerText = textData; 
                    }

                } catch (networkError) {
                    responseOutput.innerText = `Network/CORS Error: ${networkError.message}\n\nMake sure your Spring Boot server is running on port 8085.`;
                    statusCodeSpan.className = 'status-red';
                    statusCodeSpan.innerText = "FAILED";
                }
            }
        });