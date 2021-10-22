import React from 'react';

// Data
import { buildCreateAssessmentSessions } from '../../../lib/services/assessment-session.service';

// Components
import ImportSessionsContainer from './import-sessions.container';
import { getAuthUser } from '../../../lib/services/auth.service';
import { buildCreateAgeGroup, getAgeGroups } from '../../../lib/services/age-group.service';

interface IImportSessionsGraphQL {
  onComplete?: Function;
}

const ImportSessionsGraphQL: React.FC<IImportSessionsGraphQL> = ({ onComplete }) => {
  const user = getAuthUser();
  const { ageGroups } = getAgeGroups();

  const { createAssessmentSessions } = buildCreateAssessmentSessions();
  const { createAgeGroup } = buildCreateAgeGroup();

  const handleCreate = (rows: IAssessmentSession[]) => {
    const data = rows.map(row => ({ ...row, assessmentId: user?.settings.activeAssessmentId }));

    if (onComplete) onComplete();

    return createAssessmentSessions(data);
  }

  return <ImportSessionsContainer
    createAssessmentSessions={handleCreate}
    createAgeGroup={createAgeGroup}
    ageGroups={ageGroups}
  />;
};

export default ImportSessionsGraphQL;
