// File: formgpt-backend/public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const promptTextarea = document.getElementById('prompt-textarea');
    const jsonOutput = document.getElementById('json-output');
    const errorBox = document.getElementById('error-box');

    generateBtn.addEventListener('click', async () => {
        const prompt = promptTextarea.value;

        // 1. Validate input
        if (!prompt || prompt.trim() === '') {
            showError('Please enter a prompt in the text area.');
            return;
        }

        // 2. Set loading state
        setLoading(true);
        jsonOutput.innerHTML = '<code>Generating...</code>';
        hideError();

        try {
            // 3. Make API Call to our own backend
            const response = await fetch('/api/v1/form-builder/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            // 4. Handle response
            if (!response.ok) {
                // API returned an error (4xx, 5xx)
                throw new Error(data.message || 'An unknown error occurred.');
            }

            // Success: Format and display the JSON
            // JSON.stringify(data, null, 2) adds 2-space indentation
            const formattedJson = JSON.stringify(data, null, 2); 
            jsonOutput.innerHTML = `<code>${formattedJson}</code>`;

        } catch (error) {
            // 5. Handle any errors (network, API, etc.)
            console.error('Fetch error:', error);
            showError(error.message);
            jsonOutput.innerHTML = '<code>Generation failed. See error above.</code>';
        } finally {
            // 6. Reset loading state
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        if (isLoading) {
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
        } else {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    }

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
    }

    function hideError() {
        errorBox.textContent = '';
        errorBox.classList.add('hidden');
    }
});