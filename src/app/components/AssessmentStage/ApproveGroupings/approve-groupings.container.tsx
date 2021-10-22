import _ from 'lodash';
import React, { useEffect, useState } from 'react';

// Data
import { IFinalizeSessionFields } from './approve-groupings.interface';

// Components
import ApproveGroupings from './approve-groupings.component';

interface IApproveGroupingsContainer {
  plans: IAssessmentStagePlan[];
  playerAssessments: IPlayerAssessment[];
  drills: IDrill[];
  practicePlans: IPracticePlan[]
  finalize: Function;
  loading: boolean;
  fetchError: boolean;
}

const ApproveGroupingsContainer: React.FC<IApproveGroupingsContainer> = ({
  plans,
  playerAssessments,
  drills,
  practicePlans,
  finalize,
  loading,
  fetchError
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [sessionSets, setSessionSets] = useState<IFinalizeSessionFields[]>([]);
  const [playerAssessmentsById, setPlayerAssessmentsById] = useState<{ [key: string]: IPlayerAssessment }>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextSessionSets: IFinalizeSessionFields[] = [];

    plans.forEach(plan => {
      plan.sessionSets.forEach(sessionSet => {
        const drillsByKey: { [key: string]: IDrill } = _.keyBy(drills, '_id');
        const currDrills = plan.sessionStage.config.drills.map((drillId: string) => drillsByKey[drillId]);
        const practicePlansByKey: { [key: string]: IPracticePlan } = _.keyBy(practicePlans, '_id');
        const currPracticePlans = plan.sessionStage.config.practicePlans.map((practicePlanId: string) => practicePlansByKey[practicePlanId]);

        _.pull(currDrills, undefined);
        _.pull(currPracticePlans, undefined);

        nextSessionSets.push({
          _id: sessionSet.session._id,
          stageId: plan.sessionStage._id,
          playerAssessments: [...sessionSet.group],
          drills: currDrills,
          practicePlans: currPracticePlans,
        })
      });
    });


    setSessionSets(nextSessionSets);
  }, [plans.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPlayerAssessmentsById(_.keyBy(playerAssessments, '_id'));
  }, [playerAssessments.length])

  const buildRemoveItem = (listKey: string) =>
    (item: any, sessionIndex: number) => {
      // @ts-ignore
      _.remove(sessionSets[sessionIndex][listKey], currItem => currItem._id === item._id);

      setSessionSets([...sessionSets]);
    };

  const buildAddItem = (listKey: string) =>
    (item: any, sessionIndex: number) => {
      // @ts-ignore
      sessionSets[sessionIndex][listKey] = [...sessionSets[sessionIndex][listKey], item];
      setSessionSets([...sessionSets]);
    };

  const onSubmit = (finalSessionSets: IFinalizeSessionFields[]) => {
    setHasSubmitted(true);
    finalize(finalSessionSets);
  };

  return <ApproveGroupings
    plans={plans}
    sessionSets={sessionSets}
    playerAssessments={playerAssessments}
    playerAssessmentsById={playerAssessmentsById}
    drills={drills}
    practicePlans={practicePlans}
    onSubmit={onSubmit}
    loading={loading}
    fetchError={fetchError}
    removePlayerAssessment={buildRemoveItem('playerAssessments')}
    removeDrill={buildRemoveItem('drills')}
    removePracticePlan={buildRemoveItem('practicePlans')}
    addPlayerAssessment={buildAddItem('playerAssessments')}
    addDrill={buildAddItem('drills')}
    addPracticePlan={buildAddItem('practicePlans')}
    hasSubmitted={hasSubmitted}
  />;
};

export default ApproveGroupingsContainer;
