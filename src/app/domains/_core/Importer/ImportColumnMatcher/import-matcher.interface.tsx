import { IImportColumn } from '../importer.interface';
import { IFormOption } from '../../_ui/forms.component';
import { useState } from 'react';

export interface IImportMatcherContainer {
  requiredColumns: IImportColumn[];
  expectedColumns: IImportColumn[];
  rows: string[][];
  headerRowIndex: number | null;
  columnMap: IColumnMap[];
  setColumnMap: Function;
  completeMatching: Function;
}

export interface IImportMatcher {
  headerRowIndex: number | null;
  headerRow: string[] | null | false;
  sample: ISampleRow[];
  columnMap: IColumnMap[];
  expectedColumns: IImportColumn[];
  unmetRequirements: IImportColumn[];
  unmetFields: IImportColumn[];
  maxColumns: number;
  setColumnMapping: Function;
  rows: string[][];
  completeMatching: Function;
}

export interface IColumnMap {
  isLocked?: boolean;
  isIgnored?: boolean;
  column?: IImportColumn;
}

export interface ISampleRow {
  rowNum: number;
  rowData: string[];
}

export interface ISampleCell {
  rowNum: number;
  cellData: string;
}
