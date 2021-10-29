import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// Material UI
import Typography from '@mui/material/Typography';

// Data
import { IDropFile } from './drop-file.interfaces';

// Components
import { DropFileWrapper } from './drop-file-wrapper.component';

const DropFile: React.FC<IDropFile> = ({
  children,
  onReceivedFiles,
  noClick,
  useWrapper
 }) => {
  const onDrop = useCallback(acceptedFiles => {
    onReceivedFiles(acceptedFiles);
  }, [onReceivedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick,
  });

  const dropContent = useWrapper
    ? <DropFileWrapper><Typography>Drop the files here ...</Typography></DropFileWrapper>
    : <Typography>Drop the files here...</Typography>;

  const content = (
    <div {...getRootProps()} style={{ width: '100%' }}>
      <input {...getInputProps()} />
      {isDragActive ? dropContent : children}
    </div>
  );

  return useWrapper ? <DropFileWrapper>{content}</DropFileWrapper> : content;
}

export default DropFile;
