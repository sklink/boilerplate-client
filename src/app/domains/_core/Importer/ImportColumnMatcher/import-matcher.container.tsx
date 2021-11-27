import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';

// Data
import { IColumnMap, IImportMatcherContainer, ISampleRow } from './import-matcher.interface';

// Components
import ImportColumnMatcher from './import-matcher.component';
import { IImportColumn } from '../importer.interface';

const SAMPLE_SIZE = 3;

const ImportMatcherContainer: React.FC<IImportMatcherContainer> = ({
  requiredColumns,
  expectedColumns,
  rows,
  headerRowIndex,
  columnMap,
  setColumnMap,
  completeMatching
}) => {
  const [unmetRequirements, setUnmetRequirements] = useState<IImportColumn[]>([]);
  const [unmetFields, setUnmetFields] = useState<IImportColumn[]>([]);
  const [maxColumns, setMaxColumns] = useState(0);
  const [sample, setSample] = useState<ISampleRow[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Pre-map columns by taking a best guess
    const fuse = new Fuse(expectedColumns, {  ignoreLocation: true, includeScore: true, threshold: 0.3, keys: ['label', 'matchAliases'] });
    const initialColumnMap: IColumnMap[] = [];

    if (rows.length && headerRowIndex !== null) {
      const headerRow = rows[headerRowIndex];

      headerRow.forEach((cell: string, index: number) => {
        const columnMatches = fuse.search(cell);

        if (columnMatches.length > 0) {
          initialColumnMap[index] = { column: columnMatches[0].item, isLocked: false, isIgnored: false };
        } else {
          initialColumnMap[index] = { isLocked: false, isIgnored: false };
        }
      });
    }

    // Pull a sample to show when selecting columns
    const currSample: ISampleRow[] = [];
    let currMaxColumns = 0;

    for (let i = 0; i < rows.length; i += 1) {
      if (i !== headerRowIndex) {
        const row = rows[i];

        if (currMaxColumns <= row.length) {
          currSample.push({rowNum: i + 1, rowData: row});
          currMaxColumns = row.length;
        }

        if (currSample.length > SAMPLE_SIZE) {
          currSample.pop();
        }
      }
    }

    if (initialColumnMap.length === 0) {
      for (let i = 0; i < currMaxColumns; i += 1) {
        initialColumnMap[i] = { isLocked: false, isIgnored: false };
      }
    }

    setColumnMap(initialColumnMap);
    setMaxColumns(currMaxColumns);
    setSample(currSample);
  }, [rows.length, headerRowIndex]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setUnmetRequirements(_.filter(requiredColumns, column => {
      return !_.find(columnMap, (mapItem: IColumnMap) => mapItem.column?.key === column.key && mapItem.isLocked);
    }));

    setUnmetFields(_.filter(expectedColumns, column => {
      return !_.find(columnMap, (mapItem: IColumnMap) => mapItem.column?.key === column.key && mapItem.isLocked);
    }));
  }, [columnMap]);

  const setColumnMapping = (columnIndex: number, mapping: IColumnMap) => {
    const nextMap = [...columnMap];
    nextMap[columnIndex] = mapping;

    setColumnMap(nextMap);
  };

  return <ImportColumnMatcher
    headerRowIndex={headerRowIndex}
    headerRow={headerRowIndex !== null && rows[headerRowIndex]}
    sample={sample}
    unmetRequirements={unmetRequirements}
    unmetFields={unmetFields}
    expectedColumns={expectedColumns}
    columnMap={columnMap}
    maxColumns={maxColumns}
    setColumnMapping={setColumnMapping}
    rows={rows}
    completeMatching={completeMatching}
  />;
};

export default ImportMatcherContainer;
