import * as React from 'react';
import { connect } from 'react-redux';
import {
  Card,
  GameState,
  GameStateActions
} from '../../../redux/game-state/types';
import CardComponent from '../card-component/CardComponent';
import CardstackComponent from '../card-stack-component/CardstackComponent';
import { Dispatch } from 'redux';
import { popStackAction } from '../../../redux/game-state/actions';

type StateProps = { stack: Card[] };
type DispatchProps = { popStack: () => unknown };
type Props = StateProps & DispatchProps;

const StackAdapter: React.FunctionComponent<Props> = ({ stack, popStack }) => {
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
      <button onClick={popStack}>Resolve next on stack</button>
    </>
  ) : null;
};

const mapStateToProps = (state: GameState): StateProps => ({
  stack: state.stack
});

const mapDispatchToProps = (
  dispatch: Dispatch<GameStateActions>
): DispatchProps => ({
  popStack: () => dispatch(popStackAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StackAdapter);
