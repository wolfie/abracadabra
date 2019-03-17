import * as React from 'react';
import * as styles from './CardComponent.scss';
import * as classnames from 'classnames/bind';
import { CardTypeInfo, ManaColor } from '../../../redux/game-state/types';

const css = classnames.bind(styles);

export interface Props {
  isTapped?: boolean;
  name: string;
  isClickable?: boolean;
  onClick?: (...args: any) => any;
  highlight?: boolean;
  color: ManaColor[];
  typeInfo: CardTypeInfo;
}

const getTypeLine = ({ superType, types }: CardTypeInfo) =>
  (superType ? `${superType} ` : '') + types.join(' ');

const CardComponent: React.FunctionComponent<Props> = ({
  isTapped = false,
  name,
  isClickable = false,
  onClick = () => {},
  color,
  typeInfo
}) => {
  const isColor = (queryColor: ManaColor): boolean =>
    color.indexOf(queryColor) !== -1;

  const ifIsClickable = (fn: () => any) => (isClickable ? fn : () => {});

  return (
    <div
      onClick={ifIsClickable(onClick)}
      className={css('card', {
        black: isColor('b'),
        blue: isColor('u'),
        green: isColor('g'),
        red: isColor('r'),
        white: isColor('w'),
        colorless: isColor('c'),
        isClickable,
        isTapped
      })}
    >
      <div className={css('nameplate')}>{name || <>&nbsp;</>}</div>
      <div className={css('typeline')}>{getTypeLine(typeInfo)}</div>
    </div>
  );
};

export default CardComponent;
