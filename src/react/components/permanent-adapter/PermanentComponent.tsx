import * as React from "react";
import * as styles from "./PermanentComponent.scss";
import * as classnames from "classnames/bind";
import { ManaPool } from "../../../redux/game-state/types";

const css = classnames.bind(styles);

export interface CardProps {
  isTapped?: boolean;
  name?: string;
  isClickable?: boolean;
  onClick: () => any;
  highlight?: boolean;
  color: (keyof ManaPool)[];
}

const CardComponent: React.FunctionComponent<CardProps> = props => {
  const {
    isTapped = false,
    name = "",
    isClickable = false,
    onClick,
    color
  } = props;

  const isColor = (queryColor: keyof ManaPool): boolean =>
    color.indexOf(queryColor) !== -1;

  return (
    <div
      onClick={onClick}
      className={css("card", {
        black: isColor("b"),
        blue: isColor("u"),
        green: isColor("g"),
        red: isColor("r"),
        white: isColor("w"),
        colorless: isColor("c"),
        isClickable,
        isTapped
      })}
    >
      <div className={css("nameplate")}>{name || <>&nbsp;</>}</div>
    </div>
  );
};

export default CardComponent;
