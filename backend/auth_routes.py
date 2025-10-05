from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_session
from models import User
from security import hash_password, verify_password, create_access_token, hash_refresh_token
from sqlalchemy import select
from authlib.integrations.starlette_client import OAuth
import os

router = APIRouter()
oauth = OAuth()

# configure Facebook OAuth client via env vars
FB_CLIENT_ID = os.getenv("FB_CLIENT_ID")
FB_CLIENT_SECRET = os.getenv("FB_CLIENT_SECRET")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
oauth.register(
    name="facebook",
    client_id=FB_CLIENT_ID,
    client_secret=FB_CLIENT_SECRET,
    server_metadata_url=None,
    authorize_url="https://www.facebook.com/v16.0/dialog/oauth",
    access_token_url="https://graph.facebook.com/v16.0/oauth/access_token",
    client_kwargs={"scope": "email"}
)

class RegisterSchema(BaseModel):
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register(payload: RegisterSchema, session: AsyncSession = Depends(get_session)):
    q = await session.execute(select(User).where(User.email == payload.email))
    user = q.scalars().first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    session.add(user)
    await session.commit()
    await session.refresh(user)
    access = create_access_token(user.id)
    return {"access_token": access, "token_type": "bearer", "user_id": user.id}

@router.post("/login")
async def login(payload: LoginSchema, session: AsyncSession = Depends(get_session)):
    q = await session.execute(select(User).where(User.email == payload.email))
    user = q.scalars().first()
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access = create_access_token(user.id)
    # optionally create refresh token and store hashed
    return {"access_token": access, "token_type": "bearer", "user_id": user.id}
