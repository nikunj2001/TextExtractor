import pdfParse from 'pdf-parse';
import openai from 'openai';

const extractTextFromFile = async (file) => {
 if (file.type === 'application/pdf') {
    const buffer = await file.arrayBuffer();
    const data = await pdfParse(buffer);
    console.log(data);
    return data.text;
 }
 return null;
}

// const enrichDataWithOpenAI = async (text) => {
//     // Use Langchain for additional processing if required
//     const processedText = langchain.process(text);
  
//     // Use OpenAI for enrichment
//     const enrichedData = await openai.enrich(processedText);
  
//     return enrichedData;
//   };

  export { extractTextFromFile };
