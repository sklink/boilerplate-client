import React from 'react';
import Select from 'react-select';

// Material UI
import Typography from '@material-ui/core/Typography';

// Components
import { FormLabel, IFormOption } from '../../_core/_ui/forms.component';

interface IEditPlayerAssessment {
  playerAssessment?: IPlayerAssessment;
  loading: boolean,
  positionOptions: IFormOption[];
  changePosition: Function;
}

const EditPlayerAssessment: React.FC<IEditPlayerAssessment> = ({
  playerAssessment,
  loading,
  positionOptions,
  changePosition
}) => {
  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <FormLabel>Position</FormLabel>
      <Select
        loading={loading}
        options={positionOptions}
        isOptionDisabled={option => option.value === playerAssessment?.position._id}
        value={{ value: playerAssessment?.position._id, label: playerAssessment?.position.name }}
        onChange={option => option && changePosition(option.value)}
      />
    </div>
  );
};

export default EditPlayerAssessment;
