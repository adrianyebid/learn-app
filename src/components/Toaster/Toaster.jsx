/**
 * Toaster - stacked notifications (markup skeleton). The PDF suggests
 * react-toastify; this prop-driven version shows the visual states and can
 * be swapped for the library later.
 * toasts: [{ id, type: 'success'|'error'|'info', message }]
 */
const STYLES = {
  success: 'bg-green-50 text-green-700 ring-green-200',
  error: 'bg-red-50 text-red-700 ring-red-200',
  info: 'bg-brand-light text-brand ring-brand/20',
}

const ICONS = { success: '✓', error: '✕', info: 'ℹ' }

function Toaster({ toasts = [], onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-72 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm shadow-sm ring-1 ${STYLES[t.type] || STYLES.info}`}
        >
          <span className="font-bold">{ICONS[t.type] || ICONS.info}</span>
          <span className="grow">{t.message}</span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => onDismiss?.(t.id)}
            className="opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toaster
