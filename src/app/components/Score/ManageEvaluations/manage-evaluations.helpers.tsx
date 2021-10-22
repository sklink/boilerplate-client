import _ from 'lodash';
import styled from 'styled-components';

interface IStatusIcon {
  status: string;
}

export const STATUS_COLORS: { [key: string]: string } = {
  NONE: '#f44336',
  PARTIAL: '#fbc02d',
  FILLED: '#4caf50'
}

export const JerseyIconList = styled.div`
  display: flex;
  background: #fff;
  border-bottom: 4px solid #9db719;
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: auto;
  width: 100%;
  z-index: 100;
  height: 80px;
`;

interface IJerseyIconWrapper {
  isLabel?: boolean;
  active?: boolean;
}

export const JerseyIconWrapper = styled.div<IJerseyIconWrapper>`
  padding: 8px;
  border-right: 1px solid #ddd;
  display: flex;
  align-items: center;
  background: ${props => props.isLabel ? '#eee' : '#fff'};
  border-top: 2px solid ${props => props.active ? '#9db719' : (props.isLabel ? '#eee' : '#fff')};
  border-bottom: none;
  font-weight: 500;
  position: relative;
  cursor: ${props => props.isLabel ? 'auto' : 'pointer'};
  text-align: center;
`;

export const StatusIcon = styled.div<IStatusIcon>`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => STATUS_COLORS[props.status]};
  box-shadow: 0 0 4px ${props => STATUS_COLORS[props.status]};
`;

export const groupByPosition = (players: IPlayerAssessment[]) => {
  return _.reduce(players, (result: { [key: string]: IPlayerAssessment[] }, playerAssessment: IPlayerAssessment) => {
    if (playerAssessment.position.name === 'Goalie') {
      result.Goalie = result.Goalie || [];
      result.Goalie.push(playerAssessment);
    } else {
      result.Skater = result.Skater || [];
      result.Skater.push(playerAssessment);
    }

    return result;
  }, {});
};

export const sortByJersey = (players: IPlayerAssessment[], jerseys: { [key: string]: IJersey }) => {
  const sortedByNum = _.sortBy(players, (player => jerseys[player._id]?.number));
  const jerseyGroups = _.groupBy(sortedByNum, (player => jerseys[player._id]?.color));

  return _.flatten(_.values(jerseyGroups));
};

export const ReviewScoreItem = styled.div`
  padding: 12px 4px;
  line-height: 0;
  margin-right: 4px;
  color: #fff;
  border-radius: 2px;
  display: inline-block;
  font-size: 18px;
  cursor: pointer;
  background: #BDD739;
`;

export const getMinutes = (time: number) => formatTime(
  Math.floor(time / 60000) % 60
);

export const getSeconds = (time: number) => formatTime(
  Math.floor(time / 1000) % 60
);

export const getHundredthSeconds = (time: number) => formatTime(
  Math.floor(time / 10) % 100
);

const formatTime = (time: number) => {
  return time < 10 ? `0${time}` : time.toString();
}
