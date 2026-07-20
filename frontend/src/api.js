const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';


export async function fetchQuestions() {
  const res = await fetch(`${API_BASE}/questions`);
  if (!res.ok) throw new Error(`Failed to fetch questions: ${res.status}`);
  return res.json();
}

export async function fetchQuestion(id, includeSolution = false) {
  const url = `${API_BASE}/questions/${id}${includeSolution ? '?include_solution=true' : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch question ${id}: ${res.status}`);
  return res.json();
}

export async function submitSolution(questionId, studentDiagram) {
  const res = await fetch(`${API_BASE}/questions/${questionId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student: studentDiagram }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Submission failed: ${res.status}`);
  }
  return res.json();
}
