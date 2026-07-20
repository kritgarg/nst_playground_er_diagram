const CARDINALITY_MAP = {
  'One to One': 'one_to_one',
  'One to Many': 'one_to_many',
  'Many to One': 'many_to_one',
  'Many to Many': 'many_to_many',
};

export function serializeDiagram(tables, edges) {
  const tableIdMap = {};  
  const fieldIdMap = {}; 
  let nextTableId = 1;
  let nextFieldId = 1;

  const backendTables = tables.map((table) => {
    const tableIntId = nextTableId++;
    tableIdMap[table.id] = tableIntId;

    const fields = (table.columns || []).map((col) => {
      const fieldIntId = nextFieldId++;
      fieldIdMap[`${table.id}:${col.name}`] = fieldIntId;

      return {
        id: fieldIntId,
        name: col.name || '',
        type: (col.type || 'VARCHAR').toUpperCase(),
        primaryKey: !!col.isPrimary,
        notNull: !!col.isNotNull || !!col.isPrimary,
        unique: !!col.isUnique,
        increment: !!col.isAutoIncrement,
        def: '',
      };
    });

    return { id: tableIntId, name: table.name || '', fields };
  });

  const relationships = [];
  let nextRelId = 1;

  for (const edge of edges) {
    const data = edge.data || {};
    const compositeKeys = data.compositeKeys || [];
    const cardinality = CARDINALITY_MAP[data.cardinality] || 'many_to_one';
    const sourceTableId = tableIdMap[edge.source];
    const targetTableId = tableIdMap[edge.target];

    if (!sourceTableId || !targetTableId) continue;

    for (const ck of compositeKeys) {
      if (!ck.foreign || !ck.primary) continue;

      const startFieldId = fieldIdMap[`${edge.source}:${ck.foreign}`];
      const endFieldId = fieldIdMap[`${edge.target}:${ck.primary}`];

      if (!startFieldId || !endFieldId) continue;

      relationships.push({
        id: nextRelId++,
        cardinality,
        startTable: sourceTableId,
        startField: startFieldId,
        endTable: targetTableId,
        endField: endFieldId,
      });
    }
  }

  return { tables: backendTables, relationships };
}
