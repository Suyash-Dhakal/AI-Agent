import readline from 'node:readline';
import getResponse from '../services/openai.service.js';
import formatMessage from '../utilities/formatMessage.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const chat = () => {
    const history = [
        {
            role: 'system',
            content: 'You are an AI assistant. Answer questions to the best of your knowledge in "brief" always.',
        },
    ];

    const start = () => {
        rl.question('You: ', async (userInput) => {
            // Exit condition
            if (userInput.toLowerCase() === 'exit') {
                console.log('Exiting chat...');
                rl.close();
                return;
            }

            const userMessage = formatMessage(userInput);
            const response = await getResponse(history, userMessage)
            

            // Add user message and AI response to history
            history.push(userMessage);
            history.push(response);
            // history.push(userMessage, response);

            // Print the AI response
            console.log(`\nAI: ${response.content}\n`);

            // Continue the conversation with the next prompt
            start(); 
        });
    };

    // Start the conversation with the first AI message
    console.log('Chatbot initialized. Type "exit" to end the chat.');
    console.log('AI: How can I help you today?\n');
    start();
};

chat();
