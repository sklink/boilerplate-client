import React from 'react';

import { APP_TITLE, ROUTE_ROLES } from './_configuration';
import { SESSION_TERM, SESSIONS_TERM } from './app/lib/constants';

// Components
import RouteByRole from './app/components/_core/RouteByRole/route-by-role.component';
import ManageDrillsPage from './app/components/_pages/ManageDrillsPage/manage-drills.page';
import ManagePlayersPage from './app/components/_pages/ManagePlayersPage/manage-players.page';
import ManageSessionPage from './app/components/_pages/ManageSessionsPage/manage-sessions.page';
import CreateAssessmentPage from './app/components/_pages/CreateAssessmentPage/create-assessment.page';
import UpcomingAssessmentSessionsPage
  from './app/components/_pages/UpcomingAssessmentSessions/upcoming-assessment-sessions.page';
import ManageSkillsPage from './app/components/_pages/ManageSkillsPage/manage-skills.page';
import ManagePracticePlanPage from './app/components/_pages/ManagePracticePlansPage/manage-practice-plan.page';
import EditPlayerPage from './app/components/_pages/EditPlayerPage/edit-player.page';
import EditAssessmentSessionPage from './app/components/_pages/EditAssessmentSessionPage/edit-assessment-session.page';
import ConfigureSchedulePage from './app/components/_pages/ConfigureSchedulePage/configure-schedule.page';
import RequestEmailsPage from './app/components/_pages/RequestEmailsPage/request-emails.page';
import ManagePlayerContactsPage from './app/components/_pages/ManagePlayerContactsPage/manage-player-contacts.page';
import ManageWeightingPage from './app/components/_pages/ManageWeightingPage/manage-weighting.page';
import ManageAgeGroupPage from './app/components/_pages/ManageAgeGroup/manage-age-group.page';
import CheckInPage from './app/components/_pages/CheckInPage/check-in.page';
import EvaluatePage from './app/components/_pages/EvaluatePage/evaluate.page';
import EditDrillPage from './app/components/_pages/EditDrillPage/edit-drill.page';
import ReportsPage from './app/components/_pages/ReportsPage/reports.page';
import ReportCardPage from './app/components/_pages/ReportCardPage/report-card.page';

export const ROUTES = [
  <RouteByRole key="upcoming" exact title={`${APP_TITLE} - Upcoming Evaluations`} path="/upcoming" componentsByRole={{
    [ROUTE_ROLES.CHECK_IN]: UpcomingAssessmentSessionsPage,
    [ROUTE_ROLES.SCORING]: UpcomingAssessmentSessionsPage
  }} />,
  <RouteByRole key="drills" exact title={`${APP_TITLE} - Manage Drills`} path="/drills" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: ManageDrillsPage
  }} />,
  <RouteByRole key="drills" exact title={`${APP_TITLE} - Manage Drills`} path="/drills/:drillId" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: EditDrillPage
  }} />,
  <RouteByRole key="skills" exact title={`${APP_TITLE} - Manage Drills`} path="/skills" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: ManageSkillsPage
  }} />,
  <RouteByRole key="practice-plan" exact title={`${APP_TITLE} - Manage Drills`} path="/practice-plans" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: ManagePracticePlanPage
  }} />,
  <RouteByRole key="players" exact title={`${APP_TITLE} - Manage Players`} path="/players" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: ManagePlayersPage,
    [ROUTE_ROLES.REPORTS]: ManagePlayersPage
  }} />,
  <RouteByRole key="edit-player" exact title={`${APP_TITLE} - Edit Player`} path="/players/:playerId/:playerAssessmentId" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: EditPlayerPage,
    [ROUTE_ROLES.REPORTS]: EditPlayerPage
  }} />,
  <RouteByRole key="sessions" exact title={`${APP_TITLE} - Manage ${SESSIONS_TERM}`} path="/sessions" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: ManageSessionPage
  }} />,
  <RouteByRole key="edit-sessions" exact title={`${APP_TITLE} - Edit ${SESSION_TERM}`} path="/sessions/:assessmentSessionId" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: EditAssessmentSessionPage
  }} />,
  <RouteByRole key="create-assessment" exact title={`${APP_TITLE} - Create Assessment`} path="/assessments/create" componentsByRole={{
    [ROUTE_ROLES.AUTHORIZED]: CreateAssessmentPage
  }} />,
  <RouteByRole key="configure-schedule" exact title={`${APP_TITLE} - Configure Schedule Format`} path="/format" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: ConfigureSchedulePage
  }} />,
  <RouteByRole key="manage-age-group" exact title={`${APP_TITLE} - Manage Age Group`} path="/age-group/:ageGroupId" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: ManageAgeGroupPage
  }} />,
  <RouteByRole key="configure-weighting" exact title={`${APP_TITLE} - Configure Weightings`} path="/weighting" componentsByRole={{
    [ROUTE_ROLES.CONFIGURATION]: ManageWeightingPage
  }} />,
  <RouteByRole key="request-email" exact title={`${APP_TITLE} - Request Emails`} path="/request-emails" component={RequestEmailsPage} />,
  <RouteByRole key="request-email" exact title={`${APP_TITLE} - Request Emails`} path="/request-email" component={RequestEmailsPage} />,
  <RouteByRole key="manage-contacts" exact title={`${APP_TITLE} - Manage Contacts`} path="/player/:code/contacts" component={ManagePlayerContactsPage} />,
  <RouteByRole key="manage-contacts" exact title={`${APP_TITLE} - Manage Contacts`} path="/players/:code" component={ManagePlayerContactsPage} />,
  <RouteByRole key="check-in" exact title={`${APP_TITLE} - Check-In`} path="/check-in/:assessmentSessionId" componentsByRole={{
    [ROUTE_ROLES.CHECK_IN]: CheckInPage
  }}  />,
  <RouteByRole key="evaluate" exact title={`${APP_TITLE} - Evaluate`} path="/evaluate/:assessmentSessionId" componentsByRole={{
    [ROUTE_ROLES.SCORING]: EvaluatePage
  }}  />,
  <RouteByRole key="reports" exact title={`${APP_TITLE} - Reports`} path="/reports/:ageGroupId" componentsByRole={{
    [ROUTE_ROLES.REPORTS]: ReportsPage
  }}  />,
  <RouteByRole key="reports" exact title={`${APP_TITLE} - Report Card`} path="/report-card/:code/:playerAssessmentId" component={ReportCardPage} />,
];
