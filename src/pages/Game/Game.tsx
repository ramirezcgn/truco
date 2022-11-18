import React from 'react';
import { Card } from '../../components'

const COINS = 'coins';
const SWORDS = 'swords';
const CLUBS = 'clubs';
const COUPS = 'coups';

const suits = [COINS, SWORDS, CLUBS, COUPS];
const numbers = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

const generateCards = () => {
  const cards = []
  for (const i of suits) {
    for (const j of numbers) {
      cards.push(new CCard(j, i));
    }
  }
  for (let i = 0; i < cards.length; i++) {
    const j = Math.floor(Math.random() * (cards.length - i)) + i;
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

class CCard {
  n: number;
  s: string;

  constructor(number: number, suit: string) {
    this.n = number;
    this.s = suit;
  }

  get number() {
    return this.n;
  }

  get suit() {
    return this.s;
  }

  get weight() {
    if (this.n > 3) {
      if (this.n === 7) {
        if (this.s === COINS) {
          return 16;
        }
        if (this.s === SWORDS) {
          return 17;
        }
      }
      return this.n;
    }
    if (this.n === 1) {
      if (this.s === CLUBS) {
        return 18;
      }
      if (this.s === SWORDS) {
        return 19;
      }
      return 13;
    }
    if (this.n === 2) {
      return 14;
    }
    if (this.n === 3) {
      return 15;
    }
  }
}

class CHand {
  constructor(public n: number,) {
    const cards = generateCards();
  }
}

class CPlayer {
  constructor(public n: number) {

  }
}

class CGame {
  constructor(players: number) {
  }
}

export const Game = () => {
  const cards = generateCards();

  return (
    <div>
      <h2>Welcome to Truco</h2>
      {cards.splice(0, 3).map((card) => (
        <Card number={card.number} suits={card.suit} />
      ))}
    </div>
  );
}
