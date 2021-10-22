export interface IRecordScoreInput {
  _id?: string;
  raw: string;
  type: string;
  playerAssessmentId: string;
  drillId: string;
  skillId: string;
  assessmentId: string;
  assessmentSessionId: string;
  ageGroupId: string;
  round: number;
}
