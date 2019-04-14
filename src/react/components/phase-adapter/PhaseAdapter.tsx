import * as React from 'react';
import { connect } from 'react-redux';
import { GameState, GameStateActions } from '../../../redux/game-state/types';
import getPhaseInfo, {
  PhaseInfo
} from '../../../redux/game-state/transformers/phase-transformer';
import { advancePhaseAction } from '../../../redux/game-state/actions';

type StateProps = {
  phaseInfo: PhaseInfo;
};

type DispatchProps = {
  advancePhase: () => void;
};

type Props = StateProps & DispatchProps;

type StepEntry = { stepIndex: number; name: string };

const stepStructure: {
  [phase: string]: StepEntry[];
} = {
  beginning: [
    { stepIndex: 0, name: 'untap' },
    { stepIndex: 1, name: 'upkeep' },
    { stepIndex: 2, name: 'draw' }
  ],
  preCombat: [{ stepIndex: 3, name: 'main' }],
  combat: [
    { stepIndex: 4, name: 'beginning' },
    { stepIndex: 5, name: 'declare attackers' },
    { stepIndex: 6, name: 'declare blockers' },
    { stepIndex: 7, name: 'damage' },
    { stepIndex: 8, name: 'damage' },
    { stepIndex: 9, name: 'end' }
  ],
  postCombat: [{ stepIndex: 10, name: 'main' }],
  ending: [{ stepIndex: 11, name: 'end' }, { stepIndex: 12, name: 'cleanup' }]
};

const PhaseBase = (currentStepIndex: number) => ({
  name,
  steps,
  showSteps
}: {
  name: string;
  steps: StepEntry[];
  showSteps: boolean;
}) => {
  return (
    <span style={{ border: '1px solid black' }}>
      {`${name}: `}
      {showSteps &&
        steps.map(step => (
          <span
            style={
              currentStepIndex === step.stepIndex
                ? { fontWeight: 'bold' }
                : undefined
            }
          >
            {step.name}
          </span>
        ))}
    </span>
  );
};

const PhaseAdapter: React.FunctionComponent<Props> = ({
  phaseInfo,
  advancePhase
}) => {
  const Phase = PhaseBase(phaseInfo.index);
  return (
    <div>
      <button onClick={advancePhase}>Next phase</button>
      <Phase
        name="beginning"
        steps={stepStructure.beginning}
        showSteps={phaseInfo.isBeginningPhase}
      />
      <Phase
        name="pre combat main"
        steps={stepStructure.preCombat}
        showSteps={phaseInfo.isPreCombatMain}
      />
      <Phase
        name="combat"
        steps={stepStructure.combat}
        showSteps={phaseInfo.isCombatPhase}
      />
      <Phase
        name="post combat main"
        steps={stepStructure.postCombat}
        showSteps={phaseInfo.isPostCombatMain}
      />
      <Phase
        name="end"
        steps={stepStructure.ending}
        showSteps={phaseInfo.isEndingPhase}
      />
    </div>
  );
};

const mapStateToProps = (state: GameState): StateProps => ({
  phaseInfo: getPhaseInfo(state.currentPhase)
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
