import { useMutation } from '@apollo/client';
import { UPDATE_ASSESSMENT } from './assessment.queries';
import { getAuthUser } from '../_auth/auth.service';

interface IUpdateAssessment {
  name?: string;
  covidLink?: string;
  infoLink?: string;
}

export const buildUpdateAssessment = () => {
  const user = getAuthUser();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutation, rest] = useMutation(UPDATE_ASSESSMENT);

  return {
    ...rest,
    updateAssessment: (data: IUpdateAssessment) => mutation({
      variables: { data, _id: user?.settings.activeAssessmentId }
    })
  };
};
