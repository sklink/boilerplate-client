import React from 'react';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';
import { SectionHeading } from '../../_core/_ui/typography.component';
import ManageAgeGroupsGraphQL from '../../AgeGroup/ManageAgeGroups/manage-age-groups.graphql';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <SectionHeading>Dashboard</SectionHeading>
    </DashboardLayout>
  );
};

export default DashboardPage;
