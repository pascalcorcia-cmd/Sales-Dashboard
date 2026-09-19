import json
import logging
import anthropic
from app.config import ANTHROPIC_API_KEY, CLAUDE_MODEL, MAX_TOKENS
from .prompts import AGENDA_PROMPT, CR_PROMPT, EMAIL_PROMPT, TRACKING_PROMPT

logger = logging.getLogger(__name__)
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


async def generate_agenda(subject: str, stakes: str, trigger: str, participants: list[str], duration: str) -> str:
    prompt = AGENDA_PROMPT.format(
        subject=subject,
        stakes=stakes,
        trigger=trigger,
        num_participants=len(participants),
        participants=", ".join(participants),
        duration=duration
    )

    try:
        response = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=MAX_TOKENS,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    except Exception as e:
        logger.error(f"Error generating agenda: {e}")
        raise


async def generate_minutes(subject: str, participants: list[str], notes: str) -> dict:
    prompt = CR_PROMPT.format(
        subject=subject,
        participants=", ".join(participants),
        notes=notes
    )

    try:
        response = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=MAX_TOKENS,
            messages=[{"role": "user", "content": prompt}]
        )
        text = response.content[0].text
        return {
            "summary": text.split("\n")[0],
            "content": text,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Error generating minutes: {e}")
        return {"status": "error", "message": str(e)}


async def generate_email(subject: str, participants: list[str], decisions: str, actions: str) -> str:
    prompt = EMAIL_PROMPT.format(
        subject=subject,
        participants=", ".join(participants),
        decisions=decisions,
        actions=actions
    )

    try:
        response = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    except Exception as e:
        logger.error(f"Error generating email: {e}")
        raise


async def track_actions(meeting_subject: str, initial_actions: list[dict], current_status: list[dict]) -> str:
    prompt = TRACKING_PROMPT.format(
        meeting_subject=meeting_subject,
        initial_actions=json.dumps(initial_actions),
        current_status=json.dumps(current_status)
    )

    try:
        response = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=MAX_TOKENS,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    except Exception as e:
        logger.error(f"Error tracking actions: {e}")
        raise
