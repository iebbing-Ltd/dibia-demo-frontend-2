import Icon from './Icon'

export default function QuestionField({ question, value, onChange }) {
  const { questionType, options } = question

  if (questionType === 'single-select') {
    return (
      <div className="option-grid" role="radiogroup">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={value === opt}
            className={value === opt ? 'option-pill is-selected' : 'option-pill'}
            onClick={() => onChange(opt)}
          >
            {value === opt && <Icon name="check" size={16} />}
            {opt}
          </button>
        ))}
      </div>
    )
  }

  if (questionType === 'multi-select') {
    const selected = Array.isArray(value) ? value : []
    function toggle(opt) {
      onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt])
    }
    return (
      <div className="option-grid" role="group">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            aria-pressed={selected.includes(opt)}
            className={selected.includes(opt) ? 'option-pill is-selected' : 'option-pill'}
            onClick={() => toggle(opt)}
          >
            {selected.includes(opt) && <Icon name="check" size={16} />}
            {opt}
          </button>
        ))}
      </div>
    )
  }

  if (questionType === 'number-input') {
    return (
      <input
        type="number"
        inputMode="decimal"
        className="field-input field-input-mono"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a value"
      />
    )
  }

  if (questionType === 'date' || questionType === 'duration') {
    return (
      <input
        type="text"
        className="field-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 3 days"
      />
    )
  }

  return (
    <textarea
      className="field-textarea"
      rows={3}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type the patient's response"
    />
  )
}
