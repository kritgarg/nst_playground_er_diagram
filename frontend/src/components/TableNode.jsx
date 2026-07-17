import { Handle, Position } from '@xyflow/react';

const TYPE_COLORS = {
  INTEGER: '#b8860b',
  VARCHAR: '#2e7d32',
  TEXT: '#1565c0',
  BOOLEAN: '#6a1b9a',
  FLOAT: '#c62828',
  DATE: '#00695c',
  TIMESTAMP: '#00695c',
};

const DEFAULT_COLUMNS = [
  { name: 'id', type: 'INTEGER', isPrimary: true },
  { name: 'name', type: 'VARCHAR', isPrimary: false },
];

export default function TableNode({ data }) {
  const columns = data.columns ?? DEFAULT_COLUMNS;

  return (
    <div className="rounded-lg overflow-hidden shadow-md border border-neutral-300 bg-neutral-100 min-w-[200px]">
      {/* Left connection handle */}
      <Handle
        type="source"
        position={Position.Left}
        className="!w-2 !h-2 !bg-neutral-400 !border-neutral-500"
      />

      {/* Header */}
      <div className="bg-[#4a90e2] px-4 py-2 text-white text-[14px] font-bold text-center tracking-wide">
        {data.label}
      </div>

      {/* Columns */}
      <div className="bg-neutral-100">
        {columns.map((col, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-3 py-[7px] border-t border-neutral-200"
          >
            {/* Left: dot + column name */}
            <div className="flex items-center gap-2">
              <span className="w-[7px] h-[7px] rounded-full bg-[#4a90e2] shrink-0" />
              <span className="text-[13px] font-medium text-neutral-800">{col.name}</span>
            </div>

            {/* Right: type + key icon */}
            <div className="flex items-center gap-1.5">
              <span
                className="text-[12px] font-semibold"
                style={{ color: TYPE_COLORS[col.type] ?? '#555' }}
              >
                {col.type}
              </span>
              {col.isPrimary && (
                <span className="text-[14px]" title="Primary Key">🔑</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right connection handle */}
      <Handle
        type="target"
        position={Position.Right}
        className="!w-2 !h-2 !bg-neutral-400 !border-neutral-500"
      />
    </div>
  );
}
