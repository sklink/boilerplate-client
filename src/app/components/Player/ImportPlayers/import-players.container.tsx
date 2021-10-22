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

// Components
import ImporterContainer from '../../_core/Importer/importer.container';

const playerImportStep = makeVar<number>(STEPS.INSTRUCTIONS);
const playerImportItems = makeVar<string[][]>([]);
const playerImportErrors = makeVar<ParseError[]>([]);

interface IImportPlayersContainer {
  user?: IUser | null;
  createPlayerAssessments: Function;
  createAgeGroup: Function;
  createPosition: Function;
  ageGroups: IAgeGroup[];
  positions: IPosition[];
}

const ImportPlayersContainer: React.FC<IImportPlayersContainer> = ({
  user,
  createPlayerAssessments,
  createAgeGroup,
  createPosition,
  ageGroups,
  positions
}) => {
  const step = useReactiveVar(playerImportStep);
  const setStep = (step: number) => playerImportStep(step);

  const importItems = useReactiveVar(playerImportItems);
  const setImportItems = (items: string[][]) => playerImportItems(items);
  const errorItems = useReactiveVar(playerImportErrors);
  const setImportErrors = (errors: ParseError[]) => playerImportErrors(errors);

  const handleSubmit = (rows: any[]) => {
    const currAgeGroupNameHash: { [key: string]: string } = toHash(ageGroups, 'name', '_id');
    const currPositionNameHash: { [key: string]: string } = toHash(positions, 'name', '_id');
    const toCreateAgeGroups: string[] = replaceKeyWithID(rows, currAgeGroupNameHash, 'ageGroup', 'ageGroupId');
    const toCreatePositions = replaceKeyWithID(rows,  currPositionNameHash, 'position', 'positionId');

    const createAgeGroups = toCreateAgeGroups.map(name => createAgeGroup(name))
    const createPositions = toCreatePositions.map((name: string) => createPosition(name));

    const done = _.after(2, () => {
      const importRows: any[] = [];

      rows.forEach(row => {
        importRows.push({
          player: {
            ..._.omit(row, ['positionId', 'ageGroupId', 'dateOfBirth',]),
            dateOfBirth: row.dateOfBirth.replace(/[\\,.\-:]/g,'/')
          },
          positionId: row.positionId,
          ageGroupId: row.ageGroupId,
          assessmentId: user?.settings.activeAssessmentId,
        })
      })

      createPlayerAssessments(importRows);
    });

    Promise.all(createPositions).then(createdPositionResults => {
      const createdPositions = createdPositionResults.map(result => result.data?.createPosition);
      const createdPositionNameHash: { [key: string]: string } = toHash(createdPositions, 'name', '_id');

      replaceKeyWithID(rows, createdPositionNameHash, 'position', 'positionId');
      done();
    })

    // Create any missing AgeGroups and assign them to the rows
    Promise.all(createAgeGroups).then(createdAgeGroupResults => {
      const createdAgeGroups = createdAgeGroupResults.map(result => result.data?.createAgeGroup);
      const createdAgeGroupNameHash: { [key: string]: string } = toHash(createdAgeGroups, 'name', '_id');

      replaceKeyWithID(rows, createdAgeGroupNameHash, 'ageGroup', 'ageGroupId');
      done();
    });
  };

  return <ImporterContainer
    onSubmit={handleSubmit}
    step={step}
    setStep={setStep}
    importItems={importItems}
    setImportItems={setImportItems}
    importErrors={errorItems}
    setImportErrors={setImportErrors}
    requiredColumns={[
      { key: 'firstName', label: 'First Name', matchAliases: ['Player First Name', 'Player Last Name (Doe)'] },
      { key: 'lastName', label: 'Last Name', matchAliases: ['Player Last Name', 'Player First Name (John)'] },
      { key: 'position', label: 'Position', matchAliases: ['Position (Skater, Forward, Defense, Goalie)'] },
      { key: 'ageGroup', label: 'Age Group', matchAliases: ['Age Group (ie. U9, U9 Female)'] },
    ]}
    optionalColumns={[
      { key: 'dateOfBirth', label: 'Date of Birth', matchAliases: ['Date of Birth (yyyy/mm/dd)'],
        formatType: 'DATE', importFormat: 'YYYY/MM/DD', format: 'YYYY/MM/DD', validators: [
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

            return !value || value === '' || moment(testValue, format, true).isValid() || moment(testValue, altFormat, true).isValid();
          }
        ] },
      { key: 'gender', label: 'Gender', matchAliases: ['Gender (M,F)'] },
      { key: 'previousPlacement', label: 'Previous Placement', matchAliases: ['Last Year', 'Previous Placement (AAAA, AAA, AA, A1, A2, A3, None)'] },
      { key: 'externalId', label: 'External ID', description: '(i.e. Hockey Registry Canada ID)', matchAliases: ['Hockey Canada ID #'] }
    ]}
    repeatedColumnSets={[{
      name: 'Contact',
      key: 'contacts',
      columns: [
        { key: 'name', set: 'contacts', label: 'Contact Name', matchAliases: ['Parent Name', 'Mother Name', 'Father Name', 'PARENT NAME (First Last)', 'Contact #1 Name', 'Contact #2 Name', 'Contact #3 Name'] },
        { key: 'phone', set: 'contacts', label: 'Contact Phone', matchAliases: ['Parent Phone', 'Mother Phone', 'Father Phone', 'PARENT PHONE # (204-123-4456)', 'Contact #1 Mobile Number', 'Contact #2 Mobile Number', 'Contact #3 Mobile Number'] },
        { key: 'email', set: 'contacts', label: 'Contact Email', matchAliases: ['Parent Email', 'Mother Email', 'Father Email', 'PARENT EMAIL (frank@doe.ca)',  'Contact #1 Email', 'Contact #2 Email', 'Contact #3 Email'] }
      ]
    }]}
    extensions={['csv']}
    showFileStructure
    instructionHeader={<>
      <Typography gutterBottom>Players already in the system will be added to this assessment with their information updated</Typography>
      <Typography variant="subtitle2" align="center" style={{ marginTop: '16px' }}>Use your own CSV or start with this template: <Link href="https://storage.googleapis.com/mea-templates/2021%20Master%20Player%20Import%20Template.csv">2021 Master Player Import Template.csv</Link></Typography>
    </>}
    instructionFooter={<Typography>Column order is not enforced. Next steps will match columns to the appropriate field</Typography>}
  />;
};

export default ImportPlayersContainer;
