import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
} from '@xyflow/react';

import Navbar from './components/Navbar';
import RightSidebar from './components/RightSidebar';
import TableNode from './components/TableNode';
import '@xyflow/react/dist/style.css';

const nodeTypes = { tableNode: TableNode };

const initialNodes = [];
const initialEdges = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [tables, setTables] = useState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddTable = (tableName) => {
    const id = `table-${Date.now()}`;
    const defaultColumns = [];
    const newTable = { id, name: tableName, columns: defaultColumns };

    setTables((prev) => [...prev, newTable]);
    setNodes((prev) => [
      ...prev,
      {
        id,
        type: 'tableNode',
        position: {
          x: 200 + Math.random() * 200,
          y: 150 + Math.random() * 150,
        },
        data: { label: tableName, columns: defaultColumns },
      },
    ]);
  };

  const handleUpdateTable = (updatedTable) => {
    setTables((prev) =>
      prev.map((t) => (t.id === updatedTable.id ? updatedTable : t))
    );
    setNodes((prev) =>
      prev.map((n) =>
        n.id === updatedTable.id
          ? {
              ...n,
              data: {
                ...n.data,
                label: updatedTable.name,
                columns: updatedTable.columns,
              },
            }
          : n
      )
    );
  };

  const handleDeleteTable = (tableId) => {
    setTables((prev) => prev.filter((t) => t.id !== tableId));
    setNodes((prev) => prev.filter((n) => n.id !== tableId));
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-neutral-0">
      <Navbar />

      <main className="flex flex-row flex-grow w-full h-[calc(100vh-56px)] relative overflow-hidden">
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={true}
            fitView
          >
            <Background variant="dots" gap={16} size={1.2} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        <RightSidebar
          tables={tables}
          onAddTable={handleAddTable}
          onUpdateTable={handleUpdateTable}
          onDeleteTable={handleDeleteTable}
        />
      </main>
    </div>
  );
}
