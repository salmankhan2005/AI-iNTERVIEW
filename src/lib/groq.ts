import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateInterviewQuestions(
  position: string,
  description: string,
  interviewTypes: string[]
): Promise<string[]> {
  const prompt = `Generate 9 interview questions for a ${position} position.
Job Description: ${description}
Interview Types: ${interviewTypes.join(", ")}

Return ONLY a JSON array of question strings, no other text.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content || "[]";
  return JSON.parse(content);
}

export async function generateFeedback(
  transcript: string,
  position: string,
  description: string
): Promise<any> {
  const prompt = `Analyze the following interview transcript and provide a structured feedback report.
Candidate Position: ${position}
Job Description: ${description}
Transcript: 
${transcript}

Return ONLY a JSON object with this exact structure:
{
  "score": "overall score number out of 10 (e.g. 7)",
  "technical_skills": 0-10,
  "communication": 0-10,
  "problem_solving": 0-10,
  "experience": 0-10,
  "feedback": "A detailed 2-3 sentence performance summary",
  "recommendation": "A concise recommendation message (e.g. 'Strong candidate, proceed to next round')"
}

IMPORTANT: Return ONLY the JSON object. No other text.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
  });

  const content = completion.choices[0]?.message?.content || "{}";
  // Clean potential markdown code blocks
  const cleanContent = content.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanContent);
}
