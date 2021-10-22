import _ from 'lodash';
import React, { useEffect, useState } from 'react';

// Components
import { DangerButton, PrimaryButton, WarnButton } from '../../_core/_ui/buttons.component';
import { SpacedRow } from '../../_core/_ui/structure.components';

interface IEvaluateTimedSkill {
  skill: ISkill;
  score?: IScore;
  saveScore: Function;
  removeScore: Function;
  roundNum: number;
  activePlayer?: IPlayerAssessment;
}

const TIMER_INTERVAL = 10;

const EvaluateTimedSkill: React.FC<IEvaluateTimedSkill> = ({
  skill,
  score,
  saveScore,
  removeScore,
  roundNum,
  activePlayer,
}) => {
  const [runningTime, setRunningTime] = useState(score ? Number(score.raw) : 0);
  const [isActive, setActive] = useState(false);
  const [isPaused, setPaused] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setRunningTime(score ? Number(score.raw) : 0);
  }, [roundNum, activePlayer && activePlayer._id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let interval: any = null; // test

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setRunningTime((time: number) => time + TIMER_INTERVAL);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused])

  const startTimer = () => {
    setPaused(false);
    setActive(true);
  }

  const saveTimer = (time: number) => {
    setActive(false);
    saveScore(time);
  }

  const stopTimer = () => {
    setPaused(true);
  }

  const clearTimer = () => {
    setActive(false);
    setRunningTime(0);
    if (score) removeScore(score._id);
  }

  const getMinutes = () => formatTime(
    Math.floor(runningTime / 60000) % 60
  );

  const getSeconds = () => formatTime(
    Math.floor(runningTime / 1000) % 60
  );

  const getHundredthSeconds = () => formatTime(
    Math.floor(runningTime / 10) % 100
  );

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time.toString();
  }

  return (
    <div>
      <div style={{ fontSize: '18px' }}>
        <span>{getMinutes()}</span>:<span>{getSeconds()}</span>:<span>{getHundredthSeconds()}</span>
      </div>

      <SpacedRow>
        <PrimaryButton
          className="btn waves-effect waves-light"
          onClick={startTimer}
          disabled={isActive && !isPaused}>
          Start
        </PrimaryButton>
        <DangerButton
          className="btn red waves-effect waves-light"
          onClick={stopTimer}
          disabled={!isActive || isPaused}>
          Stop
        </DangerButton>
        <WarnButton
          className="btn yellow darken-2 waves-effect waves-light"
          onClick={clearTimer}
          disabled={(!isPaused && isActive) || runningTime === 0}>
          Clear
        </WarnButton>
        <PrimaryButton
          className="btn green darken-2 waves-effect waves-light"
          onClick={() => saveTimer(runningTime)}
          disabled={!isActive || !isPaused || runningTime === 0}>
          Save Time
        </PrimaryButton>
      </SpacedRow>
    </div>

  );
};

export default EvaluateTimedSkill;
