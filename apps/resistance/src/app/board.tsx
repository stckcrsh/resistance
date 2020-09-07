import React, { createContext } from 'react';
import { ResistanceGame } from '@wlr/resistance/game'
import { BuildTeam } from './build-team';

export const Board: React.FC<{ G: ResistanceGame, ctx: any }> = ({ G, ctx }) => {
  console.log(G, ctx)
  const state = ctx.activePlayers[ctx.currentPlayer];
  switch (state) {
    case 'buildTeam':
      return (<BuildTeam
        onSelection={console.log}
        players={G.players}
        teamSize={G.missionPlayers[G.missionNumber]}
      />);

  }
}
