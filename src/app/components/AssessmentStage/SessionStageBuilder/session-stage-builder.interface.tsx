import { IFormOption } from '../../_core/_ui/forms.component';

export interface ISessionStageBuilderFormValues {
  drills: IFormOption[];
  practicePlans: IFormOption[];
  notifications: IFormOption[];
  enableNotifications: boolean;
}
