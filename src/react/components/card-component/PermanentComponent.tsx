import * as React from 'react';
import * as styles from './PermanentComponent.scss';
import * as classnames from 'classnames/bind';
const css = classnames.bind(styles);

export interface CardProps {
  isTapped?: boolean;
  name?: string;
  isClickable?: boolean;
  onClick: () => any;
  highlight?: boolean;
}

const CardComponent: React.FunctionComponent<CardProps> = props => {
  const {
    isTapped = false,
    name = '',
    isClickable = false,
    onClick,
    highlight = false
  } = props;
  return (
    <div
      onClick={onClick}
      className={css('card', {
        highlight,
        isClickable,
        isTapped
      })}
    >
      <div className={css('nameplate')}>{name || <>&nbsp;</>}</div>
    </div>
  );
};

export default CardComponent;
