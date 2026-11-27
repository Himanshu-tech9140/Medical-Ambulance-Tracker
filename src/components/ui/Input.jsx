import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    leadingIcon: LeadingIcon,
    className = "",
    id,
    ...props
  },
  ref,
) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          className="mb-2 block text-sm font-semibold text-slate-700"
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {LeadingIcon && (
          <LeadingIcon
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
        )}
        <input
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={Boolean(error)}
          className={`min-h-11 w-full rounded-xl border bg-white px-4 text-sm text-ink placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 ${LeadingIcon ? "pl-11" : ""} ${error ? "border-red-300" : "border-slate-200"} ${className}`}
          id={inputId}
          ref={ref}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
});

export default Input;
