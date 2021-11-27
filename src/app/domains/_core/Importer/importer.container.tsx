import _ from 'lodash';
import React, { useState } from 'react';
import Papa, { ParseError } from 'papaparse';
import moment from 'moment';

// Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';

// Data
import { STEPS } from './importer.constants';
import { IImporterContainer } from './importer.interface';

// Components
import ImporterInstructions from './importer-instructions.component';
import ImportMatcherContainer from './ImportColumnMatcher/import-matcher.container';
import ImporterProgressStatus from './importer-progress-status.component';
import ImporterHeaderSelection from './importer-header-selection.component';
import ImporterResults from './importer-results.component';
import { IColumnMap } from './ImportColumnMatcher/import-matcher.interface';
import { Spacer } from '../_ui/structure.components';
import { Button } from '../_ui/buttons.component';

const ImporterContainer: React.FC<IImporterContainer> = ({
  step,
  setStep,
  importItems,
  setImportItems,
  importErrors,
  setImportErrors,
  requiredColumns = [],
  optionalColumns = [],
  repeatedColumnSets = [],
  extensions = ['csv'],
  instructionHeader,
  instructionFooter,
  showFileStructure,
  onSubmit
}) => {
  const [parseError, setParseError] = useState();
  const [fileName, setFileName] = useState();
  const [headerRowIndex, setHeaderRowIndex] = useState(0);
  const [columnMap, setColumnMap] = useState<IColumnMap[]>([]);

  const handleReceiveFiles = (files: File[]) => {
    const currImportItems: string[][] = [];
    let currImportErrors: ParseError[] = [];

    setStep(STEPS.PROCESSING_STATUS);
    setImportItems([]);
    setImportErrors([]);

    if (files.length) {
      setFileName(files[0].name);

      Papa.parse(files[0], {
        encoding: 'utf-8',
        step: (results, parser) => {
          const nextResult: string[] = _.map(results.data, column => String(column));

          currImportItems.push(nextResult);
          currImportErrors = currImportErrors.concat(results.errors);
        },
        complete: () => {
          const lastItem = currImportItems[currImportItems.length - 1];

          if ((lastItem.length === 1 && lastItem[0] === '') || lastItem.length === 0) {
            currImportItems.pop();
          }

          setImportItems(currImportItems);
          setImportErrors(currImportErrors);
          setStep(STEPS.HEADER_CHECK);
        }
      });
    } else {
      setParseError('')
    }
  };

  const handleImportSubmission = (invalidRowMap: ({ [key: string]: boolean })) => {
    const validImportItems = _.filter(importItems, (item, index) => index !== headerRowIndex && !invalidRowMap[index]);
    const collection = validImportItems.map(item => {
      const document: any = {};
      const repeatedSetKeys = [];
      const setKeyCount: { [key: string]: number } = {};

      for (let i = 0; i < repeatedColumnSets.length; i += 1) {
        document[repeatedColumnSets[i].key] = [];
        repeatedColumnSets[i].columns.forEach(column => repeatedSetKeys.push(column.key));
      }

      for (let i = 0; i < columnMap.length; i += 1) {
        const currColumnMap = columnMap[i];
        const currColumn = currColumnMap.column;

        if (!currColumnMap.isIgnored && currColumnMap.isLocked && currColumn) {
          const { key, set, format, formatType, importFormat } = currColumn;

          if (set) {
            document[set] = document[set] || [];
            setKeyCount[key] = setKeyCount[key] ? setKeyCount[key] + 1 : 1;
            document[set][setKeyCount[key] - 1] = document[set][setKeyCount[key] - 1] || {};
            document[set][setKeyCount[key] - 1][key] = formatType === 'DATE'
              ? moment(item[i], format).format(importFormat)
              : item[i];
          } else {
            if (formatType === 'DATE') {
              document[key] = moment(item[i], format).format(importFormat);
            } else {
              document[key] = item[i];
            }
          }
        }
      }

      return document;
    });

    onSubmit(collection);
  };

  const expectedColumns = requiredColumns
    .concat(optionalColumns)
    .concat(_.flatten(repeatedColumnSets.map(set => set.columns)));

  let content;

  switch (step) {
    case STEPS.INSTRUCTIONS:
      content = <ImporterInstructions
        extensions={extensions}
        handleReceivedFiles={handleReceiveFiles}
        parseError={parseError}
        header={instructionHeader}
        footer={instructionFooter}
        requiredColumns={requiredColumns}
        optionalColumns={optionalColumns}
        repeatedColumnSets={repeatedColumnSets}
        showFileStructure={showFileStructure}
      />;
      break;
    case STEPS.PROCESSING_STATUS:
      content =  <ImporterProgressStatus />;
      break;
    case STEPS.HEADER_CHECK:
      content = <ImporterHeaderSelection
        fileName={fileName || 'loading'}
        rows={importItems}
        headerRowIndex={headerRowIndex}
        setHeaderRowIndex={setHeaderRowIndex}
        confirmSelection={() => setStep(STEPS.COLUMN_MATCHING)}
      />;
      break;

    case STEPS.COLUMN_MATCHING:
      content = <ImportMatcherContainer
        requiredColumns={requiredColumns}
        expectedColumns={expectedColumns}
        rows={importItems}
        headerRowIndex={headerRowIndex}
        columnMap={columnMap}
        setColumnMap={setColumnMap}
        completeMatching={() => setStep(STEPS.DATA_REVIEW)}
      />;
      break;
    case STEPS.DATA_REVIEW:
      content = <ImporterResults
        rows={importItems}
        columnMap={columnMap}
        headerRowIndex={headerRowIndex}
        canEdit
        onUpdateRows={setImportItems}
        completeReview={handleImportSubmission}
      />;
      break;
    default:
      setStep(STEPS.INSTRUCTIONS);
      content = <Typography>Loading...</Typography>;
  }

  const cancel = () => {
    setImportItems([]);
    setImportErrors([]);
    setColumnMap([]);
    setParseError(null);
    setFileName(null);
    setHeaderRowIndex(0);
    setStep(STEPS.INSTRUCTIONS);
  };

  const previousStep = (currStep: number) => {
    switch(currStep) {
      case STEPS.HEADER_CHECK:
        setHeaderRowIndex(0);
        setImportItems([]);
        setImportErrors([]);
        setStep(STEPS.INSTRUCTIONS);
        break
      case STEPS.PROCESSING_STATUS:
        setImportItems([]);
        setImportErrors([]);
        setStep(STEPS.INSTRUCTIONS);
        break;
      case STEPS.COLUMN_MATCHING:
        setColumnMap([]);
        setStep(currStep - 1);
        break
      default:
        setStep(currStep - 1);
        // Do nothing...
    }
  };

  return (
    <Box>
      {step > 1 && <Box py={2} display="flex">
        <Button
          bg="white"
          onClick={() => previousStep(step)}
          startIcon={<ArrowBackIosIcon />}
        >Previous Step</Button>
        <Spacer />
        <Button
          bg="white"
          onClick={() => cancel()}
          startIcon={<CloseIcon />}
        >Cancel Import</Button>
      </Box>}
      {content}
    </Box>
  );
}

export default ImporterContainer;
