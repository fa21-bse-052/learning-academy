from groq import Groq
import json

from app.core.logger import get_logger
from app.core.config import settings

logger = get_logger("services.quiz.generator")

client = Groq(api_key=settings.groq_api_key)

def generate_quiz(transcript: str, num_questions: int,language_preference:str) -> str:
    """
    Use Groq JSON mode to generate a list of questions. Returns a JSON string
    of a list like:
    [
      {"question": "...", "options": ["a","b","c"], "answer": "a"},
      ...
    ]
    """
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": """You are an expert trainer that generates quizzes. Generate the quiz in the following language

Language Preference:
{language_preference}

Respond only with JSON using this format exactly:
{
  "quiz": [
    {
      "question": "<string>",
      "options": ["<string>", "<string>", ...],
      "answer": "<string>"           // the correct option text
    }
  ]
}
Return exactly the number of questions requested by the user.
Do NOT include metadata, explanations, or any additional fields."""
            },
            {
                "role": "user",
                "content": f"Generate {num_questions} MCQ-style questions in {language_preference} language from the following transcript:\n\"\"\"{transcript}\"\"\""
            }
        ],
        response_format={"type": "json_object"}
    )

    raw = response.choices[0].message.content
    logger.debug("Groq response raw type: %s", type(raw))
    logger.debug("Groq response raw content: %s", raw)

    # Accept already-parsed dict/list or JSON string
    if isinstance(raw, (dict, list)):
        result = raw
    else:
        try:
            result = json.loads(raw)
        except Exception as e:
            logger.exception("Failed to parse Groq response: %s", e)
            raise

    # Accept either {"quiz": [...]} or directly [...]
    if isinstance(result, dict) and "quiz" in result:
        quiz_list = result["quiz"]
    elif isinstance(result, list):
        quiz_list = result
    else:
        logger.warning("Unexpected generator result shape: %s", result)
        quiz_list = []

    if not quiz_list:
        logger.warning("Generated quiz is empty. Raw result: %s", result)

    # Return a JSON string of the list for consistent DB storage
    return json.dumps(quiz_list, ensure_ascii=False)
