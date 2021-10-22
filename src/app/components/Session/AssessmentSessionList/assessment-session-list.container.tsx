import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Fuse from 'fuse.js';

// Components
import AssessmentSessionList from './assessment-session-list.component';

interface IAssessmentSessionListContainer {
  assessmentSessions: IAssessmentSession[];
  countArchivedSessions: number;
  loading: boolean;
  fetchError: boolean;
  viewingArchived: boolean;
  setViewingArchived: Function;
  removeSession: Function;
  restoreSession: Function;
}

const AssessmentSessionListContainer: React.FC<IAssessmentSessionListContainer> = ({
  assessmentSessions,
  countArchivedSessions,
  loading,
  fetchError,
  viewingArchived,
  setViewingArchived,
  removeSession,
  restoreSession
}) => {
  const [selected, setSelected] = useState<IAssessmentSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssessmentSessions, setFilteredAssessmentSessions] = useState(assessmentSessions);
  const fuse = new Fuse(assessmentSessions, { threshold: 0.3, keys: [
      'location',
      'address',
      'date',
      'time'
    ] });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (searchTerm.length) {
      const results = fuse.search(searchTerm);

      setFilteredAssessmentSessions(_.map(results, 'item'));
    } else {
      setFilteredAssessmentSessions(assessmentSessions);
    }
  }, [assessmentSessions.length, searchTerm]);

  const debounceSearch = useCallback(_.debounce((nextSearch: string) => {
    setSearchTerm(nextSearch)
  }, 300), []);

  const removeSessions = (_ids: string[]) => {
    _ids.map(_id => removeSession(_id));
  };

  const restoreSessions = (_ids: string[]) =>
    _ids.map(_id => restoreSession(_id));

  return <AssessmentSessionList
    loading={loading}
    fetchError={fetchError}
    assessmentSessions={filteredAssessmentSessions}
    countArchivedSessions={countArchivedSessions}
    search={debounceSearch}
    selected={selected}
    setSelected={setSelected}
    viewingArchived={viewingArchived}
    setViewingArchived={setViewingArchived}
    removeSessions={removeSessions}
    restoreSessions={restoreSessions}
  />;
};

export default AssessmentSessionListContainer;
