export function TextField({ label, hint, error, ...props }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" {...props} />
      {error ? <span className="error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  )
}

export function TextArea({ label, hint, error, ...props }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea className="textarea" {...props} />
      {error ? <span className="error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  )
}

export function SelectField({ label, options = [], hint, error, ...props }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="select" {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error ? <span className="error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  )
}
