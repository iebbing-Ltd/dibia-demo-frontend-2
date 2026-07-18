import { createContext, useContext, useMemo, useState } from 'react'

const ConsultationContext = createContext(null)

const initialPatient = { name: '', age: '', gender: '' }

export function ConsultationProvider({ children }) {
  const [patient, setPatient] = useState(initialPatient)
  const [symptom, setSymptom] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  // Adaptive clerking state
  const [trail, setTrail] = useState([]) // [{ question, answer }]
  const [structuredSummary, setStructuredSummary] = useState(null)
  const [closingSummary, setClosingSummary] = useState('')
  const [redFlag, setRedFlag] = useState(false)

  function setAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function reset() {
    setPatient(initialPatient)
    setSymptom(null)
    setQuestions([])
    setAnswers({})
    setResult(null)
    setTrail([])
    setStructuredSummary(null)
    setClosingSummary('')
    setRedFlag(false)
  }

  const value = useMemo(
    () => ({
      patient,
      setPatient,
      symptom,
      setSymptom,
      questions,
      setQuestions,
      answers,
      setAnswer,
      result,
      setResult,
      trail,
      setTrail,
      structuredSummary,
      setStructuredSummary,
      closingSummary,
      setClosingSummary,
      redFlag,
      setRedFlag,
      reset,
    }),
    [patient, symptom, questions, answers, result, trail, structuredSummary, closingSummary, redFlag]
  )

  return <ConsultationContext.Provider value={value}>{children}</ConsultationContext.Provider>
}

export function useConsultation() {
  const ctx = useContext(ConsultationContext)
  if (!ctx) throw new Error('useConsultation must be used inside ConsultationProvider')
  return ctx
}
