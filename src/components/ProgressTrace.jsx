const STEPS = ['Patient', 'Symptom', 'Questions', 'Summary']

const WAVE =
  'M0 30 L60 30 L75 30 L85 8 L100 52 L110 30 L130 30 L145 30 L155 14 L165 46 L175 30 L200 30' +
  ' L260 30 L275 30 L285 8 L300 52 L310 30 L330 30 L345 30 L355 14 L365 46 L375 30 L400 30' +
  ' L460 30 L475 30 L485 8 L500 52 L510 30 L530 30 L545 30 L555 14 L565 46 L575 30 L600 30' +
  ' L660 30 L675 30 L685 8 L700 52 L710 30 L730 30 L745 30 L755 14 L765 46 L775 30 L800 30'

export default function ProgressTrace({ step, liveLabel }) {
  const fillPercent = (step / (STEPS.length - 1)) * 100

  return (
    <div className="trace">
      <svg className="trace-svg" viewBox="0 0 800 60" preserveAspectRatio="none" aria-hidden="true">
        <path d={WAVE} className="trace-line trace-line-track" />
        <path
          d={WAVE}
          className="trace-line trace-line-fill"
          style={{ strokeDasharray: 1400, strokeDashoffset: 1400 - (1400 * fillPercent) / 100 }}
        />
      </svg>
      <ol className="trace-steps">
        {STEPS.map((label, i) => (
          <li key={label} className={i <= step ? 'trace-step is-active' : 'trace-step'}>
            <span className="trace-dot" />
            <span className="trace-label">{label}</span>
          </li>
        ))}
      </ol>
      {liveLabel && <p className="trace-live">{liveLabel}</p>}
    </div>
  )
}
