import React from 'react';
import { Player } from '@wlr/resistance/game';

export type Selection = {
  playerID: number
}[];

interface BuildTeamProps {
  players: Record<number, Player>,
  teamSize: number;
  onSelection: (selection: Selection) => void;
}

interface NormalizedPlayers {
  ids: number[];
  entities: Record<number, {
    playerID: number;
    playerName: string;
    isChecked: boolean;
  }>;
}

const normalizePlayers = (players: Record<number, Player>) => {
  const ids = Object.keys(players).map(Number);
  const entities = ids.map(id => players[id]).reduce((acc, player) => ({ ...acc, [player.playerID]: { ...player, isChecked: false } }), {})
  return {
    ids,
    entities
  }
}

export const BuildTeam: React.FC<BuildTeamProps> = ({ players, teamSize, onSelection }) => {
  const [playerState, setPlayerState] = React.useState<NormalizedPlayers>(normalizePlayers(players));

  const submitHandler = () => {
    const selection = playerState.ids
      .map(id => playerState.entities[id])
      .filter(player => player.isChecked)
      .map(player => ({ playerID: player.playerID }));
    onSelection(selection);
  }

  const checkboxHandler = (playerID: number) => {
    setPlayerState(state => ({
      ...state,
      entities: {
        ...state.entities,
        [playerID]: {
          ...state.entities[playerID],
          isChecked: !state.entities[playerID].isChecked
        }
      }
    }))
  }

  return (
    <>
      {playerState.ids.map(id => playerState.entities[id]).map(player => (
        <label>
          {player.playerName}
          <input type='checkbox' checked={player.isChecked} onClick={() => checkboxHandler(player.playerID)} />
        </label>
      ))}
      <button onClick={submitHandler}>Submit</button>
    </>
  )
}
