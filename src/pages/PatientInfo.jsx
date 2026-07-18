import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConsultation } from '../context/ConsultationContext'
import ProgressTrace from '../components/ProgressTrace'
import Icon from '../components/Icon'

export default function PatientInfo() {
  const navigate = useNavigate()
  const { patient, setPatient } = useConsultation()
  const [error, setError] = useState('')

  function update(field, value) {
    setPatient((prev) => ({ ...prev, [field]: value }))
  }

  function next() {
    if (!patient.age || !patient.gender) {
      setError('Age and gender are required to continue.')
      return
    }
    setError('')
    navigate('/symptom')
  }

  return (
    <div className="page">
      <ProgressTrace step={0} />

      <div className="card card-form">
        <span className="eyebrow">
          <Icon name="user" size={16} /> Step 1
        </span>
        <h2 className="display-md">Who are we clerking today?</h2>
        <p className="section-copy">Patient name is optional. Age and gender help tailor the summary.</p>

        <div className="field">
          <label htmlFor="patientName">Patient name (optional)</label>
          <input
            id="patientName"
            type="text"
            className="field-input"
            value={patient.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Adaeze Okonkwo"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="patientAge">Age</label>
            <input
              id="patientAge"
              type="number"
              min="0"
              className="field-input field-input-mono"
              value={patient.age}
              onChange={(e) => update('age', e.target.value)}
              placeholder="Years"
            />
          </div>

          <div className="field">
            <label htmlFor="patientGender">Gender</label>
            <select
              id="patientGender"
              className="field-input"
              value={patient.gender}
              onChange={(e) => update('gender', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="field-error">
            <Icon name="alert" size={16} /> {error}
          </p>
        )}

        <div className="card-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/')}>
            <Icon name="chevronLeft" size={18} /> Back
          </button>
          <button className="btn btn-primary" onClick={next}>
            Continue <Icon name="chevronRight" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
