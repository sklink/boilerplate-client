import _ from 'lodash';
import React from 'react';
import { gql, useQuery } from '@apollo/client';

// Data
import {
  buildCreatePlayerContact,
  buildRemovePlayerContact,
  buildUpdatePlayerContact
} from '../../../lib/services/player-contact.service';
import { CONTACT_FIELDS } from '../../../lib/queries/player-contact.queries';

// Components
import ManageContactsContainer from './manage-contacts.container';
import { IPlayerContactFormFields } from './player-contact-form.component';

const GET_MANAGE_PLAYER_CONTACTS = gql`
  query GetManagePlayerContacts($playerId: ID, $code: String) {
    playerContacts(playerId: $playerId, code: $code) {
      ...ContactFields
    }
  }

  ${CONTACT_FIELDS}
`;

interface IManagePlayerContactsGraphQL {
  code?: string;
  playerId?: string;
}

const ManagePlayerContactsGraphQL: React.FC<IManagePlayerContactsGraphQL> = ({ playerId, code }) => {
  const { data, loading, error } = useQuery(GET_MANAGE_PLAYER_CONTACTS, {
    skip: !playerId && !code,
    variables: { playerId, code },
    fetchPolicy: 'cache-and-network'
  });
  const { removePlayerContact } = buildRemovePlayerContact();
  const { createPlayerContact } = buildCreatePlayerContact();
  const { updatePlayerContact } = buildUpdatePlayerContact();

  const contacts = _.get(data, 'playerContacts', []);

  const addContact = (data: IPlayerContactFormFields) => createPlayerContact({ ...data, playerId }, code);

  return <ManageContactsContainer
    code={code}
    contacts={contacts}
    addContact={addContact}
    removeContact={removePlayerContact}
    updateContact={updatePlayerContact}
    loading={loading}
    fetchError={Boolean(error)}
  />;
};

export default ManagePlayerContactsGraphQL;
