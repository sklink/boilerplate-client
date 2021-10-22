import _ from 'lodash';
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

// Data
import { getAuthUser } from '../../../lib/services/auth.service';
import { buildRemoveSkill, buildRestoreSkill } from '../../../lib/services/skill.service';

// Components
import SkillListContainer from './skill-list.container';

// Queries
const GET_SKILL_LIST = gql`
  query GetSkillList($companyId: ID!, $includeGlobal: Boolean) {
    skills(companyId: $companyId, includeGlobal: $includeGlobal) {
      _id
      name
      type
      companyId
    }
    countArchivedSkills(companyId: $companyId)
  }
`;

const GET_ARCHIVED_SKILL_LIST = gql`
  query GetArchivedSkillList($companyId: ID!) {
    archivedSkills(companyId: $companyId) {
      _id
      name
      type
    }
  }
`;

const SkillListData = () => {
  const [viewingArchived, setViewingArchived] = useState(false);
  const user = getAuthUser();
  const { removeSkill } = buildRemoveSkill();
  const { restoreSkill } = buildRestoreSkill();

  const { data: skillData, loading: skillsLoading, error: skillsError } = useQuery(GET_SKILL_LIST, {
    skip: !user || viewingArchived,
    variables: { companyId: user?.settings.activeCompanyId, includeGlobal: user?.settings.includeGlobal },
    fetchPolicy: 'cache-and-network'
  });

  const { data: archivedData, loading: archivedLoading, error: archivedError } = useQuery(GET_ARCHIVED_SKILL_LIST, {
    skip: !user || !viewingArchived,
    variables: { companyId: user?.settings.activeCompanyId },
    fetchPolicy: 'cache-and-network'
  });

  let skills: ISkill[] = [];
  if (viewingArchived) {
    skills = (archivedData && archivedData.archivedSkills) || [];
  } else {
    skills = (skillData && skillData.skills) || [];
  }

  const countArchivedSkills = (skillData && _.isNumber(skillData.countArchivedSkills)) ? skillData.countArchivedSkills : 0;
  const loading = !skills.length && (skillsLoading || archivedLoading);

  return <SkillListContainer
    loading={loading}
    skills={skills}
    countArchivedSkills={countArchivedSkills}
    fetchError={Boolean(skillsError) || Boolean(archivedError)}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
    restoreSkill={restoreSkill}
    removeSkill={removeSkill}
  />
};

export default SkillListData;
