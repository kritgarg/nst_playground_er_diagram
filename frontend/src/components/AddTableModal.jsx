import { useState, useEffect, useRef } from 'react';

export default function AddTableModal({ onConfirm, onCancel }) {
  const [tableName, setTableName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus the input when modal opens
    inputRef.current?.focus();
  }, []);

  const handleConfirm = () => {
    const trimmed = tableName.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    setTableName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="absolute top-16 left-4 right-4 z-50 bg-neutral-0 rounded-xl shadow-xl border border-neutral-300 p-4 flex flex-col gap-3">
        <p className="text-[13px] font-bold text-neutral-900">New Table Name</p>

        <input
          ref={inputRef}
          className="h-9 w-full px-3 rounded-lg border border-neutral-300 bg-neutral-100 font-sans text-[13px] text-neutral-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all placeholder-neutral-500"
          placeholder="Enter table name..."
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="flex gap-2 justify-end">
          <button
            className="h-8 px-3 rounded-lg border border-neutral-300 bg-neutral-100 text-[13px] font-semibold text-neutral-700 cursor-pointer hover:bg-neutral-200 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="h-8 px-4 rounded-lg bg-brand-500 text-[13px] font-bold text-white cursor-pointer hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={!tableName.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}
