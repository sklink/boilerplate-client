import _ from 'lodash';
import React, { useEffect, useState } from 'react';

// Data
import { IFinalizeSessionFields } from './approve-routes.interface';

// Components
import ApproveRoutes from './approve-routes.component';

interface IApproveRoutesContainer {
  routes: IAssessmentStageRoutePlan[];
  playerAssessments: IPlayerAssessment[];
  finalize: Function;
  loading: boolean;
  fetchError: boolean;
}

const ApproveRoutesContainer: React.FC<IApproveRoutesContainer> = ({
  routes,
  playerAssessments,
  finalize,
  loading,
  fetchError
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [routeSets, setRouteSets] = useState<{ [key: string]: IPlayerAssessment[] }>({});
  const [playerAssessmentsById, setPlayerAssessmentsById] = useState<{ [key: string]: IPlayerAssessment }>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextRouteSets: { [key: string]: IPlayerAssessment[] } = {};

    _.each(routes, route => {
      nextRouteSets[route.action] = nextRouteSets[route.action] || [];
      nextRouteSets[route.action] = nextRouteSets[route.action].concat(route.group);
    });

    setRouteSets(nextRouteSets);
  }, [routes.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPlayerAssessmentsById(_.keyBy(playerAssessments, '_id'));
  }, [playerAssessments.length])

  const removePlayerAssessment = (item: any, action: string) => {
      // @ts-ignore
      _.remove(routeSets[action], currItem => currItem._id === item._id);

      setRouteSets({ ...routeSets });
    };

  const addPlayerAssessment = (item: any, action: string) => {
      // @ts-ignore
    routeSets[action] = [...routeSets[action], item];
      setRouteSets({ ...routeSets });
    };

  const onSubmit = (finalSessionSets: IFinalizeSessionFields[]) => {
    setHasSubmitted(true);
    finalize(finalSessionSets);
  };

  return <ApproveRoutes
    routes={routes}
    routeSets={routeSets}
    playerAssessments={playerAssessments}
    playerAssessmentsById={playerAssessmentsById}
    onSubmit={onSubmit}
    loading={loading}
    fetchError={fetchError}
    removePlayerAssessment={removePlayerAssessment}
    addPlayerAssessment={addPlayerAssessment}
    hasSubmitted={hasSubmitted}
  />;
};

export default ApproveRoutesContainer;
