import * as React from 'react';
import { connect } from 'react-redux';
import { GameState, GameStateActions } from '../../../redux/game-state/types';
import getPhaseInfo, {
  StepInfo
} from '../../../redux/game-state/transformers/phase-transformer';
import { advancePhaseAction } from '../../../redux/game-state/actions';
import * as styles from './PhaseAdapter.scss';
import * as classnames from 'classnames/bind';
const css = classnames.bind(styles);

type StateProps = {
  phaseInfo: StepInfo;
};

type DispatchProps = {
  advancePhase: () => void;
};

type Props = StateProps & DispatchProps;

type PhaseEntry = { phaseIndex: number; steps: StepEntry[] };
type StepEntry = { stepIndex: number; name: string };

const stepStructure: {
  [phase: string]: { phaseIndex: number; steps: StepEntry[] };
} = {
  beginning: {
    phaseIndex: 0,
    steps: [
      { stepIndex: 0, name: 'untap' },
      { stepIndex: 1, name: 'upkeep' },
      { stepIndex: 2, name: 'draw' }
    ]
  },
  preCombat: { phaseIndex: 1, steps: [{ stepIndex: 3, name: 'main' }] },
  combat: {
    phaseIndex: 2,
    steps: [
      { stepIndex: 4, name: 'beginning' },
      { stepIndex: 5, name: 'declare attackers' },
      { stepIndex: 6, name: 'declare blockers' },
      { stepIndex: 7, name: 'damage' },
      { stepIndex: 8, name: 'damage' },
      { stepIndex: 9, name: 'end' }
    ]
  },
  postCombat: { phaseIndex: 3, steps: [{ stepIndex: 10, name: 'main' }] },
  ending: {
    phaseIndex: 4,
    steps: [{ stepIndex: 11, name: 'end' }, { stepIndex: 12, name: 'cleanup' }]
  }
};

const renderStep = (currentStepIndex: number) => (step: StepEntry) => {
  const isActiveStep = currentStepIndex === step.stepIndex;
  const style: React.CSSProperties | undefined = isActiveStep
    ? { fontWeight: 'bold' }
    : undefined;

  return (
    <span
      className={css({ activeStep: isActiveStep })}
      key={step.stepIndex}
      style={style}
    >
      [{step.name}]
    </span>
  );
};

type IPhaseBase = (
  currentStepIndex: number,
  currentPhaseIndex: number
) => (props: {
  name: string;
  phaseEntry: PhaseEntry;
  showSteps: boolean;
}) => JSX.Element;

const PhaseBase: IPhaseBase = (currentStepIndex, currentPhaseIndex) => ({
  name,
  phaseEntry,
  showSteps
}) => {
  const isActivePhase = currentPhaseIndex === phaseEntry.phaseIndex;
  return (
    <span className={css('phase', { activePhase: isActivePhase })}>
      {`${name}: `}
      {showSteps && phaseEntry.steps.map(renderStep(currentStepIndex))}
    </span>
  );
};

const PhaseAdapter: React.FunctionComponent<Props> = ({
  phaseInfo,
  advancePhase
}) => {
  const Phase = PhaseBase(phaseInfo.stepIndex, phaseInfo.phaseIndex);
  return (
    <div>
      <button onClick={advancePhase}>Next phase</button>
      <Phase
        name="beginning"
        phaseEntry={stepStructure.beginning}
        showSteps={phaseInfo.isBeginningPhase}
      />
      <Phase
        name="pre combat main"
        phaseEntry={stepStructure.preCombat}
        showSteps={phaseInfo.isPreCombatMain}
      />
      <Phase
        name="combat"
        phaseEntry={stepStructure.combat}
        showSteps={phaseInfo.isCombatPhase}
      />
      <Phase
        name="post combat main"
        phaseEntry={stepStructure.postCombat}
        showSteps={phaseInfo.isPostCombatMain}
      />
      <Phase
        name="end"
        phaseEntry={stepStructure.ending}
        showSteps={phaseInfo.isEndingPhase}
      />
    </div>
  );
};

const mapStateToProps = (state: GameState): StateProps => ({
  phaseInfo: getPhaseInfo(state.currentStep)
});

const mapDispatchToProps = (
  dispatch: React.Dispatch<GameStateActions>
): DispatchProps => ({
  advancePhase: () => dispatch(advancePhaseAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhaseAdapter);
