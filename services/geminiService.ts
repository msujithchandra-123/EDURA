
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AIFeedback, DoubtMessage, MonthlyScore, WorksheetSchema } from '../types';

// This is a mocked service. In a real application, you would make API calls.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_LATENCY = 1500;

export const geminiService = {
  getChatResponse: async (message: string, history: DoubtMessage[]): Promise<string> => {
    console.log("Simulating Gemini chat call with message:", message);
    await new Promise(res => setTimeout(res, 500 + Math.random() * 500));
    
    const responses = [
      "That's a great question! Let's break it down. Think about it this way...",
      "I see what you're asking. The main idea is that...",
      "Excellent question! To understand this better, let's look at an example.",
      "Good thinking! It's all about how these two concepts connect. For instance...",
      "Let me help you with that. The key thing to remember is...",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  },

  evaluateHomeworkVideo: async (videoFile: File): Promise<AIFeedback> => {
    console.log("Simulating Gemini video evaluation for:", videoFile.name);
    await new Promise(res => setTimeout(res, MOCK_LATENCY * 2));

    const score = 70 + Math.floor(Math.random() * 25);
    return {
      id: `fb-${Date.now()}`,
      submissionId: `sub-${Date.now()}`,
      score,
      summary: "Good effort on your presentation! You used several prepositions correctly, but your pronunciation could be a bit clearer on some words.",
      detailedFeedback: `
### Detailed Analysis:
- **Grammar (8/10):** Your sentence structure is mostly correct. You used 'in', 'on', and 'under' accurately. Try to vary your sentences more.
- **Preposition Usage (7/10):** You correctly used 3 prepositions. To improve, try including prepositions of time like 'before' or 'after'.
- **Clarity & Pronunciation (6/10):** Your speech was a little fast, which made some words like 'through' and 'across' difficult to understand. Practice speaking slowly and clearly.

### Suggestions for Improvement:
1.  Record yourself and listen back to identify words you find tricky.
2.  Try writing down your sentences before you speak to check your grammar.
3.  Great job overall! Keep practicing!
      `
    };
  },

  evaluateWorksheet: async (answers: Record<string, any>): Promise<AIFeedback> => {
    console.log("Simulating Gemini worksheet evaluation for answers:", answers);
    await new Promise(res => setTimeout(res, MOCK_LATENCY));

    const score = 80 + Math.floor(Math.random() * 18);
    return {
      id: `fb-${Date.now()}`,
      submissionId: `sub-${Date.now()}`,
      score,
      summary: "Well done on the worksheet! You have a good grasp of the concepts, with just a few minor errors in grammar.",
      detailedFeedback: `
### Question-by-Question Breakdown:
- **Fill in the Blanks:** All correct! You know your vocabulary.
- **Sentence Writing:** Your sentences were creative, but one had a subject-verb agreement error ('The cats runs' should be 'The cats run').
- **MCQ:** You got 4 out of 5 correct. Question 3 was tricky, remember the difference between 'its' and 'it's'.

### Key Takeaway:
Focus on proofreading your written work for small grammatical mistakes. Your understanding of the topics is strong!
      `
    };
  },

  generateStudentAnalytics: async (studentId: string): Promise<{ summary: string; monthlyScores: MonthlyScore[] }> => {
    console.log("Simulating Gemini analytics generation for student:", studentId);
    await new Promise(res => setTimeout(res, MOCK_LATENCY));

    const summary = `
**Overall Performance Summary:**
The student shows strong performance in worksheets, indicating good theoretical knowledge. Homework scores, which focus on practical application and speaking, are slightly lower but show a positive upward trend.

**Strengths:**
-   Excellent vocabulary and comprehension in written tasks.
-   Consistent completion of assignments.

**Areas for Improvement:**
-   Spoken clarity and pronunciation in video homework.
-   More complex sentence structures in written answers.

**Recommendations:**
-   Encourage participation in class discussions to build speaking confidence.
-   Introduce more challenging reading materials to expand sentence structure knowledge.
`;

    const monthlyScores: MonthlyScore[] = [
      { month: 'Jan', homeworkScore: 65, worksheetScore: 80 },
      { month: 'Feb', homeworkScore: 70, worksheetScore: 82 },
      { month: 'Mar', homeworkScore: 68, worksheetScore: 88 },
      { month: 'Apr', homeworkScore: 75, worksheetScore: 85 },
      { month: 'May', homeworkScore: 78, worksheetScore: 90 },
      { month: 'Jun', homeworkScore: 82, worksheetScore: 92 },
    ];
    
    return { summary, monthlyScores };
  },

  convertPdfToForm: async (pdfFile: File): Promise<WorksheetSchema> => {
    console.log("Simulating Gemini PDF to JSON Form conversion for:", pdfFile.name);
    await new Promise(res => setTimeout(res, 2500)); // Simulate processing time

    return {
      title: "Science Worksheet: The Solar System",
      instructions: "Answer all questions to the best of your ability.",
      questions: [
        {
          id: 1,
          type: "fill-in-the-blank",
          question: "The planet closest to the sun is ____."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "Which of the following is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter"]
        },
        {
          id: 3,
          type: "short_answer",
          question: "In one sentence, describe why astronauts float in space.",
          lines: 3
        },
        {
          id: 4,
          type: 'true_false',
          question: 'Earth is the largest planet in our solar system.'
        }
      ]
    };
  },
};