import * as React from 'react';
import { connect } from 'react-redux';
import { GameState, GameStateActions } from '../../../redux/game-state/types';
import getPhaseInfo, {
  StepInfo
} from '../../../redux/game-state/transformers/step-transformer';
import { advancePhaseAction } from '../../../redux/game-state/actions';
import * as styles from './PhaseAdapter.scss';
import * as classnames from 'classnames/bind';
import { hasCreaturesToAttackWith } from '../../../redux/game-state/selectors';
const css = classnames.bind(styles);

type StateProps = {
  phaseInfo: StepInfo;
  canEnterCombat: boolean;
  canChangePhase: boolean;
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

  return (
    <span className={css({ activeStep: isActiveStep })} key={step.stepIndex}>
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
  disable?: boolean;
}) => JSX.Element;

const PhaseBase: IPhaseBase = (currentStepIndex, currentPhaseIndex) => ({
  name,
  phaseEntry,
  showSteps,
  disable = false
}) => {
  const isActivePhase = currentPhaseIndex === phaseEntry.phaseIndex;
  return (
    <span className={css('phase', { activePhase: isActivePhase, disable })}>
      {`${name}: `}
      {showSteps && phaseEntry.steps.map(renderStep(currentStepIndex))}
    </span>
  );
};

const PhaseAdapter: React.FunctionComponent<Props> = ({
  phaseInfo,
  advancePhase,
  canEnterCombat,
  canChangePhase
}) => {
  const Phase = PhaseBase(phaseInfo.stepIndex, phaseInfo.phaseIndex);
  return (
    <div>
      <button onClick={advancePhase} disabled={!canChangePhase}>
        Next phase
      </button>
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
        disable={!canEnterCombat}
      />
      <Phase
        name="post combat main"
        phaseEntry={stepStructure.postCombat}
        showSteps={phaseInfo.isPostCombatMain}
        disable={!canEnterCombat}
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
  canChangePhase: state.stack.length === 0,
  canEnterCombat: hasCreaturesToAttackWith(state),
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
