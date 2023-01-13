import React, { useEffect, useRef, useState, useCallback, useReducer } from 'react';
import { Card } from '../../components'

const COINS = 'coins';
const SWORDS = 'swords';
const CLUBS = 'clubs';
const COUPS = 'coups';
const TEAMS_COUNT = 2;

const suits = [COINS, SWORDS, CLUBS, COUPS];
const numbers = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

const GAME_STATUS = {
  'STARTING': 1,
  'PLAYING': 2,
  'GAMEOVER': 3,
};

interface IUUIDObject {
  getUUID: () => string;
}

const utils = {
  _findByUUId<T extends IUUIDObject>(haystack: T[], uuid: string): T | undefined {
    return haystack.find((h) => uuid === h.getUUID());
  },
}

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
    if (this.n > 3) {
      if (this.n === 7) {
        if (this.s === COINS) {
          return 16;
        }
        if (this.s === SWORDS) {
          return 17;
        }
      }
    }
    return this.n;
  }
}

class CHand {
  constructor(public n: number,) {
    const cards = generateCards();
  }
}

class CPlayer implements IUUIDObject {
  playerName: string;
  team: CTeam | null = null;
  uuid: string;
  constructor(name: string) {
    this.playerName = name;
    this.uuid = crypto.randomUUID();
  }
  getPlayerName() {
    return this.playerName;
  }
  getTeam() {
    return this.team;
  }
  getUUID() {
    return this.uuid;
  }
  setTeam(team: CTeam) {
    this.team = team;
  }
}

class CTeam implements IUUIDObject {
  players: CPlayer[] = [];
  teamName: string;
  teamSize: number;
  uuid: string;
  constructor(public name: string, public size: number) {
    this.teamName = name;
    this.teamSize = size;
    this.uuid = crypto.randomUUID();
  }
  getIsComplete() {
    return this.players.length === this.teamSize;
  }
  getPlayer(uuid: string) {
    return utils._findByUUId(this.players, uuid);
  }
  getPlayers() {
    return this.players;
  }
  getTeamName() {
    return this.teamName;
  }
  getTeamSize() {
    return this.teamSize;
  }
  getUUID() {
    return this.uuid;
  }
  addPlayer(player: CPlayer) {
    if (this.players.length < this.teamSize){
      this.players.push(player);
    } else {
      throw new Error(`${this.teamName} team size exceeded!`);
    }
  }
}

// donde están puestas las cartas que son jugadas ronda a ronda
class CTable {
  constructor(public n: number) {
  }
}

// ronda de cada vuelta
class CRound {
  constructor(public n: number) {
  }
}

class CTurn {
  constructor(public n: number) {
  }
}

class CGame {
  players: CPlayer[] = [];
  rounds: CRound[] = [];
  teams: CTeam[] = [];
  totalPlayers = 0;
  constructor(players: number) {
    this.totalPlayers = players;
  }
  getAreTeamsComplete() {
    return this.teams.every((team) => team.getIsComplete());
  }
  getPlayers() {
    return this.players;
  }
  getTeams() {
    return this.teams;
  }
  addPlayer(name: string) {
    const player = new CPlayer(name);
    this.players.push(player);
    return player;
  }
  addTeam(teamName: string) {
    if (this.teams.length < 2) {
      const team = new CTeam(teamName, this.totalPlayers / 2);
      this.teams.push(team);
      return team;
    }
    return null;
  }
  assignTeamPlayer(teamUUID: string, playerUUID: string) {
    const player = utils._findByUUId<CPlayer>(this.players, playerUUID);
    if (!player) {
      throw new Error('No such player uuid');
    }
    const team = utils._findByUUId<CTeam>(this.teams, teamUUID);
    if (!team) {
      throw new Error('No such team uuid');
    }
    team.addPlayer(player);
    player.setTeam(team);
  }
}

export const Game = () => {
  const cards = generateCards();
  const firstRun = useRef(true);
  const game: {current: CGame | null} = useRef(null);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.STARTING);
  const [players, setPlayers]: [CPlayer[], Function] = useState([]);
  const [teams, setTeams]: [CTeam[], Function] = useState([]);
  const [_, forceRender] = useReducer(Date.now, 0);

  useEffect(() => {
    if (firstRun.current) {
      const totalPlayers = prompt('Players count/total:', '2');
      if (!totalPlayers || +totalPlayers % 2 !== 0 || +totalPlayers > 6) {
        throw new Error('You MUST set a valid total players value (between 2 and 6)');
      }
      game.current = new CGame(+totalPlayers);
  
      for (let i = 0; i < TEAMS_COUNT; i++) {
        let teamName;
        do {
          teamName = prompt(`Team ${i+1} name:`);
        } while (!teamName && teamName !== null);
        if (teamName === null) {
          teamName = String.fromCharCode(65 + i);
        }
        game.current.addTeam(teamName);
      }
      setTeams(game.current.getTeams());

      for (let i = 0; i < +totalPlayers; i++) {
        let playerName;
        do {
          playerName = prompt(`Player ${i+1} name:`);
        } while (!playerName && playerName !== null);
        if (playerName === null) {
          throw new Error('Missing Player name, cancelled by user');
        }
        game.current.addPlayer(playerName);
      }
      setPlayers(game.current.getPlayers());
      firstRun.current = false;
    }
  }, []);

  const assignTeamPlayer = useCallback((teamUUID: string, playerUUID: string) => {
    const cgame = game.current;
    if (cgame){
      cgame.assignTeamPlayer(teamUUID, playerUUID);
      if (cgame.getAreTeamsComplete()) {
        setGameStatus(GAME_STATUS.PLAYING);
      }
    }
    forceRender();
  }, []);

  return (
    <div>
      <h2>Welcome to Truco 95</h2>

      {gameStatus === GAME_STATUS.STARTING && teams.map((team, i) => (
        <div key={team.getUUID()}>
          <p>{team.getTeamName()}</p>
          <div>
          {players.map((player, i) => (
            <button
              key={player.getUUID()}
              onClick={() => assignTeamPlayer(team.getUUID(), player.getUUID())}
              disabled={!!player.getTeam()}
              >
              {player.getPlayerName()}
            </button>
          ))}
          </div>
        </div>
      ))}
      {gameStatus === GAME_STATUS.PLAYING && cards.splice(0, 3).map((card) => (
        <Card number={card.number} suits={card.suit} />
      ))}
    </div>
  );
}
