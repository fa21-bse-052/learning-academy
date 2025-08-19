import os
from datetime import datetime
import fitz  # PyMuPDF
from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger("services.certificate.generator")

def generate_certificate(name: str, template_filename: str = "Certificate_Template_Blank.pdf") -> str:
    base_dir = os.path.dirname(__file__)
    template_path = os.path.join(base_dir, template_filename)
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Certificate template not found at {template_path}")

    os.makedirs(settings.certificates_dir, exist_ok=True)
    date_str = datetime.now().strftime("%B %d, %Y")
    safe_name = name.replace(" ", "_")
    output_path = os.path.join(settings.certificates_dir, f"certificate_{safe_name}.pdf")

    doc = fitz.open(template_path)
    page = doc[0]
    # Insert text — positions might need adjusting depending on template
    page.insert_text((320, 305), name, fontsize=22, fontname="helv", fill=(0, 0, 0))
    page.insert_text((400, 410), date_str, fontsize=14, fontname="helv", fill=(0, 0, 0))
    page.insert_text((190, 440), "Muhammad Aktar", fontsize=14, fontname="helv", fill=(0, 0, 0))
    doc.save(output_path)
    doc.close()
    logger.info("Certificate saved to %s", output_path)
    return output_path
