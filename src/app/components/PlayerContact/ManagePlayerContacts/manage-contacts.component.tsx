import React from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

// Components
import PlayerContactFormContainer from './player-contact-form.container';
import { Divider } from '@material-ui/core';
import { IPlayerContactFormFields } from './player-contact-form.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';

interface IManageContacts {
  code?: string;
  contacts: IPlayerContact[];
  activeEditContact?: IPlayerContact;
  setActiveEditContact: Function;
  isCreating: boolean;
  setCreating: Function;
  updateContact: Function;
  addContact: Function;
  removeContact: Function;
}

const ManageContacts: React.FC<IManageContacts> = ({
  code,
  contacts,
  activeEditContact,
  setActiveEditContact,
  isCreating,
  setCreating,
  updateContact,
  addContact,
  removeContact
}) => {
  return (
    <Box>
      <List>
        {contacts.map(contact => activeEditContact && activeEditContact._id === contact._id
          ? (
            <PlayerContactFormContainer
              key={contact._id}
              contact={contact}
              onSubmit={(result: IPlayerContactFormFields) => { updateContact(contact._id, code, result); setActiveEditContact(null); }}
              onCancel={() => setActiveEditContact(null)}
            />
          )
          : (
            <ListItem key={contact._id}>
              <ListItemText primary={contact.name} secondary={`${contact.email} | ${contact.phone}`} />
              <ListItemSecondaryAction>
                <IconButton edge="start" aria-label="edit" onClick={() => { setCreating(false); setActiveEditContact(contact); }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => removeContact(contact._id, code)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        )}
        {contacts.length === 0 && <ListItem><ListItemText primary="None" /></ListItem>}
      </List>
      <Box mb={2}><Divider /></Box>
      {isCreating
        ? <PlayerContactFormContainer onSubmit={(result: IPlayerContactFormFields) => { addContact(result); setCreating(false); }} />
        : <PrimaryButton onClick={() => { setCreating(true); setActiveEditContact(false); }}>Add Contact</PrimaryButton>
      }
    </Box>
  );
};

export default ManageContacts;
