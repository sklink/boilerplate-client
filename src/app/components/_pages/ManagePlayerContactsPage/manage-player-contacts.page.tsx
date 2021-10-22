import React from 'react';

// Material UI
import Typography from '@material-ui/core/Typography';

// Components
import SingleFormLayout from '../_layout/SingleFormLayout/single-form.layout';
import ManagePlayerContactsGraphQL from '../../PlayerContact/ManagePlayerContacts/manage-player-contacts.graphql';


interface IManagePlayerContactsPage {
  match: any;
}

const ManagePlayerContactsPage: React.FC<IManagePlayerContactsPage> = ({ match }) => {
  const { code } = match.params;

  return (
    <SingleFormLayout>
      <Typography>Please set your communication preferences for ice times and report cards</Typography>
      <ManagePlayerContactsGraphQL code={code} />
    </SingleFormLayout>
  );
}

export default ManagePlayerContactsPage;
