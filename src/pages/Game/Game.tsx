import React from 'react';
import { Card } from '../../components'

const COINS = 'coins';
const SWORDS = 'swords';
const CLUBS = 'clubs';
const COUPS = 'coups';

const suits = [COINS, SWORDS, CLUBS, COUPS];

const generateCards = (num: number) => {
  const nums: number[] = []
  return [...Array(num).keys()].map((i) => {
    let n;
    do {
      n = Math.floor(Math.random() * 40);
    } while(nums.includes(n))
    nums.push(n);
    const suit = suits[Math.floor(n / 10)];
    const num = (n % 10) + 1;
    return new CCard(num < 8 ? num : num + 2, suit)
  });
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

  get weigth() {
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

  }
}

class CPlayer {
  constructor(public n: number) {

  }
}

class CGame {
  constructor(players: number) {
    const cards = generateCards(3 * players);
  }
}

export const Game = () => {
  const cards = generateCards(6);

  cards.forEach((card) => {
    console.log(card)
  });

  return (
    <div>
      <h2>Welcome to Truco</h2>
      {cards.map((card) => (
        <Card number={card.number} suits={card.suit} />
      ))}
    </div>
  );
}
