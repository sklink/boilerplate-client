import _ from 'lodash';
import React, { ReactNode } from 'react';
import Select from 'react-select';

// Material UI
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';

// Components
import { IFormOption } from '../_ui/forms.component';

interface IManageItemsList {
  entity: string;
  availableItemOptions: IFormOption[];
  addItem: Function;
  selectedItems: object[];
  children: (item: any) => ReactNode;
}

const ManageItemsList: React.FC<IManageItemsList> = ({
  entity,
  availableItemOptions,
  addItem,
  selectedItems,
  children
}) => {
  let content: ReactNode[];

  if (selectedItems.length === 0) {
    content = [<ListItem key="none">None</ListItem>];
  } else {
    content = _.map(selectedItems, item => (children(item)));
  }

  return (
    <Box display="flex" flexDirection="column">
      <FormControl>
        <Select
          placeholder={`Add ${entity}...`}
          options={availableItemOptions}
          value={null}
          onChange={option => option && addItem(option.value)}
        />
      </FormControl>
      <List>{content}</List>
    </Box>
  );
};

export default ManageItemsList;
