const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const message = body?.error || `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return body
}

export function getDisclaimer() {
  return request('/disclaimer')
}

export function getSymptoms() {
  return request('/api/symptoms')
}

export function getQuestions(symptomId) {
  return request(`/api/symptoms/${symptomId}/questions`)
}

export function createConsultation(payload) {
  return request('/api/consultations', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function regenerateSummary(consultationId) {
  return request(`/api/consultations/${consultationId}/regenerate-summary`, {
    method: 'POST',
  })
}

export function getNextQuestion(payload) {
  return request('/api/consultations/next-question', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function finalizeDynamicConsultation(payload) {
  return request('/api/consultations/dynamic', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
