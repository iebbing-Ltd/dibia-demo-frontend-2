# Clerk — Medical Clerking Frontend

Guided patient consultation UI for the clerking demo. React + Vite, plain CSS, no UI framework.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

By default the app talks to `http://localhost:5000` (the Express backend). Change `VITE_API_URL` in `.env` if the backend runs elsewhere.

## Flow

1. **Home** — intro screen, pulls the disclaimer from `GET /disclaimer`.
2. **Patient info** — name (optional), age, gender.
3. **Symptom select** — cards from `GET /api/symptoms`.
4. **Questionnaire** — one question at a time, rendered from `GET /api/symptoms/:id/questions`. Supports single-select, multi-select, number-input, date/duration, and free text.
5. **Summary** — submits everything to `POST /api/consultations`, shows the generated summary, with a "Regenerate summary" action wired to `POST /api/consultations/:id/regenerate-summary`.

## Structure

```
src/
  api/client.js              fetch wrapper for all backend calls
  context/ConsultationContext.jsx   shared state across the flow
  components/
    Icon.jsx                 svg icon set (no emoji anywhere)
    ProgressTrace.jsx         ECG-style step progress
    QuestionField.jsx         renders the right input per question type
  pages/
    Home.jsx
    PatientInfo.jsx
    SymptomSelect.jsx
    Questionnaire.jsx
    Summary.jsx
```

## Notes for backend integration

- Answers are posted as `{ questionId, answerValue }`, matching the sample payload in the backend README.
- `patientAge` and `patientGender` are required by the API and validated client-side before moving to the symptom step.
- If a symptom's questions include a type outside `single-select` / `multi-select` / `number-input` / `text-input`, it falls back to a free-text field so nothing breaks if new types get added later.

<!-- deploy test 07/18/2026 15:04:58 -->
