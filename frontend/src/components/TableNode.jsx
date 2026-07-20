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
    <div className="rounded-lg shadow-md border border-neutral-300 bg-neutral-100 min-w-[200px]">
      {/* Header */}
      <div className="bg-[#4a90e2] px-4 py-2 rounded-t-lg text-white text-[14px] font-bold text-center tracking-wide">
        {data.label}
      </div>

      {/* Columns */}
      <div className="bg-neutral-100 rounded-b-lg">
        {columns.map((col, i) => (
          <div
            key={i}
            className="relative flex items-center justify-between px-3 py-[7px] border-t border-neutral-200"
          >
            {/* Left: connection handles + column name */}
            <div className="flex items-center gap-2 relative">
              <div className="relative w-[7px] h-[7px] shrink-0 flex items-center justify-center">
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`target-${col.name}`}
                  className="!w-[7px] !h-[7px] !bg-[#4a90e2] !border-0 !rounded-full !absolute !transform-none !left-0 !top-0 !m-0"
                />
                <Handle
                  type="source"
                  position={Position.Left}
                  id={`source-${col.name}`}
                  className="!w-[15px] !h-[15px] !bg-transparent !border-0 !rounded-full !absolute !transform-none !left-[-4px] !top-[-4px] !m-0 z-10 cursor-pointer"
                />
              </div>
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
    </div>
  );
}
