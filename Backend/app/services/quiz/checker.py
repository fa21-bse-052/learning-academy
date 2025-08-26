from groq import Groq
import json
from typing import List, Union, Dict

from app.core.logger import get_logger
from app.core.config import settings

logger = get_logger("services.quiz.checker")

client = Groq(api_key=settings.groq_api_key)

def check_quiz_answers_llm(
    questions: Union[List[dict], List],
    user_answers: List[str],
    correct_answers: List[str]
) -> Dict:
    """
    Uses Groq LLM to evaluate quiz answers by comparing user answers with correct answers.
    Transcript is NOT used anymore.
    """

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
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
                "content": f"""Evaluate the user's answers against the correct answers.

Questions:
{json.dumps(questions, ensure_ascii=False)}

Correct Answers:
{json.dumps(correct_answers, ensure_ascii=False)}

User Answers:
{json.dumps(user_answers, ensure_ascii=False)}

Return ONLY the JSON object described by the system prompt."""
            }
        ],
        response_format={"type": "json_object"}
    )

    result = json.loads(response.choices[0].message.content)
    return result
