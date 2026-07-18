import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisclaimer } from '../api/client'
import { useConsultation } from '../context/ConsultationContext'
import Icon from '../components/Icon'

export default function Home() {
  const navigate = useNavigate()
  const { reset } = useConsultation()
  const [disclaimer, setDisclaimer] = useState('')

  useEffect(() => {
    getDisclaimer()
      .then((data) => setDisclaimer(data.warning))
      .catch(() => setDisclaimer(''))
  }, [])

  function start() {
    reset()
    navigate('/patient')
  }

  return (
    <div className="page page-home">
      <div className="home-hero">
        <span className="eyebrow">
          <Icon name="pulse" size={16} /> Guided clerking
        </span>
        <h1 className="display-xl">
          Clerk the patient.
          <br />
          Let the summary write itself.
        </h1>
        <p className="lede">
          Answer a short, structured set of questions built around the patient's presenting
          symptom. Clerk turns the conversation into a clean clinical summary in seconds.
        </p>
        <button className="btn btn-primary btn-lg" onClick={start}>
          Start consultation
          <Icon name="chevronRight" size={18} />
        </button>
      </div>

      <div className="home-panel">
        <div className="home-panel-row">
          <Icon name="clipboard" size={20} />
          <div>
            <p className="home-panel-title">Structured history</p>
            <p className="home-panel-copy">Every symptom has its own question set, pulled live from the backend.</p>
          </div>
        </div>
        <div className="home-panel-row">
          <Icon name="brain" size={20} />
          <div>
            <p className="home-panel-title">Instant summary</p>
            <p className="home-panel-copy">Responses are compiled into a doctor-ready paragraph on demand.</p>
          </div>
        </div>
        {disclaimer && (
          <div className="disclaimer">
            <Icon name="alert" size={18} />
            <span>{disclaimer}</span>
          </div>
        )}
      </div>
    </div>
  )
}
