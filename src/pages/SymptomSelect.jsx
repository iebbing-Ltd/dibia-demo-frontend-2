import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSymptoms } from '../api/client'
import { useConsultation } from '../context/ConsultationContext'
import ProgressTrace from '../components/ProgressTrace'
import Icon from '../components/Icon'

const SYMPTOM_ICONS = {
  Headache: 'brain',
  Fever: 'thermometer',
  'Chest Pain': 'pulse',
  Cough: 'lungs',
  'Abdominal Pain': 'stomach',
}

export default function SymptomSelect() {
  const navigate = useNavigate()
  const { symptom, setSymptom, setTrail, setStructuredSummary, setClosingSummary, setRedFlag } =
    useConsultation()
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [customComplaint, setCustomComplaint] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  useEffect(() => {
    getSymptoms()
      .then((res) => setSymptoms(res.data))
      .catch(() => setError('Could not load symptoms. Confirm the backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  function proceed(item) {
    setSymptom(item)
    setTrail([])
    setStructuredSummary(null)
    setClosingSummary('')
    setRedFlag(false)
    navigate('/questions')
  }

  function choose(item) {
    proceed(item)
  }

  function submitCustom() {
    if (!customComplaint.trim()) return
    proceed({ id: null, name: customComplaint.trim() })
  }

  return (
    <div className="page">
      <ProgressTrace step={1} />

      <div className="card card-wide">
        <span className="eyebrow">
          <Icon name="clipboard" size={16} /> Step 2
        </span>
        <h2 className="display-md">What's the primary complaint?</h2>
        <p className="section-copy">Choosing a symptom loads its own follow-up questionnaire.</p>

        {loading && <p className="section-copy">Loading symptoms…</p>}
        {error && (
          <p className="field-error">
            <Icon name="alert" size={16} /> {error}
          </p>
        )}

        <div className="symptom-grid">
          {symptoms.map((item) => (
            <button
              key={item.id}
              className={symptom?.id === item.id ? 'symptom-card is-selected' : 'symptom-card'}
              onClick={() => choose(item)}
            >
              <Icon name={SYMPTOM_ICONS[item.name] || 'clipboard'} size={26} />
              <span className="symptom-card-name">{item.name}</span>
              <span className="symptom-card-count">Adaptive follow-up</span>
            </button>
          ))}
          <button
            className={showCustomInput ? 'symptom-card is-selected' : 'symptom-card'}
            onClick={() => setShowCustomInput(true)}
          >
            <Icon name="clipboard" size={26} />
            <span className="symptom-card-name">Other</span>
            <span className="symptom-card-count">Type it in</span>
          </button>
        </div>

        {showCustomInput && (
          <div className="field-row" style={{ marginTop: '4px' }}>
            <label htmlFor="customComplaint">What's the complaint?</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                id="customComplaint"
                type="text"
                className="field-input"
                placeholder="e.g. Lower back pain"
                value={customComplaint}
                onChange={(e) => setCustomComplaint(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitCustom()}
                autoFocus
              />
              <button
                className="btn btn-primary"
                onClick={submitCustom}
                disabled={!customComplaint.trim()}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <div className="card-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/patient')}>
            <Icon name="chevronLeft" size={18} /> Back
          </button>
        </div>
      </div>
    </div>
  )
}
