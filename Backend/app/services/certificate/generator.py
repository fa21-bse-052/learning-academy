import os
from datetime import datetime
import fitz  # PyMuPDF
from app.core.config import settings
from app.core.logger import get_logger
from app.db.client import get_db

logger = get_logger("services.certificate.generator")


async def generate_certificate(
    video_id: str,
    user_name: str,
    user_percentage: float,
    template_filename: str = "Certificate_Template_Blank.pdf"
) -> str:
    logger.info("Starting certificate generation", extra={
        "video_id": video_id,
        "user_name": user_name,
        "user_percentage": user_percentage
    })

    # Retrieve course details from DB
    db = get_db()
    courses = db["courses"]
    course_doc = await courses.find_one({"video_id": video_id})

    if not course_doc:
        logger.error("Course not found for video_id=%s", video_id)
        raise Exception(f"Course not found for video_id {video_id}")

    course_name = course_doc.get("course_title", "Unknown Course")
    passing_criteria = course_doc.get("passing_criteria", 0)
    logger.info(
        "Course found: %s (passing criteria: %s%%)",
        course_name, passing_criteria
    )

    # Check if user meets passing criteria
    if user_percentage < passing_criteria:
        logger.warning(
            "User %s did not meet passing criteria. Required=%s, Got=%s",
            user_name, passing_criteria, user_percentage
        )
        raise Exception(
            f"User {user_name} did not meet passing criteria ({passing_criteria}%). "
            "Certificate cannot be issued."
        )

    base_dir = os.path.dirname(__file__)
    template_path = os.path.join(base_dir, template_filename)
    if not os.path.exists(template_path):
        logger.error("Certificate template not found: %s", template_path)
        raise FileNotFoundError(f"Certificate template not found at {template_path}")

    os.makedirs(settings.certificates_dir, exist_ok=True)
    date_str = datetime.now().strftime("%B %d, %Y")
    safe_name = user_name.replace(" ", "_")
    output_path = os.path.join(settings.certificates_dir, f"certificate_{safe_name}.pdf")

    logger.debug("Using template: %s", template_path)
    logger.debug("Output path: %s", output_path)

    doc = fitz.open(template_path)
    page = doc[0]

    # Insert text at positions
    logger.debug("Inserting text into certificate PDF")
    page.insert_text((330, 305), user_name, fontsize=22, fontname="helv", fill=(0, 0, 0))
    page.insert_text((320, 370), course_name, fontsize=18, fontname="helv", fill=(0, 0, 0))
    page.insert_text((400, 410), date_str, fontsize=14, fontname="helv", fill=(0, 0, 0))
    page.insert_text((170, 440), "Muhammad Aktar", fontsize=14, fontname="helv", fill=(0, 0, 0))

    doc.save(output_path)
    doc.close()

    logger.info("Certificate successfully generated for %s at %s", user_name, output_path)
    return output_path
