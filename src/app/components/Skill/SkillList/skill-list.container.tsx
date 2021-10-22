import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

// Components
import SkillList from './skill-list.component';

interface ISkillListContainer {
  skills: ISkill[];
  countArchivedSkills: number;
  loading: boolean;
  fetchError: boolean;
  viewingArchived: boolean;
  setViewingArchived: Function;
  removeSkill: Function;
  restoreSkill: Function;
}

const SkillListContainer: React.FC<ISkillListContainer> = ({
  skills,
  countArchivedSkills,
  loading,
  fetchError,
  viewingArchived,
  setViewingArchived,
  removeSkill,
  restoreSkill
}) => {
  const [selected, setSelected] = useState<ISkill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSkills, setFilteredSkills] = useState(skills);
  const fuse = new Fuse(skills, { threshold: 0.3, keys: ['name', 'position.name'] });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (searchTerm.length) {
      const results = fuse.search(searchTerm);

      setFilteredSkills(_.map(results, 'item'));
    } else {
      setFilteredSkills(skills);
    }
  }, [skills.length, searchTerm]);

  const debounceSearch = useCallback(_.debounce((nextSearch: string) => {
    setSearchTerm(nextSearch)
  }, 300), []);

  const removeSkills = (_ids: string[]) => {
    _ids.map(_id => removeSkill(_id));
  };

  const restoreSkills = (_ids: string[]) =>
    _ids.map(_id => restoreSkill(_id));

  return <SkillList
    loading={loading}
    fetchError={fetchError}
    skills={filteredSkills}
    countArchivedSkills={countArchivedSkills}
    searchSkills={debounceSearch}
    selected={selected}
    setSelected={setSelected}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
    removeSkills={removeSkills}
    restoreSkills={restoreSkills}
  />;
};

export default SkillListContainer;
