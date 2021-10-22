import React from 'react';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

// Material UI
import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Data
import { SESSION_TERM } from '../../../lib/constants';
import { pluralTerm } from '../../../lib/helpers/term.helper';
import UpcomingAssessmentSessionItem from './upcoming-assessment-session-item.component';
import { FormInput } from '../../_core/_ui/forms.component';
import { Spacer } from '../../_core/_ui/structure.components';

dayjs.extend(advancedFormat)

interface IUpcomingAssessmentSessions {
  todaySessions: IAssessmentSession[];
  pastSessions: IAssessmentSession[];
  upcomingSessions: IAssessmentSession[];
  selectSession: Function;
  search: Function;
  loading: boolean;
  fetchError: boolean;
}

const UpcomingAssessmentSessions: React.FC<IUpcomingAssessmentSessions> = ({
  todaySessions,
  pastSessions,
  upcomingSessions,
  selectSession,
  search,
  fetchError
}) => {
  if (fetchError) return <Typography>Something went wrong. Please try again later</Typography>;

  return (
    <>
      <Box mb={2} display="flex">
        <FormInput onKeyUp={(e: any) => search(e.currentTarget.value)} placeholder={`Search ${pluralTerm(SESSION_TERM).toLowerCase()}...`} />
      </Box>
      <Accordion disabled={todaySessions.length === 0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Today's {pluralTerm(SESSION_TERM)}</Typography>
          <Spacer />
          {todaySessions.length ? `${todaySessions.length} Total` : 'None'}
        </AccordionSummary>
        <AccordionDetails>
          <List style={{ width: '100%' }}>
            {todaySessions.map(session => <UpcomingAssessmentSessionItem assessmentSession={session} selectSession={selectSession} />)}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled={upcomingSessions.length === 0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Upcoming {pluralTerm(SESSION_TERM)}</Typography>
          <Spacer />
          {upcomingSessions.length ? `${upcomingSessions.length} Total` : 'None'}
        </AccordionSummary>
        <AccordionDetails>
          <List style={{ width: '100%' }}>
            {upcomingSessions.map(session => <UpcomingAssessmentSessionItem assessmentSession={session} selectSession={selectSession} />)}
          </List>
          {upcomingSessions.length === 0 && <Typography>None</Typography>}
        </AccordionDetails>
      </Accordion>
      <Accordion disabled={pastSessions.length === 0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Past {pluralTerm(SESSION_TERM)}</Typography>
          <Spacer />
          {pastSessions.length ? `${pastSessions.length} Total` : 'None'}
        </AccordionSummary>
        <AccordionDetails>
          <List style={{ width: '100%' }}>
            {pastSessions.map(session => <UpcomingAssessmentSessionItem assessmentSession={session} selectSession={selectSession} />)}
          </List>
          {pastSessions.length === 0 && <Typography>None</Typography>}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default UpcomingAssessmentSessions;
