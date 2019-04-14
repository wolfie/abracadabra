import * as React from 'react';
import BattlefieldAdapter from './components/battlefield-adapter/BattlefieldAdapter';
import HandAdapter from './components/hand-adapter/HandAdapter';
import ManaPoolAdapter from './components/manapool-adapter/ManaPoolAdapter';
import StackAdapter from './components/stack-adapter/StackAdapter';
import PhaseAdapter from './components/phase-adapter/PhaseAdapter';

const Game: React.FunctionComponent<{}> = () => (
  <>
    <PhaseAdapter />
    <ManaPoolAdapter />
    <BattlefieldAdapter />
    <StackAdapter />
    <HandAdapter />
  </>
);

export default Game;
