import { IFormOption } from '../../_core/_ui/forms.component';

interface IPlayerLimitFormValues {
  positions: IFormOption[];
  limit: number;
}
export interface IGroupStageBuilderFormValues {
  orderBy: IFormOption;
  playerLimits: IPlayerLimitFormValues[];
  manualApproval: boolean;
}
