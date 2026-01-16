from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.auth import get_current_user


from app.core.security import hash_password
from app.core.auth import get_current_user
from app import models, schemas
from app.database import SessionLocal

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    pw_bytes = user.password.encode("utf-8")
    if len(pw_bytes) > 72:
        raise HTTPException(status_code=400, detail="Senha muito longa (máx 72 bytes para bcrypt).")

    new_user = models.User(
        name=user.name,
        email=user.email,
        age=user.age,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/", response_model=List[schemas.UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Por simplicidade: qualquer usuário logado pode listar
    return db.query(models.User).all()


@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Regra simples de “empresa”: só pode editar a própria conta
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Você só pode editar seu próprio usuário")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    payload = data.model_dump(exclude_unset=True)

    if "password" in payload:
        user.hashed_password = hash_password(payload.pop("password"))

    for key, value in payload.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Você só pode deletar seu próprio usuário")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db.delete(user)
    db.commit()
    return {"message": "Usuário deletado com sucesso"}

