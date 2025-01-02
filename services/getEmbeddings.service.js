import 'dotenv/config';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { AzureOpenAIEmbeddings } from '@langchain/openai'; // Import AzureOpenAIEmbeddings

const question = process.argv[2] || 'hi';

const embeddings = new AzureOpenAIEmbeddings({
  azureOpenAIApiKey:process.env.TEXT_EMBEDDING_API_KEY , // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiInstanceName:process.env.INSTANCE,
  azureOpenAIApiEmbeddingsDeploymentName: process.env.DEPLOYMENT,
  azureOpenAIApiVersion: process.env.VERSION, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
});

const createStore = async (docs) => {
  // Create and return the MemoryVectorStore using the embeddings
  return MemoryVectorStore.fromDocuments(docs, embeddings);
};

const docsFromPDF = async () => {
  const loader = new PDFLoader('Flutter-Proposal.pdf');
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

const loadStore = async () => {
  const pdfDocs = await docsFromPDF();
  return createStore([...pdfDocs]);  // Pass pdfDocs as an array to createStore
};



const query =async()=>{
  const store=await loadStore();
  const results=await store.similaritySearch(question,1);
  console.log(results);
  
}


query();