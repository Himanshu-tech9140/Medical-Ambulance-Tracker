export default function Spinner({ label = "Loading", className = "" }) {
  return (
    <span
      aria-label={label}
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
      role="status"
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
