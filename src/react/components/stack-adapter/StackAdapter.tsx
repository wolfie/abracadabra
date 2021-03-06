import * as React from 'react';
import { connect } from 'react-redux';
import {
  AnAmountOfManaOrGeneric,
  Card,
  GameState,
  GameStateActions
} from '../../../redux/game-state/types';
import CardComponent from '../card-component/CardComponent';
import CardstackComponent from '../card-stack-component/CardstackComponent';
import { Dispatch } from 'redux';
import {
  cancelLastActionAction,
  popStackAction
} from '../../../redux/game-state/actions';
import { isEmpty } from '../../../redux/util';

type StateProps = {
  stack: Card[];
  owedMana: AnAmountOfManaOrGeneric;
  canCancelAction: boolean;
};
type DispatchProps = { popStack: () => unknown; cancel: () => unknown };
type Props = StateProps & DispatchProps;

const StackAdapter: React.FunctionComponent<Props> = ({
  stack,
  popStack,
  cancel,
  owedMana
}) => {
  return stack.length > 0 ? (
    <>
      <h1>Stack</h1>
      <CardstackComponent>
        {stack.map(card => (
          <CardComponent
            key={card.id}
            isClickable={false}
            color={Card.getColor(card)}
            typeInfo={card.typeInfo}
            name={card.name}
          />
        ))}
      </CardstackComponent>
      {isEmpty(owedMana) ? (
        <button onClick={popStack}>Resolve next on stack</button>
      ) : (
        <div>Can't resolve next on stack, pay mana cost first!</div>
      )}
      <button onClick={cancel}>Cancel</button>
    </>
  ) : null;
};

const mapStateToProps = (state: GameState): StateProps => ({
  stack: state.stack,
  owedMana: state.owedMana,
  canCancelAction: state.stateBackup !== undefined
});

const mapDispatchToProps = (
  dispatch: Dispatch<GameStateActions>
): DispatchProps => ({
  popStack: () => dispatch(popStackAction()),
  cancel: () => dispatch(cancelLastActionAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StackAdapter);
