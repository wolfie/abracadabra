import * as React from 'react';
import CardComponent from '../card-component/CardComponent';
import {
  Ability,
  Card,
  GameStateActions,
  Permanent
} from '../../../redux/game-state/types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { activateAbilityAction } from '../../../redux/game-state/actions';

type DispatchProps = {
  activateAbility: (permanentId: number, abilityId: number) => unknown;
};
type NativeProps = { permanent: Permanent };
type Props = DispatchProps & NativeProps;

const PermanentAdapter: React.FunctionComponent<Props> = ({
  activateAbility,
  permanent
}) => {
  const isClickable = Ability.hasLegalAbilities(permanent);

  const chooseAbility = () => {
    switch (permanent.activatedAbilities.length) {
      case 0:
        return;
      case 1:
        return activateAbility(permanent.id, 0);
      default:
        // todo: Open some kind of dialogue
        return window.alert('too many actions to handle!');
    }
  };

  const ifIsClickable = (fn: () => unknown) => (isClickable ? fn : () => {});

  return (
    <CardComponent
      color={Card.getColor(permanent)}
      isClickable={isClickable}
      name={permanent.name}
      isTapped={permanent.isTapped}
      onClick={ifIsClickable(chooseAbility)}
      typeInfo={permanent.typeInfo}
    />
  );
};

const mapDispatchToProps = (
  dispatch: Dispatch<GameStateActions>
): DispatchProps => ({
  activateAbility: (permanentId, abilityId) =>
    dispatch(activateAbilityAction(permanentId, abilityId))
});

export default connect(
  null,
  mapDispatchToProps
)(PermanentAdapter);
