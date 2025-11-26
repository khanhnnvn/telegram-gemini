require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // For the latest version of the SDK, we might need to access the model listing differently
        // But let's try the standard way if available, or just try to generate with a fallback
        // Actually, the SDK doesn't always expose listModels directly on the main class in all versions.
        // Let's try to use the model manager if it exists, or just a raw fetch if needed.
        // Wait, the error message suggested: "Call ListModels to see the list of available models"

        // In the Node SDK, it's often not straightforward to list models directly via the helper.
        // Let's try to use the `getGenerativeModel` and see if we can just print what we have.
        // Actually, let's use a raw fetch to the API endpoint to be sure, as it's more reliable for debugging.

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("No API Key found in .env");
            return;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("Error listing models:", data.error);
        } else {
            console.log("Available Models:");
            if (data.models) {
                data.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log("No models found in response.");
                console.log(JSON.stringify(data, null, 2));
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
