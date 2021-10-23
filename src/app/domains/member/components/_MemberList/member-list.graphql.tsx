import _ from 'lodash';
import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// Data
import { getAuthUser } from '../../../_auth/auth.service';
import { buildRestoreMemberAccess, buildRevokeMemberAccess, getCurrMember } from '../../member.service';
import { MEMBER_FIELDS } from '../../member.queries';

// Components
import MemberListContainer from './member-list.container';

// Queries
const GET_MEMBER_LIST = gql`
  query GetMemberList($companyId: ID!) {
    members(companyId: $companyId) {
      ...MemberFields
    }
    countArchivedMembers(companyId: $companyId)
  }

  ${MEMBER_FIELDS}
`;

const GET_ARCHIVED_MEMBER_LIST = gql`
  query GetArchivedMemberList($companyId: ID!) {
    archivedMembers(companyId: $companyId) {
      ...MemberFields
      ageGroup {
        name
      }
    }
  }

  ${MEMBER_FIELDS}
`;

const UPDATE_MEMBER_ROLES = gql`
  mutation UpdateMemberRoles($_id: ID!, $roles: [String!]!) {
    updateMemberRoles(_id: $_id, roles: $roles) {
      _id
      roles
    }
  }
`;

 const MemberListGraphQL = () => {
  const [viewingArchived, setViewingArchived] = useState(false);
  const user = getAuthUser();
  const { revokeMemberAccess } = buildRevokeMemberAccess();
  const { restoreMemberAccess } = buildRestoreMemberAccess();
  const { member: currMember } = getCurrMember();

  const [updateMemberRolesMutation] = useMutation(UPDATE_MEMBER_ROLES);
  const handleUpdateMemberRoles = (member: IMember, roles: string[]) =>
    updateMemberRolesMutation({
      variables: { _id: member._id, roles },
      optimisticResponse: {
        updateMemberRoles: {
          __typename: 'Member',
          _id: member._id,
          roles
        }
      }
    });

   const { data: sessionData, loading: sessionsLoading, error: sessionsError } = useQuery(GET_MEMBER_LIST, {
    skip: !user || viewingArchived,
    variables: { companyId: user?.settings.activeCompanyId },
    fetchPolicy: 'cache-and-network'
  });

  const { data: archivedData, loading: archivedLoading, error: archivedError } = useQuery(GET_ARCHIVED_MEMBER_LIST, {
    skip: !user || !viewingArchived,
    variables: { companyId: user?.settings.activeCompanyId },
    fetchPolicy: 'cache-and-network'
  });

  let members: IMember[] = [];
  if (viewingArchived) {
    members = (archivedData && archivedData.archivedMembers) || [];
  } else {
    members = (sessionData && sessionData.members) || [];
  }

  const countArchivedMembers = (sessionData && _.isNumber(sessionData.countArchivedMembers)) ? sessionData.countArchivedMembers : 0;
  const loading = !members.length && (sessionsLoading || archivedLoading);

  return <MemberListContainer
    loading={loading}
    members={members}
    currMember={currMember}
    countArchivedMembers={countArchivedMembers}
    fetchError={Boolean(sessionsError) || Boolean(archivedError)}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
    restoreMemberAccess={restoreMemberAccess}
    revokeMemberAccess={revokeMemberAccess}
    updateMemberRoles={handleUpdateMemberRoles}
  />;
};

export default MemberListGraphQL;
