interface ICompany {
  _id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IAssessment {
  _id: string;
  name: string;
  infoLink?: string;
  covidLink?: string;
  company: ICompany;
}

interface IInvite {
  _id: string;
  email: string;
  sentAt: string;
  companyName: string;
  isPasswordRequired?: boolean;
}

interface IMember {
  _id: string;
  user: IUser;
  roles: string[];
  createdAt: string;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  settings?: any;
  isAdmin: boolean;
}

interface IPlayer {
  _id: string;
  code: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: string;
  externalId?: string;
}

interface IPlayerAssessment {
  _id: string;
  assessmentId: string;
  player: IPlayer;
  position: IPosition;
  ageGroup: IAgeGroup;
  sessionsAttended: number;
  sessionsMissed: number;
  assessmentSessionCount: number;
  attendanceCount: number;
  weightedScore?: string;
  contacts: IPlayerContact[];
  assessment: IAssessment;
  hasReportCard: boolean;
  skillSummaries: IScoreSummary[];
  bestSkillSummaries: IScoreSummary[];
  categorySummaries: IScoreSummary[];
  isHeld: boolean;
  isConcluded: boolean;
  hasPaid: boolean;
  paymentRef: string;
  level: string;
  team: string;
}

interface IPosition {
  _id: string;
  name: string;
}

interface IAgeGroup {
  _id: string;
  name: string;
  minAge?: number;
  maxAge?: number;
  assessmentId: string;
  numSessions: number;
  numPlayers: number;
  currentStageNum: number;
  currentStage: IAssessmentStage;
  nextStage: IAssessmentStage;
  showReportPayment: boolean;
  reportPrice: number;
  skillSummaries: IScoreSummary[];
}

interface IAgeGroupAssessment {
  _id: string;
  ageGroup: IAgeGroup;
  assessmentId: string;
}

interface IPlayerLimit {
  positions: string[];
  limit: number;
}

interface IPlayerRoute {
  sendType: string;
  sendTo?: string;
  position: string;
  amount: number;
  takeFrom: string;
}

interface IAssessmentStage {
  _id: string;
  order: number;
  type: string;
  config: any;
  ageGroup: IAgeGroup;
  isReady?: any;
  endsAt?: Date;
  generateGroupPlan?: IAssessmentStagePlan;
  generateRoutePlan?: IAssessmentStageRoutePlan[];
}

interface IAssessmentStageSessionSet {
  session: IAssessmentSession;
  group: IPlayerAssessment[];
}

interface IAssessmentStagePlan {
  sessionStage: IAssessmentStage
  sessionSets: [IAssessmentStageSessionSet]
}

interface IAssessmentStageRoutePlan {
  action: string;
  group: IPlayerAssessment[];
}

interface IPracticePlan {
  _id: string;
  name: string;
  drills: IDrill[];
}

interface IDrill {
  _id: string;
  name: string;
  skillSets: ISkillSet[];
}

interface ISkill {
  _id: string;
  name: string;
  type: string;
  options: { [key: string]: any };
}

interface ISkillSet {
  skillIds: string[];
  skills?: ISkill[];
  positionIds: string[];
  positions?: IPosition[];
}

interface IWeightCategory {
  _id: string;
  name: string;
  weight: number;
  assessmentId: string;
  ageGroupId: string;
  skillIds: string[];
  skills: ISkill[];
}

interface IScore {
  _id: string;
  skill: ISkill;
  raw: string;
  type: string;
  playerAssessmentId: string;
  drillId: string;
  skillId: string;
  userId: string;
  assessmentSessionId: string;
  ageGroupId: string;
  round: number
}

interface IScoreSummary {
  _id: string;
  mean: number;
  meanTime: number;
  best: number;
  bestTime: number;
  weighted: number;
  skillId: string;
  drillId: string;
  ageGroupId: string;
  assessmentSessionId: string;
  assessmentId: string;
  playerAssessmentId: string;
}

interface IPlayerContact {
  _id?: string;
  name: string;
  phone?: string;
  email?: string;
  sendSMS?: boolean;
  sendEmail?: boolean;
}

interface IJersey {
  color: string;
  number: number;
}

interface IAssessmentSession {
  _id: string;
  assessmentId?: string;
  assessment?: IAssessment;
  ageGroupId?: string
  ageGroup: IAgeGroup;
  location?: string;
  area?: string;
  address: string;
  date: string;
  start: number;
  duration: Int
  gender?: string;
  playerAssessments?: IPlayerAssessment[];
  jerseys?: { [key: string]: IJersey };
  teams: { config: string[][] };
  checkedInPlayerIds: string[];
  drills?: IDrill[];
  plans?: IPlan[];
  playerCount?: number;
  drillCount?: number;
  practicePlanCount?: number;
}

type ClickHandler = (event?: MouseEvent<HTMLAnchorElement, MouseEvent>) => void;

interface ITrackedQuery {
  contextJSON: string;
  id: string;
  name: string;
  queryJSON: string;
  variablesJSON: string;
}

interface ICommunication {
  _id: string;
  to: string;
  type: string;
  method: string;
  scheduledAt: Date;
  sentAt: Date;
}

declare module 'react-stay-scrolled' {
  declare let useStayScrolled: any;

  export default useStayScrolled;
}

declare let gtag;
