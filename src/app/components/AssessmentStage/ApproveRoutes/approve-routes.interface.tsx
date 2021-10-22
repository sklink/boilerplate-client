export interface IFinalizeStageProps {
  _id: string;
  sessions: IFinalizeSessionProps[];
}

export interface IFinalizeSessionProps {
  _id: string;
  stageId: string;
  playerAssessmentIds: string[];
  drillIds: string[];
  practicePlanIds: string[];
}

export interface IFinalizeSessionFields {
  _id: string;
  stageId: string;
  playerAssessments: IPlayerAssessment[];
  drills: IDrill[];
  practicePlans: IPracticePlan[];
}

export interface IFinalizeRouteProps {
  action: string;
  playerAssessmentIds: string[];
}
