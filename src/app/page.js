'use client';
import { useEffect, useState } from 'react';
import FileUpload from './components/FileUpload'
import ExtractedResults from './components/ExtractedResults';
import { z } from 'zod';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser, OutputFixingParser } from 'langchain/output_parsers';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function Home() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [dataToDisplay, setDataToDisplay] = useState(null);


  const handleFileChange = async (newFile) => {
    setFile(newFile);
  }

  const run = async (inputText) => {
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        name: z.string().describe('Policy holder name'),
        dob: z.string().describe('Date of birth'),
        policyNumber: z.string().describe('Policy Number'),
        claimNumber: z.string().describe('Clamin Number'),
        surgeryDate: z.string().describe('Surgery date'),
        typeOfSurgery: z.string().describe('Type of Surgery'),
        surgeonName: z.string().describe('surgeon name'),
        medicalProviderAddress: z.string().describe('address'),
        surgeryCost: z.string().describe('surgery cost'),
        deductibleCost: z.string().describe('deductible paid'),
        conditionsRelatedToWork: z.string().describe('conditions to work'),
        dateOfFirstSymptoms: z.string().describe('Data of Symptoms'),
        addressOfCorrespondence: z.string().describe('Address of orrespondence'),
        phoneNumber: z.string().describe('phone number'),
        emailAddress: z.string().describe('email'),
        employerName: z.string().describe('employer name')
      })
    );
    const formatInstructions = parser.getFormatInstructions();

    const prompt = new PromptTemplate({
      template: 'Generate details of a person from the input text provide. \n{format_instructions}\ninput text: {inputText}',
      inputVariables: ['inputText'],
      partialVariables: { format_instructions: formatInstructions }
    });
    try {
      // Initialize OpenAI model
      const model = new OpenAI({
        temperature: 0,
        model: 'gpt-3.5-turbo',
        openAIApiKey: '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',
      });
    
      // Prepare input for the model
      const input = await prompt.format({ inputText });
    
      // Call the OpenAI model
      const response = await model.call(input);
    
      try {
        // Attempt to parse the response
        const data = await parser.parse(response);
        setDataToDisplay(data);
      } catch (parseError) {
        setError(true);
        console.log("Failed to parse output:", parseError);
    
        // Attempt to fix the parsing error
        const fixParser = OutputFixingParser.fromLLM(
          new OpenAI({
            temperature: 0,
            model: 'gpt-3.5-turbo',
            openAIApiKey: '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',
          }),
          parser
        );
    
        const fixedOutput = await fixParser.parse(response);
        setDataToDisplay(fixedOutput);
        setError(false);
        console.log("Fixed output:", fixedOutput);
      }
    } catch (apiError) {
      setError(true);
      console.error('An error occurred while interacting with the OpenAI API:', apiError);
    }
  }
  const onDocumentLoadSuccess = async ({ numPages }) => {
    setNumPages(numPages);

    // Extract text from each page
    let text = '';
    for (let i = 1; i <= numPages; i++) {
      const pageText = await extractTextFromPage(file, i);
      text += pageText + '\n';
    }
    setPdfText(text);
  };
  const extractTextFromPage = async (file, pageNumber) => {
    const pageText = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedArray = new Uint8Array(event.target.result);

        try {
          const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((s) => s.str).join(' ');
          resolve(pageText);
        } catch (error) {
          console.error('Error extracting text from page:', error);
          resolve('');
        }
      };
      reader.readAsArrayBuffer(file);
    });

    return pageText;
  };

  const handleReset = () => {
    setFile(null);
    setError(false);
    setNumPages(null);
    setPdfText('');
    setDataToDisplay(null);
  }

  useEffect(() => {
    if (pdfText?.trim()) {
      const fun = async () => {
        await run(pdfText);
      }
      fun();
    }
  }, [pdfText]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      { dataToDisplay && <button onClick={handleReset} >Reset Data</button> }
      {error ? <div>
        <h3>Something went wrong!!!!!</h3>
      </div> :
        <div>
          <FileUpload onFileChange={handleFileChange} />
          {file && (
            <div>
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              </Document>
            </div>
          )}
          {
            dataToDisplay && <ExtractedResults dataToDisplay={dataToDisplay} />
          }
        </div>
      }

    </main>
  )
}
