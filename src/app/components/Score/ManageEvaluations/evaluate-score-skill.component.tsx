import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Material UI
import Box from '@material-ui/core/Box';

interface IScoreItem {
  active?: boolean;
}

const ScoreItem = styled.div<IScoreItem>`
  padding: 2rem 1.5rem;
  line-height: 0;
  margin: 12px 4px 0;
  color: ${props => props.active ? '#fff' : '#000'};
  border-radius: 2px;
  display: inline-block;
  font-size: 18px;
  cursor: pointer;
  background: ${props => props.active ? '#BDD739' : 'transparent'};
`;

interface IEvaluateScoreSkill {
  skill: ISkill;
  score?: IScore;
  saveScore: Function;
  removeScore: Function;
}

const EvaluateScoreSkill: React.FC<IEvaluateScoreSkill> = ({
  skill,
  score,
  saveScore,
  removeScore
}) => {
  const [potentialScores, setPotentialScores] = useState<any[]>([]);
  const activeScore = score ? score.raw : "-1";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const maxScore = skill.options?.maxScore || 10;
    const minScore = skill.options?.minScore || 0;
    setPotentialScores(Array(maxScore + 1).fill(undefined).map((_, i) => String(i + minScore)));
  }, []);

  return (
    <Box display="flex">
      {potentialScores.map(scoreNum => (
        <ScoreItemComponent
          key={`${skill._id}_${scoreNum}`}
          activeScore={activeScore}
          displayScore={scoreNum}
          removeScore={() => removeScore(score?._id)}
          saveScore={saveScore}
        />
      ))}
    </Box>
  );
};

interface IScoreItemComponent {
  activeScore: string;
  displayScore: string;
  saveScore: Function;
  removeScore: Function;
}

const ScoreItemComponent: React.FC<IScoreItemComponent> = ({
  activeScore,
  displayScore,
  saveScore,
  removeScore
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(displayScore === activeScore);
  }, [activeScore]);

  return (
    <ScoreItem
      onClick={() => isActive ? removeScore() : saveScore(displayScore)}
      active={isActive}
    >{displayScore}</ScoreItem>
  )
}

export default EvaluateScoreSkill;
