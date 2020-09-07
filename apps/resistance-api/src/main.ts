import { Server } from 'boardgame.io/server';
import { Game } from '@wlr/resistance/game';

const server = Server({
  games: [Game],
});

server.run(8000);
