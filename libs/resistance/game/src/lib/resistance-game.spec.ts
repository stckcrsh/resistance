import { Client } from 'boardgame.io/client';
import { Local } from 'boardgame.io/multiplayer';
import { Game } from './resistance-game';

describe('resistanceGame', () => {
  it('multiplayer test', () => {
    const spec = {
      game: Game,
      multiplayer: Local(),
    };

    const p0 = Client({ ...spec, playerID: '0' });
    const p1 = Client({ ...spec });

    p0.start();
    expect(p0.getState()).toMatchSnapshot();
  });
});

