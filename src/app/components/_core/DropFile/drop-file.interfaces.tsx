import { ReactNode } from 'react';

export interface IDropFile {
  children: ReactNode;
  onReceivedFiles: Function;
  noClick?: boolean;
  noDrop?: boolean;
  useWrapper?: boolean;
}
