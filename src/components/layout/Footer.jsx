export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 border-t border-slate-100 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p>© {new Date().getFullYear()} JeevanSetu. Care, connected.</p>
      <div className="flex gap-4">
        <a className="transition hover:text-brand-700" href="mailto:support@jeevansetu.example">
          Help center
        </a>
        <a className="transition hover:text-brand-700" href="#privacy">
          Privacy
        </a>
        <a className="transition hover:text-brand-700" href="#status">
          System status
        </a>
      </div>
    </footer>
  );
}
