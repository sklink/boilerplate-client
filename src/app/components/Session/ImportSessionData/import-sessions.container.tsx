import _ from 'lodash';
import React from 'react';
import { makeVar, useReactiveVar } from '@apollo/client';
import { ParseError } from 'papaparse';
import moment from 'moment';

// Material UI
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

// Data
import { STEPS } from '../../_core/Importer/importer.constants';
import { replaceKeyWithID, toHash } from '../../../lib/helpers/data-structure.helpers';
import { timeToNum } from '../../../lib/helpers/conversion.helpers';

// Components
import ImporterContainer from '../../_core/Importer/importer.container';

const sessionImportStep = makeVar<number>(STEPS.INSTRUCTIONS);
const sessionImportItems = makeVar<string[][]>([]);
const sessionImportErrors = makeVar<ParseError[]>([]);

interface IImportSessionContainer {
  createAssessmentSessions: Function;
  createAgeGroup: Function;
  ageGroups: IAgeGroup[];
}

const ImportSessionsContainer: React.FC<IImportSessionContainer> = ({
  createAssessmentSessions,
  createAgeGroup,
  ageGroups
}) => {
  const step = useReactiveVar(sessionImportStep);
  const setStep = (step: number) => sessionImportStep(step);

  const importItems = useReactiveVar(sessionImportItems);
  const setImportItems = (items: string[][]) => sessionImportItems(items);
  const errorItems = useReactiveVar(sessionImportErrors);
  const setImportErrors = (errors: ParseError[]) => sessionImportErrors(errors);

  const handleSubmit = (rows: any[]) => {
    const currAgeGroupNameHash: { [key: string]: string } = toHash(ageGroups, 'name', '_id');
    let toCreate = replaceKeyWithID(rows, currAgeGroupNameHash, 'ageGroup', 'ageGroupId');

    rows.forEach(row => {
      row.start = timeToNum(row.start);
      row.duration = Number(row.duration);
    });

    const createAgeGroups = toCreate.map(name => createAgeGroup(name))

    // Create any missing AgeGroups and assign them to the rows
    Promise.all(createAgeGroups).then(createdAgeGroupResults => {
      const importRows: any[] = [];
      const createdAgeGroups = createdAgeGroupResults.map(result => result.data?.createAgeGroup);
      const createdAgeGroupNameHash: { [key: string]: string } = toHash(createdAgeGroups, 'name', '_id');

      replaceKeyWithID(rows, createdAgeGroupNameHash, 'ageGroup', 'ageGroupId');

      rows.forEach(row => {
        importRows.push({
          ..._.omit(row, ['date']),
          date: row.date.replace(/[\\,.\-:]/g,'/')
        });
      })

      createAssessmentSessions(importRows);
    });
  }

  return <ImporterContainer
    onSubmit={handleSubmit}
    step={step}
    setStep={setStep}
    importItems={importItems}
    setImportItems={setImportItems}
    importErrors={errorItems}
    setImportErrors={setImportErrors}
    requiredColumns={[
      { key: 'address', label: 'Arena Address' },
      { key: 'date', label: 'Date', formatType: 'DATE', importFormat: 'YYYY/MM/DD', format: 'YYYY/MM/DD', validators: [
          (value: string, format?: string) => {
            const testValue = value.replace(/[\\,.\-:]/g,'/');
            let altFormat;

            switch(format) {
              case 'YYYY/MM/DD':
                altFormat = 'YYYY/M/D';
                break;
              case 'DD/MM/YYYY':
                altFormat = 'D/M/YYYY';
                break;
              case 'MM/DD/YYYY':
                altFormat = 'M/D/YYYY';
                break;
            }

            return moment(testValue, format, true).isValid() || moment(testValue, altFormat, true).isValid();
          }
        ] },
      { key: 'start', label: 'Start Time', matchAliases: ['Start'] },
      { key: 'ageGroup', label: 'Age Group' }
    ]}
    optionalColumns={[
      { key: 'location', label: 'Arena Name' },
      { key: 'area', label: 'Rink Name' },
      { key: 'duration', label: 'Duration', validators: [
          (value: string) => !_.isNaN(Number(value))
      ] },
      { key: 'gender', label: 'Gender', matchAliases: ['GENDER (M, F)'] },
    ]}
    extensions={['csv']}
    showFileStructure
    instructionHeader={<>
      <Typography variant="subtitle2" align="center">Use your own CSV or start with this template: <Link href="https://storage.googleapis.com/mea-templates/2021-08-14-Ice_Time_Import_Template.csv">2021-08-14-Ice_Time_Import_Template.csv</Link></Typography>
    </>}
    instructionFooter={<Typography>Column order is not enforced. Next steps will match columns to the appropriate field</Typography>}
  />;
};

export default ImportSessionsContainer;
