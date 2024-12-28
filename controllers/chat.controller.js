import 'dotenv/config';
import readline from 'node:readline';
import getResponse from '../services/openai.service.js';
import formatMessage from '../utilities/formatMessage.js';


const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const chat=()=>{
    const history=[
        {
            role:'system',
            content:'You are an AI assistant. Answer questions to the best of your knowledge in "brief" always.'
        },
    ]
    const start=()=>{
    rl.question('You: ',async (userInput)=>{
        if(userInput.toLowerCase()==='exit'){
            rl.close();
            return;
        }

        const userMessage=formatMessage(userInput);
        const response=await getResponse(history,userMessage);
        

       history.push(userMessage, response);
       console.log(`\n\nAI: ${response.content}\n\n`);
       start();
    });
};
start();
console.log(`\n\nAI: How can I help you today?\n\n`);
}


console.log(`Chatbot initialized. Type 'exit' to end the chat.`);
chat();