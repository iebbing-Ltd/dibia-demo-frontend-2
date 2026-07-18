import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNextQuestion, finalizeDynamicConsultation } from '../api/client'
import { useConsultation } from '../context/ConsultationContext'
import Icon from '../components/Icon'

export default function Questionnaire() {
  const navigate = useNavigate()
  const {
    patient,
    symptom,
    trail,
    setTrail,
    structuredSummary,
    setStructuredSummary,
    closingSummary,
    setClosingSummary,
    redFlag,
    setRedFlag,
    setResult,
  } = useConsultation()

  const [candidateQuestions, setCandidateQuestions] = useState([])
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [skippedQuestions, setSkippedQuestions] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [finalizing, setFinalizing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!symptom) {
      navigate('/symptom')
      return
    }
    if (trail.length === 0 && candidateQuestions.length === 0 && !isComplete) {
      fetchCandidates([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symptom])

  async function fetchCandidates(historySoFar, skipped = skippedQuestions, force = false) {
    setLoading(true)
    setError('')
    try {
      const res = await getNextQuestion({
        symptomName: symptom.name,
        patientAge: patient.age,
        patientGender: patient.gender,
        history: historySoFar,
        skippedQuestions: skipped,
        forceComplete: force,
      })
      const data = res.data
      setRedFlag((prev) => prev || Boolean(data.redFlag))
      if (data.structuredSummary) setStructuredSummary(data.structuredSummary)

      if (data.isComplete) {
        setClosingSummary(data.closingSummary || '')
        setIsComplete(true)
        setCandidateQuestions([])
        setActiveQuestion(null)
        return
      }
      setCandidateQuestions(data.candidateQuestions || [])
      setActiveQuestion(null)
    } catch {
      setError('Could not reach the clerking engine. Confirm the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  function pickCandidate(candidate) {
    setActiveQuestion(candidate)
  }

  function handleSkip() {
    const updatedSkipped = [...skippedQuestions, ...candidateQuestions.map((c) => c.question)]
    setSkippedQuestions(updatedSkipped)
    fetchCandidates(trail, updatedSkipped)
  }

  function handleAnswer(option) {
    const updatedTrail = [...trail, { question: activeQuestion.question, answer: option, allOptions: activeQuestion.options }]
    setTrail(updatedTrail)
    setActiveQuestion(null)
    setCandidateQuestions([])
    fetchCandidates(updatedTrail, skippedQuestions)
  }

  async function handleFinishNow() {
    await fetchCandidates(trail, skippedQuestions, true)
  }

  async function handleSaveConsultation() {
    setFinalizing(true)
    setError('')
    try {
      const res = await finalizeDynamicConsultation({
        patientName: patient.name || undefined,
        patientAge: patient.age,
        patientGender: patient.gender,
        symptomId: symptom.id || undefined,
        customComplaint: symptom.id ? undefined : symptom.name,
        trail,
        structuredSummary,
        closingSummary,
        redFlag,
      })
      setResult(res.data)
      navigate('/summary')
    } catch {
      setError('Could not save the consultation. Confirm the backend is running and try again.')
    } finally {
      setFinalizing(false)
    }
  }

  const s = structuredSummary

  return (
    <div className="paper-wrap">
      <aside className="paper-panel paper-panel-left">
        <div className="paper-section-title paper-section-title-first">Live summary &middot; doctor view</div>

        {!s ? (
          <p className="paper-empty">Builds here as questions are answered.</p>
        ) : (
          <>
            <span className="paper-live-tag">Chief complaint</span>
            <p className="paper-live-item">{s.chiefComplaint || symptom?.name}</p>

            {s.hpi?.length > 0 && (
              <>
                <span className="paper-live-tag">History of presenting illness</span>
                {s.hpi.map((l, i) => (
                  <p className="paper-live-item" key={i}>{l}</p>
                ))}
              </>
            )}

            {s.pertinentPositives?.length > 0 && (
              <>
                <span className="paper-live-tag">Pertinent positives</span>
                {s.pertinentPositives.map((l, i) => (
                  <p className="paper-live-item" key={i}>{l}</p>
                ))}
              </>
            )}

            {s.pertinentNegatives?.length > 0 && (
              <>
                <span className="paper-live-tag">Pertinent negatives</span>
                {s.pertinentNegatives.map((l, i) => (
                  <p className="paper-live-item" key={i}>{l}</p>
                ))}
              </>
            )}

            {s.redFlags?.length > 0 && (
              <>
                <span className="paper-live-tag paper-live-tag-flag">Red flags</span>
                {s.redFlags.map((l, i) => (
                  <p className="paper-live-item paper-live-item-flag" key={i}>{l}</p>
                ))}
              </>
            )}
          </>
        )}

        {redFlag && (
          <div className="paper-flag-banner">
            <Icon name="flag" size={14} /> Red flag screen positive
          </div>
        )}

        {!isComplete && (
          <div className="paper-btn-row">
            <button className="paper-btn paper-btn-danger-outline" onClick={handleFinishNow} disabled={loading}>
              Finish clerking now
            </button>
          </div>
        )}
      </aside>

      <section className="paper-panel">
        <div className="paper-header">
          <span className="paper-hospital-name">{symptom?.name} &middot; Clerking Sheet</span>
          <div className="paper-header-fields">
            <div>NAME: <span>{patient.name || '—'}</span></div>
            <div>AGE/SEX: <span>{patient.age || '—'} / {patient.gender || '—'}</span></div>
            <div>DATE: <span>{new Date().toLocaleDateString('en-GB')}</span></div>
          </div>
        </div>

        <div className="paper-section-title paper-section-title-first">A. Presenting complaint</div>
        <div className="paper-ruled-line">
          <span className="paper-ruled-label">Chief complaint</span>
          <div className="paper-ruled-value">{symptom?.name}</div>
        </div>

        <div className="paper-section-title">B. History of presenting complaint</div>
        {trail.map((t, i) => (
          <div key={i}>
            <div className="paper-answered-q">{t.question}</div>
            <div className="paper-answered-opts">
              {t.allOptions.map((o, j) => (
                <span key={j}>{o === t.answer ? '●' : '○'} {o}</span>
              ))}
            </div>
          </div>
        ))}

        {error && <p className="paper-error">{error}</p>}

        {loading && (
          <p className="paper-thinking">
            {isComplete ? 'Wrapping up…' : 'AI is preparing question options for you…'}
          </p>
        )}

        {!loading && !isComplete && !activeQuestion && candidateQuestions.length > 0 && (
          <>
            <div className="paper-section-title">Choose which to ask</div>
            {candidateQuestions.map((c, i) => (
              <button className="paper-candidate-card" key={i} onClick={() => pickCandidate(c)}>
                <div className="paper-candidate-q">{c.question}</div>
                <div className="paper-candidate-opts">{c.options.join(' · ')}</div>
              </button>
            ))}
            <div className="paper-btn-row">
              <button className="paper-btn paper-btn-ghost" onClick={handleSkip} disabled={loading}>
                Skip these, suggest different ones
              </button>
            </div>
            <p className="paper-live-label">
              Suggested by the model &middot; you decide which one the patient actually gets asked
            </p>
          </>
        )}

        {!loading && activeQuestion && (
          <>
            <div className="paper-active-q">{activeQuestion.question}</div>
            <div className="paper-options">
              {activeQuestion.options.map((o, i) => (
                <button key={i} className="paper-option-btn" onClick={() => handleAnswer(o)}>
                  ○ {o}
                </button>
              ))}
            </div>
            <div className="paper-btn-row">
              <button className="paper-btn paper-btn-ghost" onClick={() => setActiveQuestion(null)}>
                <Icon name="chevronLeft" size={14} /> Choose a different question instead
              </button>
            </div>
          </>
        )}

        {isComplete && (
          <>
            <div className="paper-section-title paper-summary-title">C. Doctor's summary / impression</div>
            <p className="paper-summary-text">{closingSummary || 'Summary pending.'}</p>
            <div className="paper-btn-row">
              <button className="paper-btn paper-btn-primary" onClick={handleSaveConsultation} disabled={finalizing}>
                {finalizing ? 'Saving…' : 'Save consultation'}
                {!finalizing && <Icon name="file" size={16} />}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
