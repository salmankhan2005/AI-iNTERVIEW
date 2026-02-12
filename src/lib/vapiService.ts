import Vapi from "@vapi-ai/web";

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

export const createVapiInstance = () => {
    if (!publicKey) {
        console.error("VITE_VAPI_PUBLIC_KEY is not defined");
        return null;
    }
    return new Vapi(publicKey);
};

export const getAssistantConfig = (interview: any) => {
    let questionText = "Please ask a few technical questions.";
    try {
        const questions = typeof interview.questions === 'string'
            ? JSON.parse(interview.questions)
            : interview.questions;
        if (Array.isArray(questions)) {
            questionText = questions.join(", ");
        }
    } catch (e) {
        console.error("Error parsing questions in config:", e);
    }

    // Following the exact structure from Vapi Web SDK README
    return {
        model: {
            provider: "openai" as const,
            model: "gpt-3.5-turbo" as const,
            messages: [
                {
                    role: "system" as const,
                    content: `You are an interviewer for a ${interview.position || 'job'} role. Ask these questions: ${questionText}. Be brief.`,
                },
            ],
        },
        voice: {
            provider: "11labs" as const,
            voiceId: "sarah" as const, // Standard 11labs voice
        },
        // Transcriber is optional but good to have
        transcriber: {
            provider: "deepgram" as const,
            model: "nova-2" as const,
            language: "en-US" as const,
        }
    };
};
