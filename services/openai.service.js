const apiKey=process.env.OPENAI_API_KEY;
const apiUrl=process.env.OPENAI_ENDPOINT;

export default async function getResponse(prompt){
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
                    {
                        role:'user',
                        content:prompt
                    }
                ]
            }),
        });

        let res;
        if (response.ok) {
           const jsonResponse=await response.json();
           res=jsonResponse?.choices[0]?.message.content;
           console.log(res);
           return res;
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}

 