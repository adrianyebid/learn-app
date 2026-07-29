/**
 * Box - a content wrapper that brings styles to internal content.
 * All content is dynamic through props (tag, title, date, timeToRead).
 * Can be used standalone or as a building block of other components.
 */
function Box({
  tag,
  title,
  date,
  timeToRead,
  image,
  children,
  className = '',
}) {
  return (
    <article
      className={`overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-line ${className}`}
    >
      {image && (
        <img src={image} alt="" className="h-44 w-full object-cover" />
      )}
      <div className="p-5">
        {tag && (
          <span className="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            {tag}
          </span>
        )}
        {title && (
          <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
        )}
        {children && <div className="mt-2 text-sm text-muted">{children}</div>}
        {(date || timeToRead) && (
          <div className="mt-4 flex items-center gap-3 text-xs text-muted">
            {date && <span>{date}</span>}
            {date && timeToRead && <span aria-hidden>•</span>}
            {timeToRead && <span>{timeToRead}</span>}
          </div>
        )}
      </div>
    </article>
  )
}

export default Box
