import 'dotenv/config';
const apiKey=process.env.OPENAI_API_KEY;
const apiUrl=process.env.OPENAI_ENDPOINT;

export default async function getResponse(history,message){
    try {
        const response=await fetch(apiUrl,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'api-key':apiKey
            },
            body:JSON.stringify({
                model:"gpt-3.5-turbo",
                messages:[
                    ...history,message
                ]
            }),
        });
        let res;
        if (response.ok) {
           const jsonResponse=await response.json();
           res=jsonResponse?.choices[0]?.message;
           return res;
        
        // return response?.choices[0]?.message;
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}


