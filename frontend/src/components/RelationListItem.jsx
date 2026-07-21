import { useState } from 'react';

const CARDINALITIES = [
  'One to One',
  'One to Many',
  'Many to One',
  'Many to Many'
];

export default function RelationListItem({ edge, tables, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const data = edge.data || { name: '', cardinality: 'One to One', compositeKeys: [] };
  const compositeKeys = data.compositeKeys || [];

  const sourceTable = tables.find(t => t.id === edge.source);
  const targetTable = tables.find(t => t.id === edge.target);

  const sourceName = sourceTable ? sourceTable.name : edge.source;
  const targetName = targetTable ? targetTable.name : edge.target;
  
  const sourceColumns = sourceTable ? sourceTable.columns : [];
  const targetColumns = targetTable ? targetTable.columns : [];

  const updateData = (updates) => {
    onUpdate(edge.id, { ...data, ...updates });
  };

  const addCompositeKey = () => {
    updateData({
      compositeKeys: [...compositeKeys, { foreign: '', primary: '' }]
    });
  };

  const updateCompositeKey = (idx, field, value) => {
    const newKeys = [...compositeKeys];
    newKeys[idx][field] = value;
    updateData({ compositeKeys: newKeys });
  };

  const deleteCompositeKey = (idx) => {
    const newKeys = compositeKeys.filter((_, i) => i !== idx);
    updateData({ compositeKeys: newKeys });
  };

  return (
    <div className="border-b border-neutral-200">
      {/* Collapsed header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none hover:bg-neutral-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Six-dot grip */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-neutral-400">
          <circle cx="3.5" cy="2.5" r="1.2" fill="currentColor"/>
          <circle cx="8.5" cy="2.5" r="1.2" fill="currentColor"/>
          <circle cx="3.5" cy="6" r="1.2" fill="currentColor"/>
          <circle cx="8.5" cy="6" r="1.2" fill="currentColor"/>
          <circle cx="3.5" cy="9.5" r="1.2" fill="currentColor"/>
          <circle cx="8.5" cy="9.5" r="1.2" fill="currentColor"/>
        </svg>

        <span className="flex-1 text-[13px] font-semibold text-neutral-900 truncate">
          {data.name || 'Untitled Relation'}
        </span>

        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`shrink-0 text-neutral-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-4 pt-1 flex flex-col gap-3 bg-neutral-100/50 border-t border-neutral-100">
          
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-neutral-700 w-12 shrink-0">Name :</span>
            <input
              className="flex-1 h-7 px-2 rounded-md border border-neutral-300 bg-neutral-0 text-[12px] font-medium text-neutral-900 outline-none focus:border-brand-500 transition-all"
              value={data.name || ''}
              onChange={(e) => updateData({ name: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-neutral-700 w-12 shrink-0">FROM:</span>
            <input
              className="flex-1 h-7 px-2 rounded-md border border-neutral-300 bg-neutral-0 text-[12px] font-medium text-neutral-900 outline-none focus:border-brand-500 transition-all"
              value={data.sourceName !== undefined ? data.sourceName : sourceName}
              onChange={(e) => updateData({ sourceName: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-neutral-700 w-12 shrink-0">TO :</span>
            <input
              className="flex-1 h-7 px-2 rounded-md border border-neutral-300 bg-neutral-0 text-[12px] font-medium text-neutral-900 outline-none focus:border-brand-500 transition-all"
              value={data.targetName !== undefined ? data.targetName : targetName}
              onChange={(e) => updateData({ targetName: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-neutral-700">Cardinality :</span>
            <select
              className="w-full h-8 px-2 rounded-md border border-neutral-300 bg-neutral-0 text-[12px] font-medium text-neutral-900 outline-none cursor-pointer focus:border-brand-500 transition-all"
              value={data.cardinality}
              onChange={(e) => updateData({ cardinality: e.target.value })}
            >
              {CARDINALITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Composite Key Section */}
          <div className="mt-1 rounded-md border border-neutral-300 bg-neutral-100 overflow-hidden">
            <div className="px-3 py-1.5 bg-neutral-200 border-b border-neutral-300 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-neutral-800">Composite key</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            
            <div className="p-3 flex flex-col gap-2">
              <div className="text-[10px] text-neutral-400 text-center font-medium mb-1">
                Add fields to make primary key
              </div>
              
              <div className="flex items-center gap-2">
                <span className="flex-1 text-[10px] font-semibold text-neutral-600 text-center">Foreign</span>
                <span className="flex-1 text-[10px] font-semibold text-neutral-600 text-center">Primary</span>
                <div className="w-4 shrink-0"></div>
              </div>

              {compositeKeys.map((key, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className="flex-1 h-6 px-1 rounded border border-neutral-300 bg-neutral-200/50 text-[11px] font-medium text-neutral-800 outline-none focus:border-brand-500"
                    value={key.foreign}
                    onChange={(e) => updateCompositeKey(i, 'foreign', e.target.value)}
                  >
                    <option value="">name</option>
                    {sourceColumns.map(col => (
                      <option key={col.name} value={col.name}>{col.name}</option>
                    ))}
                  </select>
                  
                  <select
                    className="flex-1 h-6 px-1 rounded border border-neutral-300 bg-neutral-200/50 text-[11px] font-medium text-neutral-800 outline-none focus:border-brand-500"
                    value={key.primary}
                    onChange={(e) => updateCompositeKey(i, 'primary', e.target.value)}
                  >
                    <option value="">name</option>
                    {targetColumns.map(col => (
                      <option key={col.name} value={col.name}>{col.name}</option>
                    ))}
                  </select>

                  <button
                    title="Remove field"
                    className="w-4 h-4 flex items-center justify-center shrink-0 text-red-400 hover:text-red-600 transition-colors"
                    onClick={() => deleteCompositeKey(i)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                className="mt-2 h-7 px-3 rounded border border-neutral-300 bg-neutral-0 text-[11px] font-semibold text-neutral-700 flex items-center justify-center gap-1.5 hover:bg-neutral-50 transition-colors mx-auto"
                onClick={addCompositeKey}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Add field
              </button>
            </div>
          </div>

          {/* Delete Relationship Button */}
          {onDelete && (
            <div className="flex justify-end pt-1">
              <button
                title="Delete relationship"
                className="h-6 w-6 flex items-center justify-center rounded bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                onClick={onDelete}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
