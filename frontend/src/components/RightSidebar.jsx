import { useState } from 'react';
import AddTableModal from './AddTableModal';
import TableListItem from './TableListItem';

export default function RightSidebar({ tables = [], onAddTable, onUpdateTable, onDeleteTable }) {
  const [activeTab, setActiveTab] = useState('tables');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  const handleConfirmAdd = (tableName) => {
    onAddTable(tableName);
    setShowAddModal(false);
  };

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 min-w-[320px] h-full bg-neutral-0 border-l border-neutral-300 flex flex-col box-border relative overflow-hidden">
  const [width, setWidth] = useState(320);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(260, Math.min(600, startWidth - deltaX));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  return (
    <aside
      className="h-full bg-neutral-0 border-l border-neutral-300 flex flex-col box-border relative"
      style={{ width: `${width}px`, minWidth: '260px', maxWidth: '600px' }}
    >
      {/* Resizer Handle */}
      <div
        className="absolute top-0 left-0 h-full cursor-col-resize z-50 group flex items-center justify-center -translate-x-1/2"
        style={{ width: '20px' }}
        onMouseDown={handleMouseDown}
      >
        {/* Wide gray strip */}
        <div className="w-full h-full bg-neutral-200 group-hover:bg-neutral-300 transition-colors duration-150 flex items-center justify-center">
          {/* Three dot grip inside the strip */}
          <div className="flex flex-col gap-[5px] items-center justify-center">
            <span className="w-[4px] h-[4px] rounded-full bg-neutral-500 group-hover:bg-neutral-700 transition-colors"></span>
            <span className="w-[4px] h-[4px] rounded-full bg-neutral-500 group-hover:bg-neutral-700 transition-colors"></span>
            <span className="w-[4px] h-[4px] rounded-full bg-neutral-500 group-hover:bg-neutral-700 transition-colors"></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex h-12 border-b border-neutral-300 box-border shrink-0">
        <button
          className={`flex-1 bg-transparent border-none font-sans text-[14px] font-bold cursor-pointer flex items-center justify-center relative transition-colors duration-200 ${
            activeTab === 'tables'
              ? 'text-brand-500 after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-brand-500'
              ? 'text-brand-500'
              : 'text-neutral-700 hover:text-neutral-900'
          }`}
          onClick={() => switchTab('tables')}
        >
          Tables
        </button>
        <button
          className={`flex-1 bg-transparent border-none font-sans text-[14px] font-bold cursor-pointer flex items-center justify-center relative transition-colors duration-200 ${
            activeTab === 'relations'
              ? 'text-brand-500 after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-brand-500'
              ? 'text-brand-500'
              : 'text-neutral-700 hover:text-neutral-900'
          }`}
          onClick={() => switchTab('relations')}
        >
          Relations
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex gap-3 p-4 box-border items-center shrink-0">
      <div className="flex gap-3 p-4 items-center">
      <div className="flex gap-3 p-4 box-border items-center">
        {activeTab === 'tables' && (
          <button
            className="h-9 flex items-center gap-1.5 px-3 bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-900 font-sans text-[13px] font-bold cursor-pointer transition-all duration-200 hover:bg-neutral-200 hover:border-neutral-400 focus-visible:outline-none focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-100 whitespace-nowrap"
            onClick={() => setShowAddModal(true)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Table</span>
          </button>
        )}

        <div className="flex-1 h-9 flex items-center gap-2 px-3 bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-700 box-border transition-all duration-200 focus-within:border-brand-500 focus-within:bg-neutral-0 focus-within:ring-2 focus-within:ring-brand-100">
          <svg className="shrink-0 text-neutral-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            className="w-full bg-transparent border-none outline-none font-sans text-[13px] font-semibold text-neutral-900 p-0 placeholder-neutral-500"
            type="text"
            placeholder={activeTab === 'tables' ? 'Search tables…' : 'Search relations…'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="shrink-0 text-neutral-400 hover:text-neutral-700 transition-colors"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Table List */}
      {activeTab === 'tables' && (
        <div className="flex-1 overflow-y-auto">
          {filteredTables.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-neutral-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="9" x2="9" y2="21" />
              </svg>
              <span className="text-[13px]">
                {tables.length === 0 ? 'No tables yet' : 'No results'}
              </span>
            </div>
          ) : (
            filteredTables.map((table) => (
              <TableListItem
                key={table.id}
                table={table}
                onUpdate={onUpdateTable}
                onDelete={() => onDeleteTable(table.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Add Table Modal */}
      {showAddModal && (
        <AddTableModal
          onConfirm={handleConfirmAdd}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </aside>
  );
}
