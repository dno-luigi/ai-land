// Load environment variables from .env file
require('dotenv').config();

// Check if the API key is available
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error('Error: OPENROUTER_API_KEY not found in environment variables');
  process.exit(1);
}

// Function to call the OpenRouter API
async function callOpenRouter() {
  try {
    // Prepare the request data
    const requestData = {
      model: "perplexity/llama-3.1-sonar-small-128k-online",
      messages: [
        { role: "user", content: "What is the meaning of life?" }
      ],
      top_p: 1,
      temperature: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      repetition_penalty: 1,
      top_k: 0
    };

    // Make the API request
    console.log('Sending request to OpenRouter API...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestData)
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    // Parse and display the response
    const data = await response.json();
    console.log('\nResponse from OpenRouter API:');
    console.log('-----------------------------');
    console.log('Model used:', data.model);
    console.log('Response content:');
    console.log(data.choices[0].message.content);
    console.log('-----------------------------');
    
    // Return the full data for further processing if needed
    return data;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error.message);
    throw error;
  }
}

// Execute the function
callOpenRouter()
  .then(() => console.log('API call completed successfully'))
  .catch(err => console.error('Failed to complete API call:', err));
