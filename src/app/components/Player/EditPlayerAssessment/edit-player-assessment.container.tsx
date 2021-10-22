import React, { useEffect, useState } from 'react';

// Components
import EditPlayerAssessment from './edit-player-assessment.component';
import { IFormOption } from '../../_core/_ui/forms.component';

interface IEditPlayerAssessmentContainer {
  playerAssessment?: IPlayerAssessment;
  loading: boolean;
  positions: IPosition[];
  updatePlayerAssessment: Function;
}

const EditPlayerAssessmentContainer: React.FC<IEditPlayerAssessmentContainer> = ({
  playerAssessment,
  loading,
  positions,
  updatePlayerAssessment
}) => {
  const [positionOptions, setPositionOptions] = useState<IFormOption[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPositionOptions(
      positions.map(position => ({ value: position._id, label: position.name }))
    )
  }, [positions.length]);


  const handleUpdatePosition = (positionId: string) =>
    updatePlayerAssessment(playerAssessment?._id, { positionId });

  return <EditPlayerAssessment
    playerAssessment={playerAssessment}
    loading={loading}
    positionOptions={positionOptions}
    changePosition={handleUpdatePosition}
  />
};

export default EditPlayerAssessmentContainer;
