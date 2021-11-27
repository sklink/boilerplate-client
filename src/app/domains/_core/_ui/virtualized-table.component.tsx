import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
  AutoSizer,
  Column,
  ColumnProps, RowMouseEventHandlerParams,
  Size,
  Table,
  TableCellRenderer,
  TableProps
} from 'react-virtualized';

import withStyles from '@mui/styles/withStyles';
import TableCell from '@mui/material/TableCell';
import { darken } from '@mui/material';

import theme from '../../../lib/_theme';

const styles: any = (theme: any) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableHover: {
    '&:hover': {
      backgroundColor: `${darken(theme.palette.common.white, 0.2)} !important`,
    },
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: 'initial',
  },
});

interface IHeaderRenderer {
  label: string;
  columnIndex: number;
}

interface IGetRowClassName {
  index: number;
}

interface IEditableTableCell {
  classes: any;
  columns: any[];
  rowHeight: any;
  onRowClick?: (info: RowMouseEventHandlerParams) => void;
  onCellEdit?: Function;
  cellData: any;
  columnIndex: number;
  rowIndex: number;
}

const EditableTableCell: React.FC<IEditableTableCell> = ({
  cellData,
  rowIndex,
  columnIndex,
  columns,
  classes,
  rowHeight,
  onRowClick,
  onCellEdit
}) => {
  const eleRef = useRef<HTMLTableCellElement>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (eleRef.current) {
      eleRef.current.innerText = cellData.cell;
    }
  }, []);

  return (
    <TableCell
      component="div"
      ref={eleRef}
      className={clsx(classes.tableCell, classes.flexContainer, classes.tableHover, {
        [classes.noClick]: (onRowClick && onCellEdit) == null,
      })}
      variant="body"
      style={{
        height: `${rowHeight}px`,
        background: cellData.isValid ? 'inherit' : theme.palette.warning.main,
      }}
      align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      suppressContentEditableWarning
      contentEditable
      onKeyUp={e => onCellEdit && onCellEdit(columnIndex, rowIndex, e.currentTarget.textContent)}
    />
  );
}

interface IMuiVirtualizedTable extends TableProps {
  onCellEdit?: Function;
}

class MuiVirtualizedTable extends React.PureComponent<IMuiVirtualizedTable> {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }: IGetRowClassName) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex, rowIndex }) => {
    const { columns, classes, rowHeight, onRowClick, onCellEdit } = this.props;

    return (
      <EditableTableCell
        cellData={cellData}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        classes={classes}
        rowHeight={rowHeight}
        columns={columns}
        onCellEdit={onCellEdit}
        onRowClick={onRowClick}
      >
        {cellData}
      </EditableTableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }: IHeaderRenderer) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;

    return (
      <AutoSizer>
        {({ height, width }: Size) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, width, ...other }: ColumnProps, index: number) => {
              return (
                <Column
                  width={width || 120}
                  key={dataKey}
                  headerRenderer={(headerProps: any) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

export const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);
