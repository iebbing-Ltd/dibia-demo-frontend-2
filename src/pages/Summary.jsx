import { useNavigate } from 'react-router-dom'
import { useConsultation } from '../context/ConsultationContext'
import Icon from '../components/Icon'

export default function Summary() {
  const navigate = useNavigate()
  const { result, patient, symptom, reset } = useConsultation()

  if (!result) {
    navigate('/')
    return null
  }

  const structured = result.structuredSummary

  function finish() {
    reset()
    navigate('/')
  }

  return (
    <div className="paper-wrap paper-wrap-single">
      <section className="paper-panel">
        <div className="paper-header">
          <span className="paper-hospital-name">Consultation summary</span>
          <div className="paper-header-fields">
            <div>NAME: <span>{patient.name || result.patientName || 'Anonymous'}</span></div>
            <div>AGE/SEX: <span>{result.patientAge} / {result.patientGender}</span></div>
            <div>DATE: <span>{new Date(result.createdAt || Date.now()).toLocaleDateString('en-GB')}</span></div>
          </div>
        </div>

        <div className="paper-section-title paper-section-title-first">A. Presenting complaint</div>
        <div className="paper-ruled-line">
          <span className="paper-ruled-label">Chief complaint</span>
          <div className="paper-ruled-value">{structured?.chiefComplaint || symptom?.name || result.symptom?.name || result.customComplaint}</div>
        </div>

        {result.redFlag && (
          <div className="paper-flag-banner">
            <Icon name="flag" size={14} /> Red flag screen positive — flag for urgent review
          </div>
        )}

        {structured && (
          <>
            {structured.hpi?.length > 0 && (
              <>
                <div className="paper-section-title">B. History of presenting complaint</div>
                {structured.hpi.map((l, i) => (
                  <p className="paper-live-item" key={i}>{l}</p>
                ))}
              </>
            )}

            {structured.pertinentPositives?.length > 0 && (
              <>
                <span className="paper-live-tag">Pertinent positives</span>
                {structured.pertinentPositives.map((l, i) => (
                  <p className="paper-live-item" key={i}>{l}</p>
                ))}
              </>
            )}

            {structured.pertinentNegatives?.length > 0 && (
              <>
                <span className="paper-live-tag">Pertinent negatives</span>
                {structured.pertinentNegatives.map((l, i) => (
                  <p className="paper-live-item" key={i}>{l}</p>
                ))}
              </>
            )}

            {structured.redFlags?.length > 0 && (
              <>
                <span className="paper-live-tag paper-live-tag-flag">Red flags</span>
                {structured.redFlags.map((l, i) => (
                  <p className="paper-live-item paper-live-item-flag" key={i}>{l}</p>
                ))}
              </>
            )}
          </>
        )}

        <div className="paper-section-title paper-summary-title">C. Doctor's summary / impression</div>
        <p className="paper-summary-text">{result.summary}</p>

        <div className="paper-btn-row">
          <button className="paper-btn paper-btn-primary" onClick={finish}>
            Finish consultation <Icon name="check" size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}
