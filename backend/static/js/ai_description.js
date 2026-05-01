document.addEventListener("DOMContentLoaded", function() {
    // 1. Dhoondho ki description field kahan hai
    const descriptionField = document.querySelector('.field-description');
    const titleInput = document.getElementById('id_title');

    if (descriptionField && titleInput) {
        // 2. Ek mast AI Button banao
        const aiButton = document.createElement('button');
        aiButton.type = 'button';
        aiButton.innerHTML = '✨ Generate AI Description';
        aiButton.className = 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-5 rounded text-sm shadow-sm mb-2 transition-all';
        aiButton.style.marginTop = '10px';
        aiButton.style.display = 'block';

        // Button ko description label ke theek neeche daal do
        descriptionField.querySelector('.django-ckeditor-widget').insertAdjacentElement('afterend', aiButton);

        // 3. Click Event Logic
        aiButton.addEventListener('click', async function() {
            const title = titleInput.value.trim();
            
            if (!title) {
                alert("Bhai, pehle Product ka Title toh likh do!");
                return;
            }

            // Button ko loading state me dalo
            const originalText = aiButton.innerHTML;
            aiButton.innerHTML = '⏳ Generating Magic...';
            aiButton.disabled = true;
            aiButton.classList.add('opacity-70', 'cursor-not-allowed');

            try {
                // Backend ko request bhejo
                const response = await fetch('/api/products/generate-description/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: title })
                });

                const data = await response.json();

                if (response.ok) {
                    // Agar CKEditor load ho chuka hai toh usme text daalo
                    if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances['id_description']) {
                        CKEDITOR.instances['id_description'].setData(data.description);
                    } else {
                        // Agar normal textarea hai
                        document.getElementById('id_description').value = data.description;
                    }
                } else {
                    alert("AI Error: " + data.error);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Connection error! Check console.");
            } finally {
                // Button ko wapas normal karo
                aiButton.innerHTML = originalText;
                aiButton.disabled = false;
                aiButton.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        });
    }
});