from fastapi import APIRouter, HTTPException
import logging
from pydantic import BaseModel
from . import service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/meetings", tags=["meetings"])


class AgendaRequest(BaseModel):
    subject: str
    stakes: str
    trigger: str
    participants: list[str]
    duration: str


class MinutesRequest(BaseModel):
    subject: str
    participants: list[str]
    notes: str


class EmailRequest(BaseModel):
    subject: str
    participants: list[str]
    decisions: str
    actions: str


class TrackingRequest(BaseModel):
    meeting_subject: str
    initial_actions: list[dict]
    current_status: list[dict]


@router.post("/generate/agenda")
async def generate_agenda(req: AgendaRequest):
    try:
        agenda = await service.generate_agenda(
            req.subject, req.stakes, req.trigger, req.participants, req.duration
        )
        return {"status": "success", "agenda": agenda}
    except Exception as e:
        logger.error(f"Generate agenda error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate/minutes")
async def generate_minutes(req: MinutesRequest):
    result = await service.generate_minutes(req.subject, req.participants, req.notes)
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


@router.post("/generate/email")
async def generate_email(req: EmailRequest):
    try:
        email = await service.generate_email(
            req.subject, req.participants, req.decisions, req.actions
        )
        return {"status": "success", "email": email}
    except Exception as e:
        logger.error(f"Generate email error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/track/actions")
async def track_actions(req: TrackingRequest):
    try:
        tracking = await service.track_actions(
            req.meeting_subject, req.initial_actions, req.current_status
        )
        return {"status": "success", "tracking": tracking}
    except Exception as e:
        logger.error(f"Track actions error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
