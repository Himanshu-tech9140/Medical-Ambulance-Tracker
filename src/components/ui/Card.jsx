export default function Card({
  title,
  description,
  action,
  className = "",
  children,
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6 ${className}`}
    >
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="font-display text-base font-bold text-ink">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
