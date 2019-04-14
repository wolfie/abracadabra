// This could probably be replaced with Reselect (https://github.com/reduxjs/reselect) or similar

const BEGINNING = 0;
const MAIN_PRE = 1;
const COMBAT = 2;
const MAIN_POST = 3;
const ENDING = 4;

const getPhaseIndex = (stepIndex: number) =>
  stepIndex < 3
    ? BEGINNING
    : stepIndex < 4
    ? MAIN_PRE
    : stepIndex < 10
    ? COMBAT
    : stepIndex < 11
    ? MAIN_POST
    : ENDING;

const stepInfo = (stepIndex: number) => {
  const _ = (n: number): boolean => stepIndex === n;

  const phaseIndex = getPhaseIndex(stepIndex);

  return {
    stepIndex,
    phaseIndex,

    isUntapStep: _(0),
    isUpkeepStep: _(1),
    isDrawStep: _(2),

    isPreCombatMain: _(3),

    isCombatBeginningStep: _(4),
    isCombatDeclareAttackersStep: _(5),
    isCombatDeclareBlockersStep: _(6),
    isCombatDamageFirstAndDoubleStrikeStep: _(7),
    isCombatDamageMainStep: _(8),
    isCombatEndStep: _(9),

    isPostCombatMain: _(10),

    isEndOfTurnStep: _(11),
    isCleanupStep: _(12),

    isBeginningPhase: phaseIndex === BEGINNING,
    isMainPhase: phaseIndex === MAIN_PRE || phaseIndex === MAIN_POST,
    isMainStep: phaseIndex === MAIN_PRE || phaseIndex === MAIN_POST,
    isCombatPhase: phaseIndex === COMBAT,
    isEndingPhase: phaseIndex === ENDING
  };
};

export type StepInfo = ReturnType<typeof stepInfo>;

export default stepInfo;
