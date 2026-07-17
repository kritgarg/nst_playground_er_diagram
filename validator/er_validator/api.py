from fastapi import FastAPI, Body, HTTPException
from er_validator import store
from er_validator.core import validate
from er_validator.engine.base import EngineError
from er_validator.name_matcher import DEFAULT_SIMILARITY_THRESHOLD, compare_entities
from er_validator.schema import SchemaError

app = FastAPI()

@app.get('/health')
def health():
    return {"okay": True}

@app.post('/validate')
def validate_endpoint(payload: dict = Body(...)):
    expected_solution = payload.get('expected_solution')
    student_solution = payload.get('student_solution')
    if expected_solution is None or student_solution is None:
        raise HTTPException(422, 'body must contain "expected_solution" and "student_solution" diagram objects')
    try:
        return validate(expected_solution, student_solution, payload.get('algorithm'))
    except SchemaError as e:
        raise HTTPException(422, str(e))
    except EngineError as e:
        raise HTTPException(500, str(e))

@app.post('/compare-names')
def compare_names_endpoint(payload: dict = Body(...)):
    expected_solution = payload.get('expected_solution')
    student_solution = payload.get('student_solution')
    if not isinstance(expected_solution, list) or not isinstance(student_solution, list):
        raise HTTPException(422, 'body must contain "expected_solution" and "student_solution" arrays of names')
    return compare_entities(
        expected_solution, student_solution,
        weights=payload.get('weights'),
        penalties=payload.get('penalties'),
        similarity_threshold=payload.get('similarity_threshold', DEFAULT_SIMILARITY_THRESHOLD),
        custom_ontology=payload.get('custom_ontology') or (),
    )

@app.get('/questions')
def questions_list():
    return store.list_questions()

@app.post('/questions')
def questions_create(payload: dict = Body(...)):
    title = payload.get('title')
    question = payload.get('question')
    solution = payload.get('solution')
    if not title or not question or solution is None:
        raise HTTPException(422, 'body must contain "title", "question" and "solution"')
    return {'id': store.create_question(title, question, solution)}


@app.get('/questions/{qid}')
def questions_get(qid: int, include_solution: bool = False):
    question = store.get_question(qid)
    if question is None:
        raise HTTPException(404, f'no question with id {qid}')
    if not include_solution:
        del question['solution']
    return question

@app.delete('/questions/{qid}')
def questions_delete(qid: int):
    if not store.delete_question(qid):
        raise HTTPException(404, f'no question with id {qid}')
    return {'ok': True }

@app.post('/questions/{qid}/submit')
def questions_submit(qid: int, payload: dict = Body(...)):
    q = store.get_question(qid)
    if q is None:
        raise HTTPException(404, f'no question with id {qid}')
    student = payload.get('student')
    if student is None:
        raise HTTPException(422, 'body must contain a "student" diagram object')
    try:
        return validate(q['reference'], student, payload.get('algorithm'))
    except SchemaError as e:
        raise HTTPException(422, str(e))
    except EngineError as e:
        raise HTTPException(500, str(e))
