import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { ColumnProps } from 'react-virtualized';

// Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Data
import theme from '../../../lib/_theme';

// Components
import { VirtualizedTable } from '../_ui/virtualized-table.component';
import { IColumnMap } from './ImportColumnMatcher/import-matcher.interface';
import { Spacer } from '../_ui/structure.components';

interface IImporterResults {
  rows: string[][];
  updateRowValue?: Function;
  columnMap: IColumnMap[];
  headerRowIndex: number;
  canEdit?: boolean;
  onUpdateRows: Function;
  completeReview: Function;
}

interface IRowGetter {
  index: number;
}

const ImportPlayerResults: React.FC<IImporterResults> = ({
  rows,
  // updateRowValue,
  columnMap,
  headerRowIndex,
  canEdit,
  onUpdateRows,
  completeReview
}) => {
  const [columns, setColumns] = useState<ColumnProps[]>([]);
  const [invalidColumns, setInvalidColumns] = useState<boolean[]>([]);
  const [rowHashes, setRowHashes] = useState<any[]>([]);
  const [countInvalid, setCountInvalid] = useState(0);
  const [invalidRowMap, setInvalidRowMap] = useState<any>({});

  useEffect(() => {
    const nextInvalidColumns: boolean[] = [];
    const nextInvalidRowMap: { [key: number]: boolean } = {};
    const nextColumns: ColumnProps[] = [];
    let nextCountInvalid = 0;

    columnMap.forEach((map, index) => {
      if (map.column && !map.isIgnored) {
        nextColumns.push({
          width: 200,
          label: map.column.label,
          dataKey: `cell_${index}`
        });
      }
    });

    const rowHashes: any[] = [];
    rows.forEach((row, rowIndex) => {
      const rowHash: any = {};

      if (rowIndex !== headerRowIndex) {
        row.forEach((cell, index) => {
          if (columnMap[index] && columnMap[index].column) {
            const validators = columnMap[index].column?.validators;
            let isValid = true;

            for (let i = 0; isValid && validators && i < validators.length; i++) {
              isValid = validators[i](cell, columnMap[index].column?.format);
            }

            rowHash[`cell_${index}`] = { cell, isValid };

            if (!isValid) {
              nextCountInvalid += 1;
              nextInvalidRowMap[rowIndex] = true;
              nextInvalidColumns[index] = true;
            }
          }
        });

        rowHashes.push(rowHash);
      }
    });

    setInvalidColumns(nextInvalidColumns);
    setCountInvalid(nextCountInvalid);
    setRowHashes(rowHashes);
    setColumns(nextColumns);
    setInvalidRowMap(nextInvalidRowMap);
    // eslint-disable-next-line react-hooks/rules-of-hooks
  }, [columnMap, rows]);

  const onCellEdit = useCallback(_.debounce((columnIndex: number, rowIndex: number, value: string) => {
    const editRowIndex = _.isNumber(headerRowIndex) ? rowIndex + 1 : rowIndex;

    if (canEdit) {
      const nextRows = [...rows];
      nextRows[editRowIndex] = [...nextRows[editRowIndex]]
      nextRows[editRowIndex][columnIndex] = value;

      onUpdateRows(nextRows);
    }
  }, 1000), [rows]);

  const buttons = (
    <Box display="flex" m={2} alignItems="center">
      {countInvalid > 0 && (
        <Box>
          <Typography gutterBottom>{countInvalid} invalid cells. Rows with invalid cells will not be imported.</Typography>
          <Typography>Click on a cell to edit it and fix the error.</Typography>
        </Box>
      )}
      <Spacer />
      <Button color="primary" onClick={() => completeReview(invalidRowMap)}>Confirm &amp; Import</Button>
    </Box>
  );

  return (
    <Box>
      {buttons}

      <Box width="100%" height="400px" style={{ background: theme.palette.common.white }}>
        <VirtualizedTable
          rowCount={rowHashes.length}
          rowGetter={({ index }: IRowGetter) => rowHashes[index]}
          columns={columns}
          onCellEdit={onCellEdit}
        />
      </Box>
      {buttons}
    </Box>
  );
};

export default ImportPlayerResults;
