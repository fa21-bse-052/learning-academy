from groq import Groq
import json
from typing import List, Union, Dict

from app.core.logger import get_logger
from app.core.config import settings

logger = get_logger("services.quiz.checker")

client = Groq(api_key=settings.groq_api_key)

def check_quiz_answers_llm(questions: Union[List[dict], List], answers: List[str], transcript: str) -> Dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are an intelligent quiz evaluator.
Respond only with JSON using this format:
{
  "quiz_evaluation": {
    "marks": 2,
    "percentage": 66.67
  }
}
Return exactly the keys shown and NOTHING ELSE."""
            },
            {
                "role": "user",
                "content": f"""Evaluate the user's answers using only the transcript.

Transcript:
\"\"\"{transcript}\"\"\"

Questions:
{json.dumps(questions, ensure_ascii=False)}

User Answers:
{json.dumps(answers, ensure_ascii=False)}

Return the JSON object described by the system prompt and nothing else."""
            }
        ],
        response_format={"type": "json_object"}
    )

    result = json.loads(response.choices[0].message.content)
    return result
