// This could probably be replaced with Reselect (https://github.com/reduxjs/reselect) or similar

const phaseInfo = (phaseIndex: number) => {
  const EQ = (n: number): boolean => phaseIndex === n;
  const GE = (n: number): boolean => phaseIndex >= n;
  const LE = (n: number): boolean => phaseIndex <= n;

  return {
    index: phaseIndex,

    isUntapStep: EQ(0),
    isUpkeepStep: EQ(1),
    isDrawStep: EQ(2),

    isPreCombatMain: EQ(3),

    isCombatBeginningStep: EQ(4),
    isCombatDeclareAttackersStep: EQ(5),
    isCombatDeclareBlockersStep: EQ(6),
    isCombatDamageFirstAndDoubleStrikeStep: EQ(7),
    isCombatDamageMainStep: EQ(8),
    isCombatEndStep: EQ(9),

    isPostCombatMain: EQ(10),

    isEndOfTurnStep: EQ(11),
    isCleanupStep: EQ(12),

    isBeginningPhase: LE(2),
    isMainPhase: EQ(3) || EQ(10),
    isMainStep: EQ(3) || EQ(10),
    isCombatPhase: GE(4) && LE(9),
    isEndingPhase: GE(11)
  };
};

export type PhaseInfo = ReturnType<typeof phaseInfo>;

export default phaseInfo;
