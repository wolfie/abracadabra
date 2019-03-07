import * as React from "react";
import PermanentComponent from "./PermanentComponent";
import {
  Permanent,
  GameStateActions,
  Ability,
  Card
} from "../../../redux/game-state/types";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { activateAbility } from "../../../redux/game-state/actions";

type DispatchProps = {
  activateAbility: (ability: number) => unknown;
};

type NativeProps = {
  permanent: Permanent;
};

type Props = DispatchProps & NativeProps;

const activateAbilityMaybe = (
  permanent: Permanent,
  activateAbility: (ability: number) => unknown
) => {
  switch (permanent.abilities.length) {
    case 0:
      return;
    case 1:
      return activateAbility(0);
    default:
      return window.alert("too many actions to handle!");
  }
};

const PermanentAdapter: React.FunctionComponent<Props> = ({
  activateAbility,
  permanent
}) => {
  const isClickable = Ability.hasLegalAbilities(permanent);

  const onClickHandler = () => {
    if (!isClickable) return;

    activateAbilityMaybe(permanent, activateAbility);
  };

  return (
    <PermanentComponent
      color={Card.getColor(permanent)}
      isClickable={isClickable}
      name={permanent.name}
      isTapped={permanent.isTapped}
      onClick={onClickHandler}
    />
  );
};

const mapDispatchToProps: (...x: any) => DispatchProps = (
  dispatch: Dispatch<GameStateActions>,
  { permanent: { id } }: Props
) => ({
  activateAbility: (ability: number) => dispatch(activateAbility(id, ability))
});

export default connect(
  null,
  mapDispatchToProps
)(PermanentAdapter);
