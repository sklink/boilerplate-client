import React, { useState } from 'react';
import ManageContacts from './manage-contacts.component';

interface IManageContactsContainer {
  code?: string;
  contacts: IPlayerContact[];
  addContact: Function;
  removeContact: Function;
  updateContact: Function;
  loading: boolean;
  fetchError: boolean;
}

const ManageContactsContainer: React.FC<IManageContactsContainer> = ({
  code,
  contacts,
  addContact,
  removeContact,
  updateContact,
  loading,
  fetchError
}) => {
  const [isCreating, setCreating] = useState(false);
  const [activeEditContact, setActiveEditContact] = useState();

  return <ManageContacts
    code={code}
    contacts={contacts}
    activeEditContact={activeEditContact}
    setActiveEditContact={setActiveEditContact}
    isCreating={isCreating}
    setCreating={setCreating}
    addContact={addContact}
    removeContact={removeContact}
    updateContact={updateContact}
  />;
};

export default ManageContactsContainer;
