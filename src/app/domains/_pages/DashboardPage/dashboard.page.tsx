import React from 'react';

// Material UI
import Typography from '@mui/material/Typography';

// Components
import DashboardLayout from '../_layout/DashboardLayout/dashboard.layout';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <Typography variant="h5">Dashboard</Typography>
    </DashboardLayout>
  );
};

export default DashboardPage;
