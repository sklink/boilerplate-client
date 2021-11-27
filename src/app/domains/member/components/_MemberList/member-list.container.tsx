import React, { useCallback, useEffect, useState } from 'react';

// Data
import { getCurrUser } from '../../../user/user.service';

// Components
import MemberList from './member-list.component';
import Fuse from 'fuse.js';
import _ from 'lodash';
import { toggleListItem } from '../../../../lib/helpers/data-structure.helpers';

interface IMemberListContainer {
  loading: boolean;
  fetchError: boolean;
  members: IMember[];
  countArchivedMembers: number;
  viewingArchived: boolean;
  setViewingArchived: Function;
  restoreMemberAccess: Function;
  revokeMemberAccess: Function;
  updateMemberRoles: Function;
  currMember?: IMember;
}

const MemberListContainer: React.FC<IMemberListContainer> = ({
  loading,
  members,
  countArchivedMembers,
  fetchError,
  viewingArchived,
  setViewingArchived,
  restoreMemberAccess,
  revokeMemberAccess,
  updateMemberRoles,
  currMember
}) => {
  const { user } = getCurrUser();
  const [selected, setSelected] = useState<IMember[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(members);
  const fuse = new Fuse(members, { threshold: 0.3, keys: ['user.name', 'user.email'] });

  useEffect(() => {
    if (searchTerm.length) {
      const results = fuse.search(searchTerm);

      setFilteredMembers(_.map(results, 'item'));
    } else {
      setFilteredMembers(members);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, searchTerm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(_.debounce((nextSearch: string) => {
    setSearchTerm(nextSearch)
  }, 300), []);

  const onRevokeAccess = (_ids: string[]) =>
    _ids.map(_id => revokeMemberAccess(_id));

  const onRestoreAccess = (_ids: string[]) =>
    _ids.map(_id => restoreMemberAccess(_id));

  const toggleRole = (member: IMember, role: string) => {
    const nextRoles = toggleListItem(member.roles, role);

    return updateMemberRoles(member, nextRoles);
  }

  return <MemberList
    revokeAccess={onRevokeAccess}
    restoreAccess={onRestoreAccess}
    currUser={user}
    currMember={currMember}
    members={filteredMembers || []}
    countArchivedMembers={countArchivedMembers}
    loading={loading}
    fetchError={fetchError}
    search={debounceSearch}
    selected={selected}
    setSelected={setSelected}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
    updateMemberRoles={updateMemberRoles}
    toggleRole={toggleRole}
  />;
};

export default MemberListContainer;
