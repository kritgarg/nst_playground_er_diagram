export default function ValidationResult({ result, onClose }) {
  if (!result) return null;

  const { is_valid, mismatches = [], names = {}, status = {} } = result;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neutral-0 rounded-2xl shadow-2xl border border-neutral-300 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className={`px-6 py-4 flex items-center justify-between border-b border-neutral-200 ${
          is_valid ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center gap-3">
            {is_valid ? (
              <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            )}
            <div>
              <h3 className="text-[16px] font-bold text-neutral-900 m-0">
                {is_valid ? 'Solution Accepted!' : 'Incorrect Solution'}
              </h3>
              <p className="text-[12px] text-neutral-600 m-0 mt-0.5">
                Engine: {result.algorithm_used || '—'} • {status.engine_ms != null ? `${status.engine_ms}ms` : 'skipped'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Tables" expected={status.expected_nodes} student={status.student_nodes} />
            <StatCard label="Relationships" expected={status.expected_edges} student={status.student_edges} />
          </div>

          {names.score != null && (
            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-bold text-neutral-800">Name Matching</span>
                <span className={`text-[14px] font-bold ${names.score >= 80 ? 'text-green-600' : names.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {names.score}/100
                </span>
              </div>

              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    names.score >= 80 ? 'bg-green-500' : names.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${names.score}%` }}
                />
              </div>

              {names.matched?.length > 0 && (
                <div className="mb-2">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Matched</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {names.matched.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-green-50 border border-green-200 text-[11px] text-green-800 font-medium" title={m.details}>
                        {m.expected} ↔ {m.current}
                        <span className="ml-1 text-green-500 text-[10px]">({m.type})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {names.missing?.length > 0 && (
                <div className="mb-2">
                  <span className="text-[11px] font-semibold text-red-500 uppercase tracking-wide">Missing</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {names.missing.map((name, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-red-50 border border-red-200 text-[11px] text-red-700 font-medium">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {names.extra?.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-yellow-600 uppercase tracking-wide">Extra</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {names.extra.map((name, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-yellow-50 border border-yellow-200 text-[11px] text-yellow-800 font-medium">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {mismatches.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
              <span className="text-[13px] font-bold text-red-800 mb-2 block">
                Issues ({mismatches.length})
              </span>
              <div className="flex flex-col gap-2">
                {mismatches.map((m, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-red-700">
                    <span className="mt-0.5 w-4 h-4 rounded bg-red-200 text-red-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-red-800">[{m.code}]</span>{' '}
                      <span>{m.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {is_valid && mismatches.length === 0 && (
            <div className="text-center py-4">
              <p className="text-[14px] text-green-700 font-semibold">
                Your diagram structure and relationships match the expected solution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, expected, student }) {
  const match = expected != null && student != null && expected === student;
  return (
    <div className={`rounded-lg border p-3 ${match ? 'border-green-200 bg-green-50/50' : 'border-neutral-200 bg-neutral-50'}`}>
      <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">{label}</span>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-[18px] font-bold text-neutral-900">{student ?? '—'}</span>
        <span className="text-[12px] text-neutral-500">/ {expected ?? '—'} expected</span>
      </div>
    </div>
  );
}
