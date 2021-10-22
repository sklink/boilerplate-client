import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';

import jersey from '../../../assets/jersey-wrapper.png';
import { ITeam } from './check-in.interface';
import { Checkbox } from '@material-ui/core';

export const COLOUR_PALETTE_RGB_MAP: { [key: string]: string } = {
  green: 'rgb(76, 175, 80)',
  red: 'rgb(244, 67, 54)',
  yellow: 'rgb(255, 235, 59)',
  black: 'rgb(0, 0, 0)',
  purple: 'rgb(156, 39, 176)',
  grey: 'rgb(158, 158, 158)',
  pink: 'rgb(233, 30, 99)',
  orange: 'rgb(255, 152, 0)',
  blue: 'rgb(33, 150, 243)',
  white: 'rgb(230, 230, 230)'
};

export const buildColors = (teamPlayers: IPlayerAssessment[], jerseys: { [key: string]: IJersey }, checkedInPlayerIds: string[]) => {
  const colors: { [key: string]: string[] } = {};

  teamPlayers.forEach(playerAssessment => {
    const jersey = jerseys[playerAssessment._id];
    const isCheckedIn = _.includes(checkedInPlayerIds, playerAssessment._id);

    if (isCheckedIn && jersey && jersey.color) {
      colors[playerAssessment.position.name] = colors[playerAssessment.position.name] || [];
      if (!_.includes(colors[playerAssessment.position.name], jersey.color)) {
        colors[playerAssessment.position.name].push(jersey.color);
      }
    }
  });

  return colors;
};

export const buildTeamPlayers = (playerAssessments: IPlayerAssessment[], numTeams: number) => {
  const teams: IPlayerAssessment[][] = [];

  const playersByPosition = playerAssessments.reduce((result: { [key: string]: IPlayerAssessment[] }, playerAssessment) => {
    const positionId = playerAssessment.position._id;

    result[positionId] = result[positionId] || [];
    result[positionId].push(playerAssessment);

    return result;
  }, {});

  let currTeam = 0;
  _.each(playersByPosition, (positionPlayers) => {
    _.each(positionPlayers, (playerAssessment) => {
      teams[currTeam] = teams[currTeam] || [];
      teams[currTeam].push(playerAssessment);

      currTeam += 1;
      currTeam %= numTeams;
    });
  });

  return teams;
};

export const rebuildTeamPlayers = (teams: string[][], playerAssessments: IPlayerAssessment[]) => {
  const result: IPlayerAssessment[][] = [];
  const tracked: { [key: string]: boolean } = {};

  teams.forEach((team, index) => {
    result.push([]);

    team.forEach(playerAssessmentId => {
      const playerAssessment = _.find(playerAssessments, playerAssessments =>playerAssessments._id === playerAssessmentId);

      if (playerAssessment) {
        tracked[playerAssessment._id] = true;
        result[index].push(playerAssessment);
      }
    });
  });

  playerAssessments.forEach(playerAssessment => {
    let currTeam = 0;

    if (!tracked[playerAssessment._id] && result[currTeam]) {
      result[currTeam].push(playerAssessment);
      currTeam = (currTeam + 1) % teams.length;
    }
  })

  return result;
};

export const exportTeams = (teams: ITeam[]) => {
  const result: string[][] = [];

  _.each(teams, (team, index) => {
    result.push([]);

    _.each(team.playersByPosition, (players) => {
      _.each(players, player => {
        result[index].push(player._id);
      });
    });
  });

  return result;
}

export const sortByPosition = (playerAssessments: IPlayerAssessment[]) => {
  const playersByPosition: { [key: string]: IPlayerAssessment[] } = {};

  playerAssessments.forEach(playerAssessment => {
    const positionName = playerAssessment.position.name;

    playersByPosition[positionName] = playersByPosition[positionName] || [];
    playersByPosition[positionName].push(playerAssessment);
  });

  const positionNames = Object.keys(playersByPosition);
  positionNames.forEach(positionName => {
    playersByPosition[positionName] = _.sortBy(playersByPosition[positionName], playerAssessment => {
      return playerAssessment.player.lastName;
    });
  });

  return playersByPosition;
}

interface IJerseyIcon {
  color?: string;
}

export const JerseyIcon = styled.div<IJerseyIcon>`
  background-image: url(${jersey});
  background-size: cover;
  background-color: ${props => props.color ? (COLOUR_PALETTE_RGB_MAP[props.color] || props.color) :  '#aaa'};
  width: 60px;
  height: 60px;
  padding: 22px 0;
  color: ${props => props.color === 'white' ? '#000' : '#fff'};
  text-align: center;
  font-weight: 700;
  font-size: 16px;
`;

interface IColorPaletteItem {
  color: string;
}

interface IColorPalette {
  active?: boolean;
  color: string;
}

const ColorPaletteWrapper = styled.div<IColorPalette>`
  cursor: pointer;
  height: 57px;
  float: left;
  width: 57px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 8px;
  position: relative;
  background: ${props => COLOUR_PALETTE_RGB_MAP[props.color] || 'transparent'};
  box-shadow: ${props => props.active ? 'inset 0 0 0 4px rgba(0,0,0,.6)' : 'inset 0 0 0 4px rgba(0,0,0,.2)'};

  & .checkbox {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAABUElEQVRIid2WzUrDQBSF+2qtIupDuCgWBXXvI4gKig/gQtNa3YjYpmblTktdSYs/NeoDaFUkZTqTTI6LGppJ0vyYiaAXzuYOzHfvPRdmcoVyH27lFQPeXFJ578j9H0heMeBWWoAb5MjXSRaSBpmp9jFdzQiyrBFsNCl2rxn22wxzp0QupFgjYBz4pDaICWhPpvxOOi8cTjx/cPnjOr434Y4VzT+mVJD1SyoAdq7oz7Zr9jA4X1IJLHsEaDwG+zAWUqwRrJ4PsNWi2GszrF34K7x5Hfmgv3NMHUR3LkDm6wQWBwxmY2ANL1J1E5OV4flJV/Rh6Wy8D6HjKqlEqBYAHt44lA4TctutcB9ieeKt2h11PdqH2Nu12aSwbRHQ7XFMVJJtY+QKL6gEdz0O/g1bbMTzIRHE0dGtGbhtUiFp9DuQLF7FQjnkZZQFCv1I/GnIFzUZPB04niNIAAAAAElFTkSuQmCC) no-repeat;
    border-top: 4px solid rgba(0,0,0,.6);
    border-radius: 0 4px 0 0;
    position: absolute;
    bottom: 4px;
    left: 4px;
    width: 29px;
    height: 29px;
    border-right: 4px solid rgba(0,0,0,.6);
    display: ${props => props.active ? 'block' : 'none'};
  }
`;

interface IColorPaletteItem {
  onClick: ClickHandler;
  color: string;
  active?: boolean;
}

export const ColorPaletteItem: React.FC<IColorPaletteItem> = ({ onClick, color, active }) => {
  return <ColorPaletteWrapper
    color={color}
    active={active}
    onClick={onClick && onClick}
  >
    <div className="checkbox" />
  </ColorPaletteWrapper>
};

interface IValidateJesery {
  jerseys: { [key: string]: IJersey };
  checkedInPlayersHash: { [key: string]: IPlayerAssessment };
  color?: string,
  number?: number;
  playerAssessment: IPlayerAssessment;
  colorInUse: boolean;
  duplicateConfirmed: boolean;
}

export const validateJersey = ({ jerseys, checkedInPlayersHash, playerAssessment, color, number, colorInUse, duplicateConfirmed }: IValidateJesery) => {
  let status;

  if (_.isNull(number) || _.isUndefined(number) || _.isNull(color) || _.isUndefined(color)) {
    status = 'WAITING';
  } else if (_.isNumber(number) && number >= 0 && _.isString(color) && color !== '') {
    status = 'VALID';

    const playerAssessmentIds = Object.keys(jerseys);

    for (let i = 0; i < playerAssessmentIds.length && status === 'VALID'; i += 1) {
      const currPlayerAssessmentId = playerAssessmentIds[i];
      const currJersey = jerseys[currPlayerAssessmentId];
      const currPlayer = checkedInPlayersHash[currPlayerAssessmentId];

      if (number === currJersey.number
        && color === currJersey.color
        && currPlayer
        && currPlayer?._id !== playerAssessment._id) {
        status = `Jersey is in use by ${currPlayer.player.firstName} ${currPlayer.player.lastName}`;
      }
    }
  } else {
    status = 'Select a color and entered a single number for jersey';
  }

  if (colorInUse && !duplicateConfirmed) {
    status = 'WAITING';
  }

  return status;
}

interface IValidateColor {
  color: string;
  teams: ITeam[];
  playerAssessment?: IPlayerAssessment;
  teamIndex: number;
}

export const validateColor = ({ color, teams, playerAssessment, teamIndex }: IValidateColor) => {
  if (!playerAssessment) return null;

  const activePosition = playerAssessment?.position.name;
  let result = null;

  _.each(teams, (team, teamIndex) => {
    _.each(team.colors, (positionColors, positionName) => {
      if ((positionName !== activePosition || Number(teamIndex) !== teamIndex) && _.includes(positionColors, color)) {
        result = {
          team: teamIndex + 1,
          position: positionName
        };
      }
    });
  });

  const currTeamColors = _.get(teams, [teamIndex, 'colors', activePosition], []);
  if (_.includes(currTeamColors, color)) {
    result = null;
  }

  return result;
}
