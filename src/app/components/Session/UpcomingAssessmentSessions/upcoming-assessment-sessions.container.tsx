import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useHistory } from 'react-router';

// Components
import UpcomingAssessmentSessions from './upcoming-assessment-sessions.component';
import Fuse from 'fuse.js';

interface IUpcomingAssessmentSessionsContainer {
  assessmentSessions: IAssessmentSession[];
  member?: IMember;
  loading: boolean;
  fetchError: boolean;
}

const UpcomingAssessmentSessionsContainer: React.FC<IUpcomingAssessmentSessionsContainer> = ({
  assessmentSessions,
  member,
  loading,
  fetchError
}) => {
  const history = useHistory();
  const [filteredSessions, setFilteredSessions] = useState<IAssessmentSession[]>(assessmentSessions);
  const [todaySessions, setTodaySessions] = useState<IAssessmentSession[]>([]);
  const [pastSessions, setPastSessions] = useState<IAssessmentSession[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<IAssessmentSession[]>([]);

  useEffect(() => {
    const today = dayjs().format('YYYY/MM/DD');

    setTodaySessions(_.filter(filteredSessions, session => session.date === today));
    setPastSessions(_.filter(filteredSessions, session => session.date < today));
    setUpcomingSessions(_.filter(filteredSessions, session => session.date > today));
  }, [filteredSessions]);

  const selectSession = (session: IAssessmentSession) => {
    let page = 'check-in';

    if (member && !_.includes(member.roles, 'CHECK_IN')) {
      page = 'evaluate';
    }

    history.push(`/${page}/${session._id}`);
  }


  const [searchTerm, setSearchTerm] = useState('');
  const fuse = new Fuse(assessmentSessions, { threshold: 0.3, keys: ['location', 'address', 'date'] });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (searchTerm.length) {
      const results = fuse.search(searchTerm);

      setFilteredSessions(_.map(results, 'item'));
    } else {
      setFilteredSessions(assessmentSessions);
    }
  }, [assessmentSessions.length, searchTerm]);

  const debounceSearch = useCallback(_.debounce((nextSearch: string) => {
    setSearchTerm(nextSearch)
  }, 300), []);

  return <UpcomingAssessmentSessions
    todaySessions={todaySessions}
    pastSessions={pastSessions}
    upcomingSessions={upcomingSessions}
    selectSession={selectSession}
    search={debounceSearch}
    loading={loading}
    fetchError={fetchError}
  />;
};

export default UpcomingAssessmentSessionsContainer;
