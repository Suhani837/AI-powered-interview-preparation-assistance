const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe("The match score between the candidate and the job describe"),
  technicalQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take, etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intentions",
    ),
  behavioralQuestion: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take, etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention",
    ),
  skillGap: z
    .array(
      z.object({
        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the skill gap"),
      }),
    )
    .describe(
      "The skills that the candidate is lacking along with their severity",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day of the preparation plan"),
        focus: z
          .string()
          .describe("The focus of the preparation plan for that day"),
        tasks: z
          .array(z.string())
          .describe("The tasks to be completed on that day"),
      title: z.string().describe("The title of the job for which the interview report is generated"),
      }),
    )
    .describe(
      "The preparation plan for the candidate to improve their skills and prepare for the interview",
    ),
});

const jsonSchema = zodToJsonSchema(interviewReportSchema);

console.log(
  JSON.stringify(jsonSchema, null, 2)
);

async function generateInterviewReport({ resume, selfdescribe, jobdescribe }) {
  const prompt = `Generate an interview preparation report for the candidate using the resume, self description, and job description below. RESUME: ${resume} SELF DESCRIPTION: ${selfdescribe} JOB DESCRIPTION: ${jobdescribe} IMPORTANT OUTPUT RULES: 1. Return ONLY one JSON object. 2. The JSON object MUST contain EXACTLY these five top-level fields: - matchScore - technicalQuestions - behavioralQuestions - skillGaps - preparationPlan 3. DO NOT return any other top-level fields. 4. technicalQuestions MUST be an array of objects. EVERY object MUST have exactly these fields: - question: string - intention: string - answer: string Example: { "question": "Explain the React component lifecycle.", "intention": "To evaluate the candidate's understanding of React internals.", "answer": "Explain mounting, updating, and unmounting, and discuss useEffect..." } NEVER return technicalQuestions as an array of strings. 5. behavioralQuestions MUST be an array of objects. EVERY object MUST have exactly these fields: - question: string - intention: string - answer: string NEVER return behavioralQuestions as an array of strings. 6. skillGaps MUST be an array of objects. EVERY object MUST have exactly these fields: - skill: string - severity: "low", "medium", or "high" NEVER return skillGaps as an array of strings. 7. preparationPlan MUST be an array of objects. EVERY object MUST have exactly these fields: - day: number - focus: string - tasks: array of strings Example: { "day": 1, "focus": "Advanced React", "tasks": [ "Study React rendering", "Practice useMemo and useCallback" ] } NEVER return preparationPlan as an array of strings. 8. matchScore MUST be a number between 0 and 100. 9. Do NOT include candidate information, contact details, education, projects, experience, achievements, strengths, hiring recommendation, or any other fields outside the required schema. 10. Before returning the response, verify that every array contains the correct OBJECT structure described above.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });
  return JSON.parse(response.text)
  

  
}

async function generatePdfFromHtml(htmlContent){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent,{waitUntil:"networkidle0"})

  const pdfBuffer = await page.pdf({format:"A4",margin:{
    top:"20mm",
    bottom:"20mm",
    left:"15mm",
    right:"15mm"
  }});

  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({resume, selfDescription, jobDescription}){
  const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume PDF"),
  })

  const prompt = `Generate a resume PDF for the candidate using the resume, self description, and job description below. RESUME: ${resume} SELF DESCRIPTION: ${selfDescription} JOB DESCRIPTION: ${jobDescription} IMPORTANT OUTPUT RULES: 1. Return ONLY one JSON object. 2. The JSON object MUST contain EXACTLY one top-level field: - html 3. DO NOT return any other top-level fields. 4. html MUST be a string containing the HTML content of the resume PDF.
  The resume should be for the given job description and should highlight the candidate's skills and experience relevant to the job. 5. The HTML content should be well-structured and formatted for a professional resume. 6. Do NOT include any personal information, contact details, or other sensitive information in the HTML content. 7. Before returning the response, verify that the html field is a valid string containing HTML content.
  The content of the resume should be based on the resume, self description, and job description provided.
  the content of resume should not sound like generated by ai and should be close as written by human. The resume should be concise, clear, and tailored to the job description provided.
  you can highlight the content usong some colors or different font styles to make it visually appealing. The resume should be in a professional format and should be suitable for submission to potential employers.
  the resume should not contain any spelling or grammatical errors. The resume should be easy to read and should effectively communicate the candidate's qualifications for the job.
  
  `;

  const response = await ai.models.generateContent({
    model:"gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),

    }
  })
  const jsonContent = JSON.parse(response.text)
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
  return pdfBuffer;
}
module.exports = {generateInterviewReport, generateResumePdf, };
