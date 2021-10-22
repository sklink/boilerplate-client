import React from 'react';
import { Redirect } from 'react-router-dom';

// Components
import SkillGroupNavigation from './skill-group-navigation.component';

interface ISkillGroupNavigationContainer {
  currentLocation: string;
  countSkills: number;
  countDrills: number;
  loading: boolean;
  fetchError: boolean;
}

const SkillGroupNavigationContainer: React.FC<ISkillGroupNavigationContainer> = ({
  currentLocation,
  countSkills,
  countDrills,
  loading,
  fetchError
}) => {
  if (currentLocation === '/drills' && countSkills === 0 && !loading)
    return <Redirect to="/skills" />;

  if (currentLocation === '/practice-plans' && countDrills === 0 && !loading)
    return <Redirect to="/drills" />;

  return <SkillGroupNavigation
    currentLocation={currentLocation}
    countSkills={countSkills}
    countDrills={countDrills}
    loading={loading}
    fetchError={fetchError}
  />;
};

export default SkillGroupNavigationContainer;
