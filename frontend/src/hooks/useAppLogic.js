import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { submitSolution } from '../api';
import { serializeDiagram } from '../diagramSerializer';

const initialNodes = [];
const initialEdges = [];

export default function useAppLogic() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [tables, setTables] = useState([]);

  const [questionId, setQuestionId] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const onConnect = useCallback(
    (params) => {
      const sourceTable = tables.find((t) => t.id === params.source);
      const targetTable = tables.find((t) => t.id === params.target);
      const edgeName = sourceTable && targetTable 
        ? `${sourceTable.name.toLowerCase()}_${targetTable.name.toLowerCase()}_rel` 
        : `rel_${Date.now()}`;
        
      setEdges((eds) => addEdge({
        ...params,
        data: {
          name: edgeName,
          cardinality: 'One to One',
          compositeKeys: [],
        }
      }, eds));
    },
    [setEdges, tables],
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

  const handleQuestionLoaded = (id) => {
    setQuestionId(id);
  };

  const handleSubmit = async () => {
    if (tables.length === 0) {
      setSubmitError('Add at least one table before submitting.');
      return;
    }
    if (!questionId) {
      setSubmitError('No question loaded — cannot submit.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setValidationResult(null);

    try {
      const diagram = serializeDiagram(tables, edges);
      const result = await submitSolution(questionId, diagram);
      setValidationResult(result);
    } catch (err) {
      setSubmitError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTables([]);
    setNodes([]);
    setEdges([]);
    setValidationResult(null);
    setSubmitError(null);
  };

  if (typeof window !== 'undefined' && window.Cypress) {
    window.__testTables = tables;
    window.__testConnect = (params) => {
      onConnect(params);
    };
  }

  return {
    nodes, edges, tables,
    submitting, submitError, validationResult,
    onNodesChange, onEdgesChange, onConnect,
    setEdges, setValidationResult,
    handleAddTable, handleUpdateTable, handleDeleteTable,
    handleQuestionLoaded, handleSubmit, handleReset
  };
}
