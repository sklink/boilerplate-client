export interface ITeam {
  playersByPosition: { [key: string]: IPlayerAssessment[] };
  colors: { [key: string]: string[] };
}
