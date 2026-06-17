from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ChatMessageBase(BaseModel):
    message: str


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageResponse(ChatMessageBase):
    id: int
    user_id: int
    response: str
    timestamp: datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


class ChatHistoryResponse(BaseModel):
    messages: List[ChatMessageResponse]

