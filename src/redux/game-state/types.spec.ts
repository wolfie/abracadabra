import 'jest';
import { AnAmountOfMana, Card } from './types';

const cardWithCost = (castingCost: AnAmountOfMana): Card => ({
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
