import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines
1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use anemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. give max 10 flashcards.
{
  "flashcards": 
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
}
`;

function isFlashcardProps(data) {
  return (
    typeof data === "object" &&
    data !== null &&
    "front" in data &&
    "back" in data &&
    typeof data.front === "string" &&
    typeof data.back === "string"
  );
}

function isFlashcardPropsArray(data) {
  return Array.isArray(data) && data.every(isFlashcardProps);
}

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY; // Your Google API key
  
  try {
    const { content } = await req.json(); // Get the text input from the request

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    // Create the prompt for the model
    const prompt = `${systemPrompt}\n\n${content}`;

    // Generate the response from the model
    const result = await model.generateContentStream(prompt);
    const response = await result.response;
    let text = await response.text();

    // Log the raw response for debugging
    console.log("Raw response:", text);

    // Remove code block delimiters if present
    text = text.replace(/^```json\n/, '').replace(/\n```$/, '');

    // Attempt to parse the response as JSON
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError, text);
      return NextResponse.json({ message: "Invalid JSON response format" }, { status: 500 });
    }

    // Check if the parsed data is in the correct format
    if (!isFlashcardPropsArray(parsedData.flashcards)) {
      return NextResponse.json({ message: "Invalid flashcard data return format" }, { status: 500 });
    }

    // Return the flashcards
    return NextResponse.json(parsedData.flashcards, { status: 200 });

  } catch (error) {
    console.error("Error generating flashcards:", error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
