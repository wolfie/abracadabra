import 'jest';
import { Card, ManaPool, ActivationCost } from './types';

const cardWithCost = (castingCost: Partial<ManaPool>): Card => ({
  ...Card.NULL,
  castingCost
});

describe('Card', () => {
  describe('getColor', () => {
    it('nothing = is colorless', () => {
      expect(Card.getColor(cardWithCost({}))).toEqual(['c']);
    });

    it('colorless = colorless', () => {
      expect(Card.getColor(cardWithCost({ c: 1 }))).toEqual(['c']);
    });

    it('no red = colorless', () => {
      expect(Card.getColor(cardWithCost({ r: 0 }))).toEqual(['c']);
    });

    it('red = red', () => {
      expect(Card.getColor(cardWithCost({ r: 1 }))).toEqual(['r']);
    });

    it('red+colorless = red', () => {
      expect(Card.getColor(cardWithCost({ r: 1, c: 1 }))).toEqual(['r']);
    });

    it('red+blue = red+blue', () => {
      expect(Card.getColor(cardWithCost({ r: 1, u: 1 }))).toEqual(['r', 'u']);
    });
  });
});

describe('ActivationCost', () => {
  describe('isEmpty', () => {
    it('true when no mana and tapSelf is false', () => {
      expect(ActivationCost.isEmpty(ActivationCost.NULL)).toBe(true);
    });

    it('false when tapSelf is true', () => {
      const withTap = { ...ActivationCost.NULL, tapSelf: true };
      expect(ActivationCost.isEmpty(withTap)).toBe(false);
    });

    it('false when a mana value is not zero', () => {
      const withBlack = { ...ActivationCost.NULL, b: 1 };
      expect(ActivationCost.isEmpty(withBlack)).toBe(false);
    });
  });
});

describe('ManaPool', () => {
  describe('Add', () => {
    it('does nothing when adding an empty object', () => {
      expect(ManaPool.Add(ManaPool.NULL, {})).toMatchObject(ManaPool.NULL);
    });
  });
});
