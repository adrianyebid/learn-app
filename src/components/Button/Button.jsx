/**
 * Reusable Button component.
 * Pure w.r.t. props: icon + text are arbitrary inputs.
 * Supports variants and the states standard / hover / pressed / disabled.
 */
const VARIANTS = {
  // "Button prime" in the Visily style guide
  primary:
    'bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed disabled:bg-brand/40',
  // "Button secondary"
  secondary:
    'bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-pressed disabled:bg-secondary/40',
  // "Button important"
  danger:
    'bg-danger text-white hover:bg-danger-hover active:bg-danger-pressed disabled:bg-danger/40',
  outline:
    'bg-transparent text-brand border border-brand hover:bg-brand-light active:bg-brand/10 disabled:opacity-40',
  ghost:
    'bg-transparent text-ink hover:bg-black/5 active:bg-black/10 disabled:opacity-40',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

function Button({
  children,
  icon = null,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
        'disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
      ].join(' ')}
      {...rest}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  )
}

export default Button
