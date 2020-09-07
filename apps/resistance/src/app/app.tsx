import React from 'react';
import { Client } from 'boardgame.io/react';
import { LobbyClient } from 'boardgame.io/client';
import { SocketIO, Local } from 'boardgame.io/multiplayer'
import { Game } from '@wlr/resistance/game';
import { BuildTeam } from './build-team';
import { Board } from './board';

let multiplayer = SocketIO({ server: 'http://localhost:8000' });
// let multiplayer = Local();
// if (process.env.NODE_ENV === 'development') {
//   multiplayer = Local()
// } else {
//   multiplayer =
// }

const ResistanceClient = Client({
  game: Game,
  board: Board,
  multiplayer
});

// const lobbyClient = new LobbyClient({
//   server: 'http://localhost:8000'

// })

const App = () => {

  return (
    <div>
      <ResistanceClient
        matchID='lyEJpKtss'
        playerID='0'></ResistanceClient>
    </div>
  )
}

export default App;
