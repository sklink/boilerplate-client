import React from 'react';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { SectionHeading } from '../../_core/_ui/typography.component';
import ManageAgeGroupsGraphQL from '../../AgeGroup/ManageAgeGroups/manage-age-groups.graphql';
import { gql, useQuery } from '@apollo/client';
import ManageAgeGroupGraphQL from '../../AgeGroup/ManageAgeGroup/manage-age-group.graphql';

interface IManageAgeGroupPage {
  match: any;
}

const ManageAgeGroupPage: React.FC<IManageAgeGroupPage> = ({ match }) => {
  const { ageGroupId } = match.params;

  return (
    <DashboardLayout hideSidebar>
      <ManageAgeGroupGraphQL ageGroupId={ageGroupId} />
    </DashboardLayout>
  );
};

export default ManageAgeGroupPage;
