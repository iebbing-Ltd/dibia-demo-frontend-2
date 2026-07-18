import { Routes, Route } from 'react-router-dom'
import { ConsultationProvider } from './context/ConsultationContext'
import Home from './pages/Home'
import PatientInfo from './pages/PatientInfo'
import SymptomSelect from './pages/SymptomSelect'
import Questionnaire from './pages/Questionnaire'
import Summary from './pages/Summary'
import Icon from './components/Icon'

export default function App() {
  return (
    <ConsultationProvider>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-brand">
            <Icon name="pulse" size={22} />
            <span>Clerk</span>
          </div>
          <span className="app-tag">Proof of concept — not for diagnosis</span>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patient" element={<PatientInfo />} />
            <Route path="/symptom" element={<SymptomSelect />} />
            <Route path="/questions" element={<Questionnaire />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </main>
      </div>
    </ConsultationProvider>
  )
}
