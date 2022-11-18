import React from 'react';
import { Card } from '../../components'

const suits = ['coins', 'swords', 'clubs', 'coups'];

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
}

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
