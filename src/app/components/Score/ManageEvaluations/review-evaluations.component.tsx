import _ from 'lodash';
import React, { useEffect, useState } from 'react';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';

// Components
import { EnhancedTable, IEnhancedTableRow } from '../../_core/_ui/table.components';
import { JerseyIcon } from '../../Session/CheckIn/check-in.helpers';
import { getHundredthSeconds, getMinutes, getSeconds, ReviewScoreItem } from './manage-evaluations.helpers';

interface IReviewEvaluations {
  players: IPlayerAssessment[];
  jerseys: { [key: string]: IJersey };
  drills: IDrill[];
  scoreHash: { [key: string]: { [key: string]: { [key: string]: { [key: number]: IScore } } } };
  setActivePlayer: Function;
  setActiveDrill: Function;
  setActiveRound: Function;
  setShowReview: Function;
}

const ReviewEvaluations: React.FC<IReviewEvaluations> = ({
  players,
  jerseys,
  drills,
  scoreHash,
  setActivePlayer,
  setActiveDrill,
  setActiveRound,
  setShowReview
}) => {
  const [skillsById, setSkillsById] = useState<{ [key: string]: ISkill }>({});
  const [rows, setRows] = useState<IEnhancedTableRow[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const skills = _.reduce(drills, (result: ISkill[], drill: IDrill) => {
      const skillsBySkillSet = _.map(drill.skillSets, skillSet => skillSet.skills || []);
      result = result.concat(_.flatten(skillsBySkillSet));

      return result;
    }, []);

    setSkillsById(_.keyBy(skills, '_id'));
  }, [drills.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (_.keys(skillsById).length) {
      const hasDrill: { [key: string]: boolean } = {};
      const nextRows: IEnhancedTableRow[] = [];
      const nextColumns = [
        { key: 'jersey', disablePadding: true, label: 'Player' },
      ];

      _.each(players, (player: IPlayerAssessment) => {
        const jersey = jerseys[player._id];
        const data: { [key: string]: string } = {
          player: `${jersey.color}-${jersey.number}`
        };

        const eleDrills = drills.map(drill => {
          if (!hasDrill[drill._id]) {
            nextColumns.push({
              key: drill._id,
              disablePadding: true,
              label: drill.name
            });

            data[drill._id] = drill.name;
            hasDrill[drill._id] = true;
          }

          const skillScores = _.get(scoreHash, [player._id, drill._id], {});
          const results = _.map(skillScores, (roundScores, skillId) => (
            <Box key={skillId}>
              <Typography>{skillsById[skillId].name}</Typography>
              <Box>
                {_.map(roundScores, (score: IScore, roundNum) => {
                  if (!score) return <React.Fragment key={roundNum}></React.Fragment>;
                  const currScore = Number(score.raw);
                  const editScore = () => {
                    setActivePlayer(player);
                    setActiveDrill(drill);
                    setActiveRound(roundNum);
                    setShowReview(false);
                  };

                  switch (score.type) {
                    case 'TIME':
                      return <ReviewScoreItem key={roundNum} onClick={editScore}><span>{getMinutes(currScore)}</span>:<span>{getSeconds(currScore)}</span>:<span>{getHundredthSeconds(currScore)}</span></ReviewScoreItem>
                    default:
                      return <ReviewScoreItem key={roundNum} onClick={editScore}>{score.raw}</ReviewScoreItem>
                  }
                })}
              </Box>
            </Box>
          ));

          return <TableCell key={drill._id}>{results.length ? results : '-'}</TableCell>
        });

        nextRows.push({
          _id: player._id,
          data,
          cells: [
            <TableCell key="jersey">
              <JerseyIcon color={jerseys[player._id]?.color}>{jerseys[player._id]?.number}</JerseyIcon>
            </TableCell>,
            ...eleDrills
          ]
        });
      });

      setRows(nextRows);
      setColumns(nextColumns);
    }
  }, [players.length, _.keys(skillsById).length]);

  return (
    <EnhancedTable
      numCols={columns.length}
      columns={columns}
      rows={rows}
      defaultOrder="jerseyNum"
      disableSelect
    />
  );
};

export default ReviewEvaluations;
