import json
import time
import uuid
from pathlib import Path
from app.db.db import SessionLocal
from app.db.models import User, Question, Playground, UserRole, Difficulty, PlaygroundType


def init_db():
    db = SessionLocal()
    try:
        # Ensure default teacher user exists for question ownership
        teacher = db.query(User).filter(User.email == "teacher@nst.edu").first()
        if not teacher:
            teacher = User(
                id=uuid.uuid4(),
                full_name="Default Teacher",
                email="teacher@nst.edu",
                password_hash="pbkdf2_placeholder",
                role=UserRole.TEACHER,
                is_active=True,
            )
            db.add(teacher)
            db.commit()
    finally:
        db.close()



def list_questions():
    db = SessionLocal()
    try:
        rows = db.query(Question).order_by(Question.created_at.desc()).all()
        result = []
        for r in rows:
            created_ts = r.created_at.timestamp() if r.created_at else time.time()
            result.append({"id": str(r.id), "title": r.title, "created_at": created_ts})
        return result
    finally:
        db.close()


def get_question(question_id):
    db = SessionLocal()
    try:
        try:
            q_uuid = uuid.UUID(str(question_id))
            q = db.query(Question).filter(Question.id == q_uuid).first()
        except ValueError:
            q = None

        if not q:
            return None

        sol_pg = (
            db.query(Playground)
            .filter(
                Playground.question_id == q.id,
                Playground.type == PlaygroundType.QUESTION_SOLUTION,
            )
            .first()
        )
        solution = sol_pg.diagram_json if sol_pg else {}
        if isinstance(solution, str):
            solution = json.loads(solution)

        created_ts = q.created_at.timestamp() if q.created_at else time.time()
        return {
            "id": str(q.id),
            "title": q.title,
            "question": q.description,
            "solution": solution,
            "created_at": created_ts,
        }
    finally:
        db.close()


def create_question(title: str, question: str, solution):
    db = SessionLocal()
    try:
        teacher = db.query(User).filter(User.role == UserRole.TEACHER).first()
        teacher_id = teacher.id if teacher else None

        q = Question(
            id=uuid.uuid4(),
            title=title,
            description=question,
            difficulty=Difficulty.MEDIUM,
            created_by=teacher_id,
            is_published=True,
        )
        db.add(q)
        db.commit()
        db.refresh(q)

        if teacher_id:
            pg = Playground(
                id=uuid.uuid4(),
                name=f"{title} Solution",
                owner_id=teacher_id,
                question_id=q.id,
                type=PlaygroundType.QUESTION_SOLUTION,
                diagram_json=solution,
            )
            db.add(pg)
            db.commit()

        return str(q.id)
    finally:
        db.close()


def delete_question(question_id) -> bool:
    db = SessionLocal()
    try:
        try:
            q_uuid = uuid.UUID(str(question_id))
            q = db.query(Question).filter(Question.id == question_id).first()
        except ValueError:
            q = None

        if not q:
            return False
        db.delete(q)
        db.commit()
        return True
    finally:
        db.close()
