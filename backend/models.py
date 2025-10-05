import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()
def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = sa.Column(sa.String, primary_key=True, default=gen_uuid)
    email = sa.Column(sa.String, unique=True, index=True, nullable=True)
    hashed_password = sa.Column(sa.String, nullable=True)
    is_active = sa.Column(sa.Boolean, default=True)
    is_verified = sa.Column(sa.Boolean, default=False)
    oauth_provider = sa.Column(sa.String, nullable=True)  # 'facebook', etc.
    oauth_id = sa.Column(sa.String, nullable=True)
    created_at = sa.Column(sa.DateTime(timezone=True), server_default=func.now())
    updated_at = sa.Column(sa.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    refresh_token_hash = sa.Column(sa.String, nullable=True)  # optional
