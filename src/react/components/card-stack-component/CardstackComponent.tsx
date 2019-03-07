import * as React from 'react';
import * as classnames from 'classnames/bind';
import * as styles from './CardstackComponent.scss';

const css = classnames.bind(styles);

export interface CardStackProps {}

const getStyle: any = (props: any) => ({
  '--cards': React.Children.count(props.children)
});

const CardstackComponent: React.FunctionComponent<CardStackProps> = props => (
  <div style={getStyle(props)} className={css('cardstackcomponent')}>
    {React.Children.map(props.children, (child, i) => {
      const childStyle: any = { '--index': i };
      return <div style={childStyle}>{child}</div>;
    })}
  </div>
);

export default CardstackComponent;
