import _ from 'lodash';
import React, { FunctionComponent, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import { TableHead } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { default as MuiTableCell } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

// Material Icons
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import InfoIcon from '@mui/icons-material/Info';
import { lighten, useTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';

import theme, { color } from '../../../lib/_theme';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

interface ICollapsibleRow {
  summary: ReactNode;
  details?: ReactNode;
}

export const CollapsibleRow: React.FC<ICollapsibleRow> = ({ summary, details }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <MuiTableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </MuiTableCell>
        {summary}
      </TableRow>
      <TableRow>
        <MuiTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {details}
          </Collapse>
        </MuiTableCell>
      </TableRow>
    </React.Fragment>
  );
}

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const TablePaginationActions: FunctionComponent<TablePaginationActionsProps> = ({ count, page, rowsPerPage, onChangePage }) => {
  const classes = useStyles1();
  const theme = useTheme();

  const handleFirstPageButtonClick = (event: any) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        size="large">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        size="large">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        size="large">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        size="large">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export interface IEnhancedTableRow {
  _id: string;
  data: any;
  disableSelect?: boolean;
  cells: ReactNode[];
}

interface IEnhancedTable {
  head?: ReactNode;
  rows: Array<IEnhancedTableRow>;
  numCols: number;
  showToolbar?: boolean;
  columns: IEnhancedTableColumn[];
  defaultOrder: string;
  disableSelect?: boolean;
  entityName?: string;
  showError?: boolean;
  showLoading?: boolean;
  filterComponent?: ReactNode;
  title?: string;
  checkboxTitle?: string;
  selected?: any[];
  setSelected?: Function;
  selectedAction?: ReactNode;
  noResultsMessage?: string;
  stickyHeader?: boolean;
  height?: string;
}

export const EnhancedTable: React.FC<IEnhancedTable> = ({
  rows,
  numCols,
  columns,
  defaultOrder,
  disableSelect,
  entityName,
  showError,
  showLoading,
  filterComponent,
  title,
  checkboxTitle,
  selectedAction,
  selected,
  setSelected,
  noResultsMessage = 'No Results Found',
  stickyHeader,
  height
}) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState(defaultOrder);

  const handleRequestSort = (event: any, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick: ClickHandler = (event: any) => {
    if (event.target.checked) {
      const newSelected: any[] = [];

      rows.forEach(row => {
        if (!row.disableSelect) {
          newSelected.push(row.data);
        }
      });

      if (setSelected) setSelected(newSelected);
      return;
    }

    if (setSelected) setSelected([]);
  };

  const handleClick = (event: any, row: any) => {
    const selectedIndex = _.findIndex(selected || [], item => item._id === row._id);
    const currSelected = selected ? selected : [];
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(currSelected, row.data);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(currSelected.slice(1));
    } else if (selectedIndex === currSelected.length - 1) {
      newSelected = newSelected.concat(currSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        currSelected.slice(0, selectedIndex),
        currSelected.slice(selectedIndex + 1),
      );
    }

    if (setSelected) setSelected(newSelected);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (row: any) => _.find(selected, item => item._id === row._id);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const colSpan = numCols + (disableSelect ? 0 : 1);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {(title || filterComponent) && <EnhancedTableToolbar
          title={title}
          numSelected={selected ? selected.length : 0}
          filterComponent={filterComponent}
          selectedAction={selectedAction}
        />}
        <TableContainer style={{ position: 'relative', height: height || 'auto' }}>
          <Table stickyHeader={stickyHeader} aria-label="custom pagination table" className={classes.table}>
            {columns && (
              <EnhancedTableHead
                checkboxTitle={checkboxTitle}
                classes={classes}
                columns={columns}
                numSelected={selected ? selected.length : 0}
                order={order}
                orderBy={orderBy}
                disableSelect={disableSelect || !setSelected}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
            )}
            <TableBody>
              {showLoading && (
                <LoadingRow key="loading"><MuiTableCell style={{ display: 'block' }} colSpan={colSpan}>Loading{entityName && ` ${entityName}`}...</MuiTableCell></LoadingRow>
              )}
              {showError && (
                <ErrorRow key="error"><MuiTableCell style={{ display: 'block' }} colSpan={colSpan}>Unable to fetch{entityName && ` ${entityName}`}. Please try again later or reach out to support for immediate assistance</MuiTableCell></ErrorRow>
              )}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: IEnhancedTableRow, index: number) => {
                  const isItemSelected = isSelected(row);

                  return (
                    <TableRow
                      hover={!disableSelect}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      {setSelected && !disableSelect && <MuiTableCell padding="checkbox">
                        {!row.disableSelect && <Checkbox
                          onClick={(event) => handleClick(event, row)}
                          checked={Boolean(isItemSelected)}
                        />}
                      </MuiTableCell>}
                      {row.cells}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow key="empty" style={{ height: 53 * emptyRows }}>
                  <MuiTableCell colSpan={colSpan} style={{ textAlign: 'center' }}>{rows.length === 0 ? noResultsMessage : ''}</MuiTableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={colSpan}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export interface IEnhancedTableColumn {
  key: string;
  numeric?: boolean;
  label?: string;
  path?: string;
  disableSort?: boolean;
  width?: string;
  helper?: string;
  sticky?: boolean;
}

interface IEnhancedTableHead {
  onSelectAllClick: ClickHandler;
  order: 'asc' | 'desc';
  orderBy: string;
  numSelected: number;
  rowCount: number;
  onRequestSort: Function;
  classes: any;
  columns: IEnhancedTableColumn[];
  disableSelect?: boolean;
  checkboxTitle?: string;
}

const EnhancedTableHead: React.FC<IEnhancedTableHead> = ({
  classes,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  columns,
  disableSelect,
  checkboxTitle
}) => {
  const createSortHandler = (property: string) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {checkboxTitle && (
          <TableCell>{checkboxTitle}</TableCell>
        )}
        {!disableSelect && !checkboxTitle && <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all' }}
          />
        </TableCell>}
        {columns.map((column: IEnhancedTableColumn) => (
          <MuiTableCell
            key={column.key}
            align={column.numeric ? 'right' : 'left'}
            style={{ minWidth: column.width || 'auto', position: column.sticky ? 'sticky' : 'initial', background: 'white', left: 0 }}
          >
            <Box display="flex" alignItems="center">
              {column.disableSort
                ? column.label
                : (
                  <TableSortLabel
                    active={orderBy === String(column.path || column.key)}
                    direction={orderBy === column.path || column.key ? order : 'asc'}
                    onClick={createSortHandler(column.path || column.key)}
                  >
                    {column.label}
                    {orderBy === column.key ? (
                      <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                )}
              {column.helper && (
                <Tooltip title={column.helper}>
                  <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
                </Tooltip>
              )}
            </Box>
          </MuiTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1.5),
  },
  highlight:
    theme.palette.mode === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

interface IEnhancedTableToolbar {
  title?: string;
  numSelected: number;
  filterComponent?: ReactNode;
  selectedAction?: ReactNode;
}

const EnhancedTableToolbar: React.FC<IEnhancedTableToolbar> = ({
  title,
  numSelected,
  filterComponent,
  selectedAction,
}) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
      )}

      {numSelected > 0 && selectedAction ? selectedAction : filterComponent || <></>}
    </Toolbar>
  );
};

export const ErrorRow = withStyles({
  root: {
    position: 'absolute',
    top: '57px',
    width: '100%',
    zIndex: 90,
    background: theme.palette.error.main,
    '& .MuiTableCell-root': {
      color: theme.palette.error.contrastText,
      textAlign: 'center',
      fontWeight: 500,
      fontFamily: 'Quicksand, sans-serif'
    }
  }
})(TableRow);

export const LoadingRow = withStyles({
  root: {
    position: 'absolute',
    top: '57px',
    width: '100%',
    zIndex: 90,
    background: theme.palette.info.main,
    '& .MuiTableCell-root': {
      color: theme.palette.info.contrastText,
      textAlign: 'center',
      fontWeight: 500,
      fontFamily: 'Quicksand, sans-serif'
    }
  }
})(TableRow);

interface ITableCell {
  children?: any;
  disabled?: boolean;
  background?: string;
  padding?: string;
  align?: string;
  onClick?: ClickHandler;
  colSpan?: number;
  style?: { [key: string]: any };
}

const TableCellWrapper = styled('td')<ITableCell>`
  display: table-cell;
  padding: ${props => props.padding === 'none' ? 0 : props.padding || '16px'};
  position: relative;
  height: 100%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.43;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  letter-spacing: 0.01071em;
  vertical-align: inherit;
  color: ${props => props.disabled ? theme.palette.text.disabled : 'inherit'};
  background: ${props => props.background ? props.background : 'transparent'};
  text-align: ${props => props.align || 'left'};

  &:before {
    content: '&nbsp;';
    visibility: hidden;
  }

  & span {
    position: absolute;
    padding: 0 16px;
    left: 0;
    right: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
`;

export const TableCell: React.FC<ITableCell> = ({ children, disabled, background, padding, align }) => {
  return <TableCellWrapper><span>{children}</span></TableCellWrapper>;
}


// Table Helpers
function descendingComparator(a: IEnhancedTableRow, b: IEnhancedTableRow, orderBy: string) {
  if (_.get(b, `data.${orderBy}`) < _.get(a, `data.${orderBy}`)) {
    return -1;
  }
  if (_.get(b, `data.${orderBy}`) > _.get(a, `data.${orderBy}`)) {
    return 1;
  }
  return 0;
}

function getComparator(order: 'asc' | 'desc', orderBy: string) {
  return order === 'desc'
    ? (a: IEnhancedTableRow, b: IEnhancedTableRow) => descendingComparator(a, b, orderBy)
    : (a: IEnhancedTableRow, b: IEnhancedTableRow) => -descendingComparator(a, b, orderBy);
}

interface ISortRow {
  row: IEnhancedTableRow;
  index: number;
}

function stableSort(array: IEnhancedTableRow[], comparator: Function): IEnhancedTableRow[] {
  const stabilizedThis: ISortRow[] = array.map((row, index) => ({ row, index }));
  stabilizedThis.sort((a, b) => {
    const order = comparator(a.row, b.row);
    if (order !== 0) return order;

    return Number(a.index) - Number(b.index);
  });
  return stabilizedThis.map((item) => item.row);
}

interface ICellBubble {
  dark?: boolean;
}

export const CellBubble = styled('div')<ICellBubble>`
  background: ${props => props.dark ? theme.palette.primary.light : color.section.dark};
  color: rgba(0, 0, 0, 0.56);
  text-align: center;
  font-weight: bold;
  font-family: Quicksand;
  border-radius: 8px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StickyTableCell = withStyles(() => ({
  root: {
    borderRight: '1px solid #ddd',
    position: 'sticky',
    left: 0,
    background: 'white'
  }
}))(MuiTableCell);
