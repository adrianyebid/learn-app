/**
 * DatePicker - prop-driven date field (markup skeleton). The PDF suggests a
 * 3rd-party library (MUI X / react-datepicker); this uses the native date
 * input so the skeleton stays dependency-free and can be swapped later.
 */
function DatePicker({ label = 'Date', value, onChange, error }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
          error ? 'border-red-500' : 'border-line focus:border-brand'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

export default DatePicker
