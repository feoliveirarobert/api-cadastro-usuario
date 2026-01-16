from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Senha não confere")

    token = create_access_token(subject=str(user.id))
    return {"access_token": token, "token_type": "bearer"}
