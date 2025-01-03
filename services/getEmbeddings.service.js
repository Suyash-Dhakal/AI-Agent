import 'dotenv/config';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { AzureOpenAIEmbeddings, AzureChatOpenAI } from '@langchain/openai'; // Import AzureOpenAIEmbeddings

const question = process.argv[2] || 'hi';

const embeddings = new AzureOpenAIEmbeddings({
  azureOpenAIApiKey:process.env.TEXT_EMBEDDING_API_KEY , // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiInstanceName:process.env.INSTANCE,
  azureOpenAIApiEmbeddingsDeploymentName: process.env.DEPLOYMENT,
  azureOpenAIApiVersion: process.env.VERSION, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
});


//instantiation of our model object
const llm = new AzureChatOpenAI({
  model: "gpt-4-32k",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
});

export const createStore = async (docs) => {
  // Create and return the MemoryVectorStore using the embeddings
  return MemoryVectorStore.fromDocuments(docs, embeddings);
};

export const docsFromPDF = async () => {
  const loader = new PDFLoader('csitWorkshoppdf.pdf');
  const splitter = new CharacterTextSplitter({
    separator: '. ',
    chunkSize: 2500,
    chunkOverlap: 200,
  });
  // Load the document
  const docs = await loader.load();

  // Split the document
  return splitter.splitDocuments(docs);
};

export const loadStore = async () => {
  const pdfDocs = await docsFromPDF();
  return createStore([...pdfDocs]);  // Pass pdfDocs as an array to createStore
};



export const query =async()=>{
  const store=await loadStore();
  const results=await store.similaritySearch(question,2);
  const response=await llm.invoke([
    [
      "system",
        "You are a helpful AI assistant. Answser questions to your best ability.",
    ],
    [
      "human",
      `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
      Question:${question}
      Context:${results.map((r) => r.pageContent).join('\n')}
      `
    ],
  ])

  console.log(`Answer: ${response.content}`);
  
}


query();