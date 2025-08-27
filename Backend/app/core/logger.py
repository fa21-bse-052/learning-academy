import logging

def get_logger(name: str) -> logging.Logger:
    # configure only if not configured yet
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s — %(name)s — %(levelname)s — %(message)s"
    )
    return logging.getLogger(name)
