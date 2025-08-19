from groq import Groq
import json

from app.core.logger import get_logger
from app.core.config import settings

logger = get_logger("services.quiz.generator")

client = Groq(api_key=settings.groq_api_key)

def generate_quiz(transcript: str, num_questions: int) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are an expert trainer that generates quizzes.
Respond only with JSON using this format:
{
  "quiz": [
    {
      "question": "<string>",
      "options": ["<string>", "<string>", ...]
    }
  ]
}
Return exactly the number of questions requested by the user.
Do NOT include answers, metadata, or any additional fields."""
            },
            {
                "role": "user",
                "content": f"Generate {num_questions} MCQ-style questions from the following transcript:\n\"\"\"{transcript}\"\"\""
            }
        ],
        response_format={"type": "json_object"}
    )

    result = json.loads(response.choices[0].message.content)
    quiz = result.get("quiz", [])
    return json.dumps(quiz, ensure_ascii=False)
