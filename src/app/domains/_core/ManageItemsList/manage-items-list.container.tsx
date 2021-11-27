import _ from 'lodash';
import React, { ReactNode, useEffect, useState } from 'react';

// Components
import { IFormOption } from '../_ui/forms.component';
import ManageItemsList from './manage-items-list.component';

interface IManageItemsListContainer {
  entity: string;
  options: object[];
  allowDuplicates?: boolean;
  selectedItems: object[];
  itemKey?: string;
  itemLabel?: string | Function;
  addItem: Function;
  children: (item: any) => ReactNode;
}

const ManageItemsListContainer: React.FC<IManageItemsListContainer> = ({
  entity,
  options,
  allowDuplicates,
  selectedItems,
  itemKey = '_id',
  itemLabel = 'name',
  addItem,
  children
}) => {
  const [availableItemOptions, setAvailableItemOptions] = useState<IFormOption[]>([]);
  const [availableItemHash, setAvailableItemHash] = useState<{ [key: string]: any }>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let nextAvailableItems = options;

    if (!allowDuplicates) {
      const itemKeyHash = _.keyBy(selectedItems, itemKey);
      nextAvailableItems = options.filter((option: { [key: string]: any }) => !itemKeyHash[option[itemKey]]);
    }

    const nextAvailableItemOptions = nextAvailableItems.map((item: { [key: string]: any }) => {
      // @ts-ignore
      return { value: item[itemKey], label: _.isFunction(itemLabel) ? itemLabel(item) : item[itemLabel] };
    });

    setAvailableItemHash(_.keyBy(nextAvailableItems, '_id'));
    setAvailableItemOptions(nextAvailableItemOptions);
  }, [options.length, selectedItems.length]);

  const handleAddItem = (key: string) => addItem(availableItemHash[key])

  return <ManageItemsList
    entity={entity}
    availableItemOptions={availableItemOptions}
    addItem={handleAddItem}
    selectedItems={selectedItems}
    children={children}
  />
};

export default ManageItemsListContainer;
