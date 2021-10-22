import React, { ReactNode, useEffect, useState } from 'react';
import _ from 'lodash';
import PlayerScores from './player-scores.component';
import { IEnhancedTableColumn, IEnhancedTableRow } from '../../_core/_ui/table.components';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {
  getHundredthSeconds,
  getMinutes,
  getSeconds,
  ReviewScoreItem
} from '../../Score/ManageEvaluations/manage-evaluations.helpers';
import TableCell from '@material-ui/core/TableCell';
import { IFormOption } from '../../_core/_ui/forms.component';
import { numToTime } from '../../../lib/helpers/conversion.helpers';

interface IPlayerScoresContainer {
  assessmentSessions: IAssessmentSession[];
  skills: ISkill[];
  drills: IDrill[];
  members: IMember[];
  scores: IScore[];
  loading: boolean;
  fetchError: boolean;
  setActiveAssessmentSessionId: Function;
}

const PlayerScoresContainer: React.FC<IPlayerScoresContainer> = ({
  assessmentSessions,
  skills,
  drills,
  members,
  scores,
  loading,
  fetchError,
  setActiveAssessmentSessionId
}) => {
  const [rows, setRows] = useState<IEnhancedTableRow[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [activeOption, setActiveOption] = useState<IFormOption>();
  const [options, setOptions] = useState<IFormOption[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setOptions(assessmentSessions.map(assessmentSession => ({
      value: assessmentSession._id,
      label: `${assessmentSession.date} - ${numToTime(assessmentSession.start)}`
    })));
  }, [assessmentSessions.length])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextColumns: IEnhancedTableColumn[] = [];
    const nextRows: IEnhancedTableRow[] = [];
    const hasColumn: { [key: string]: boolean } = {};
    const scoreHash: { [key: string]: { [key: string]: { [key: string]: { [key: number]: IScore } } } } = {};

    const skillsById = _.keyBy(skills, '_id');
    const drillsById = _.keyBy(drills, '_id');
    const usersById = _.keyBy(_.map(members, 'user'), '_id');
    console.log(members);

    _.each(scores, score => {
      _.set(scoreHash, [score.drillId, score.userId, score.skillId, score.round], score);
    });

    let userList: string[] = [];
    let maxUsers = 0;
    _.each(scoreHash, (userScoreHash, drillId) => {
      userList = userList.concat(_.keys(userScoreHash));
    });

    userList = _.uniq(userList);
    maxUsers = userList.length;

    nextColumns.push({ key: 'drillId', label: 'Drill' });

    const userColumnHash: { [key: string]: number } = {};

    _.each(scoreHash, (userScoreHash, drillId) => {
      const drill = drillsById[drillId];
      const eleUsers: ReactNode[] = [];

      for (let i = 0; i < maxUsers; i += 1) {
        eleUsers.push(<TableCell key={i} />);
      }

      _.each(userScoreHash, (skillScoreHash, userId) => {
        const user = usersById[userId];

        if (!hasColumn[userId]) {
          nextColumns.push({key: userId, label: user?.name});
          hasColumn[userId] = true;
          if (!userColumnHash[userId]) {
            userColumnHash[userId] = nextColumns.length - 2;
          }
        }

        const results = _.map(skillScoreHash, (roundScores, skillId) => (
          <Box key={skillId}>
            <Typography>{skillsById[skillId].name}</Typography>
            <Box>
              {_.map(roundScores, (score: IScore, roundNum) => {
                if (!score) return <React.Fragment key={roundNum} />;
                const currScore = Number(score.raw);

                switch (score.type) {
                  case 'TIME':
                    return <ReviewScoreItem key={roundNum}><span>{getMinutes(currScore)}</span>:<span>{getSeconds(currScore)}</span>:<span>{getHundredthSeconds(currScore)}</span></ReviewScoreItem>
                  default:
                    return <ReviewScoreItem key={roundNum}>{score.raw}</ReviewScoreItem>
                }
              })}
            </Box>
          </Box>
        ));

        eleUsers[userColumnHash[userId]] = <TableCell key={user?._id}>{results.length ? results : '-'}</TableCell>;
      });

      nextRows.push({
        _id: drill._id,
        data: { _id: drill._id },
        cells: [
          <TableCell key="user">
            {drill.name}
          </TableCell>,
          ...eleUsers
        ]
      });
    });

    setRows(nextRows);
    setColumns(nextColumns);
  }, [scores.length]);

  const onChangeAssessmentSession = (option: IFormOption) => {
    setActiveAssessmentSessionId(option.value);
    setActiveOption(option);
  };

  return <PlayerScores
    activeOption={activeOption}
    setOption={onChangeAssessmentSession}
    options={options}
    columns={columns}
    rows={rows}
  />;
};

export default PlayerScoresContainer;
