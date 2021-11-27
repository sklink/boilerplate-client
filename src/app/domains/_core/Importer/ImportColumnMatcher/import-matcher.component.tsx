import React, { useRef } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Check  from '@mui/icons-material/Check';

// Data
import { IImportMatcher } from './import-matcher.interface';
import ImportColumnMatcher from './import-column-matcher.component';
import { Notice } from '../../_ui/icons.component';
import theme from '../../../../lib/_theme';

// Components
import { Spacer } from '../../_ui/structure.components';
import { Bold } from '../../_ui/typography.component';

const ImportMatcher: React.FC<IImportMatcher> = ({
  unmetRequirements,
  unmetFields,
  headerRowIndex,
  headerRow,
  columnMap,
  expectedColumns,
  maxColumns,
  sample,
  setColumnMapping,
  rows,
  completeMatching
}) => {
  const eleMappings = useRef<HTMLHeadingElement>(null);

  const unconfirmedColumns = [];
  const confirmedColumns = [];

  for (let i = 0; i < maxColumns; i += 1) {
    const columnSample = sample.map(item => ({
      rowNum: item.rowNum,
      cellData: item.rowData[i]
    }));

    const eleColumn =
      <ImportColumnMatcher
        key={i}
        index={i}
        headerRowIndex={headerRowIndex}
        header={headerRow && headerRow[i]}
        sample={columnSample}
        expectedColumns={expectedColumns}
        currentMapping={columnMap[i]}
        setColumnMapping={setColumnMapping}
        rows={rows}
      />;

    if (columnMap[i].isLocked) {
      confirmedColumns.push(eleColumn);
    } else {
      unconfirmedColumns.push(eleColumn);
    }
  }

  const buttons = (
    <>
      {unmetRequirements.length > 0 && (
        <Box>
          <Typography>The following fields require a confirmed column mappings:</Typography>
          <Box display="flex" p={2} pb={3}>
            {unmetRequirements.map(requirement => (
              <Box key={requirement.key} mr={2}><Chip label={requirement.label} /></Box>
            ))}
          </Box>
          <Box m={2}><Divider /></Box>
        </Box>
      )}
      {unmetRequirements.length === 0 && unmetFields.length !== 0 && confirmedColumns.length < maxColumns && (
        <Box>
          <Box display="flex" m={2} alignItems="center">
            <Notice icon={<Check style={{ color: theme.palette.success.main }} />}>100% of required columns are matched. Some optional columns still remain. Do you want to continue?</Notice>
            <Spacer />
            <Button color="primary" onClick={() => completeMatching()}>Confirm Current Column Mappings</Button>
          </Box>
          <Box m={2}><Divider /></Box>
        </Box>
      )}
      {unmetFields.length === 0 && confirmedColumns.length < maxColumns && (
        <>
          <Box display="flex" m={2} alignItems="center">
            <Notice icon={<Check style={{ color: theme.palette.success.main }} />}>100% of fields are matched. Do you want to confirm all mappings?</Notice>
            <Spacer />
            <Button color="primary" onClick={() => completeMatching()}>Confirm Current Column Mappings</Button>
          </Box>
          <Box m={2}><Divider /></Box>
        </>
      )}
      {confirmedColumns.length === maxColumns && unmetRequirements.length === 0 && (
        <>
          <Box display="flex" m={2} alignItems="center">
            <Notice icon={<Check style={{ color: theme.palette.success.main }} />}>100% of columns are matched. Do you want to confirm all mappings?</Notice>
            <Spacer />
            <Button color="primary" onClick={() => completeMatching()}>Confirm Current Column Mappings</Button>
          </Box>
          <Box m={2}><Divider /></Box>
        </>
      )}

      {confirmedColumns.length > 0 && (
        <Box display="flex" m={2}>
          <Typography><Bold>{confirmedColumns.length} of {maxColumns} mappings confirmed</Bold></Typography>
          <Spacer />
          <Link onClick={() => eleMappings?.current?.scrollIntoView()}>View Confirmed Mappings</Link>
        </Box>
      )}
    </>
  );

  return <>
    {buttons}

    {unconfirmedColumns}

    {confirmedColumns.length > 0 && (
      <>
        <Box m={2} mt={4}>
          <Typography ref={eleMappings} variant="h6" component="h6">Confirmed Mappings</Typography>
        </Box>
        {confirmedColumns}
      </>
    )}

    {buttons}
  </>;
};

export default ImportMatcher;
