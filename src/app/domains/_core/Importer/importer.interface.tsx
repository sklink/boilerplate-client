import { ReactiveVar } from '@apollo/client';
import { ParseError } from 'papaparse';
import { ReactNode } from 'react';

export interface IImporterContainer {
  step: number;
  setStep: Function;
  importErrors: ParseError[];
  setImportErrors: Function;
  importItems: string[][];
  setImportItems: Function;
  requiredColumns: IImportColumn[];
  optionalColumns?: IImportColumn[];
  repeatedColumnSets?: IImportColumnSet[];
  extensions: string[];
  showFileStructure?: boolean;
  instructionHeader?: ReactNode;
  instructionFooter?: ReactNode;
  onSubmit: Function;
}

export interface IImporterInstructions {
  header?: ReactNode;
  footer?: ReactNode;
  extensions: string[];
  requiredColumns?: IImportColumn[];
  optionalColumns?: IImportColumn[];
  repeatedColumnSets?: IImportColumnSet[];
  showFileStructure?: boolean;
  handleReceivedFiles: Function;
  parseError?: string;
}

export interface IImportColumnSet {
  name: string;
  key: string;
  columns: IImportColumn[];
}

export interface IImportColumn {
  key: string;
  matchAliases?: string[];
  label: string;
  description?: string;
  width?: number;
  validators?: Function[];
  formatType?: string;
  format?: string;
  importFormat?: string;
  set?: string;
}
