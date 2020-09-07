export const enum BOOLEAN_STATE {
  TRUE,
  FALSE,
  NA,
}

export const enum TEAM_VOTE {
  APPROVE,
  REJECT,
}

export const enum MISSION_VOTE {
  PASS,
  FAIL,
}

export interface Player {
  playerID: number;
  playerName: string;
}

export interface ResistanceGame {
  currentTurn: {
    votes: { playerId: number; vote: TEAM_VOTE }[];
    mission: { playerId: number; vote: MISSION_VOTE }[];
    team: { playerId: number }[];
    isRejected: BOOLEAN_STATE;
    isSuccess: BOOLEAN_STATE;
  };
  badGuys: number[];
  goodGuys: number[];
  missionPlayers: number[];
  turnNumber: number;
  missionNumber: number;
  rejectionCount: number;
  players: Record<number, Player>;
  history: {
    votes: { playerId: number; vote: TEAM_VOTE }[];
    mission: { playerId: number; vote: MISSION_VOTE }[];
    team: { playerId: number }[];
    isRejected: BOOLEAN_STATE;
    isSuccess: BOOLEAN_STATE;
  }[];
}

export const Game = {
  name: 'Resistance',
  setup: (ctx): ResistanceGame => ({
    currentTurn: {
      votes: [],
      mission: [],
      team: [],
      isRejected: BOOLEAN_STATE.NA,
      isSuccess: BOOLEAN_STATE.NA,
    },
    players: {},
    badGuys: [],
    goodGuys: [],
    missionPlayers: [2, 3, 2, 3, 3],
    turnNumber: 0,
    missionNumber: 0,
    rejectionCount: 0,
    history: [],
  }),
  endIf: (G: ResistanceGame, ctx) => {
    const results = G.history
      .map((turn) => turn.isSuccess)
      .filter((success) => success != BOOLEAN_STATE.NA)
      .reduce(
        (missions, success) => {
          return {
            ...missions,
            [success]: ++missions[success],
          };
        },
        {
          [BOOLEAN_STATE.TRUE]: 0,
          [BOOLEAN_STATE.FALSE]: 0,
        }
      );
    if (results[BOOLEAN_STATE.TRUE] >= 3) {
      return { winner: G.goodGuys };
    }
    if (results[BOOLEAN_STATE.FALSE] >= 3) {
      return { winner: G.badGuys };
    }
  },
  turn: {
    onBegin: (_, ctx) => {
      ctx.events.setStage('buildTeam');
    },
    onEnd: (G: ResistanceGame) => {
      G.history.push(G.currentTurn);
      G.currentTurn = {
        votes: [],
        mission: [],
        team: [],
        isRejected: BOOLEAN_STATE.NA,
        isSuccess: BOOLEAN_STATE.NA,
      };
      G.turnNumber++;
    },
    stages: {
      buildTeam: {
        moveLimit: 1,
        moves: {
          buildTeam: (
            G: ResistanceGame,
            ctx,
            players: { playerId: number; excalibur: boolean }[]
          ) => {
            G.currentTurn.team = players;

            ctx.events.endStage();
            ctx.events.setActivePlayers({
              all: 'missionTeamVote',
              moveLimit: 1,
            });
          },
        },
      },
      missionTeamVote: {
        moveLimit: 1,
        moves: {
          missionTeamVote: (G: ResistanceGame, ctx, vote: TEAM_VOTE) => {
            G.currentTurn.votes.push({ playerId: ctx.currentPlayer, vote });
            // check if its the last vote
            if (G.currentTurn.votes.length === ctx.numPlayers) {
              // check votes
              const results = G.currentTurn.votes
                .map((teamVote) => teamVote.vote)
                .reduce(
                  (votes, teamVote) => ({
                    ...votes,
                    [teamVote]: ++votes[teamVote],
                  }),
                  {
                    [TEAM_VOTE.APPROVE]: 0,
                    [TEAM_VOTE.REJECT]: 0,
                  }
                );

              if (results[TEAM_VOTE.APPROVE] >= ctx.numPlayers / 2) {
                G.currentTurn.isRejected = BOOLEAN_STATE.FALSE;
                ctx.events.endStage();
                ctx.events.setActivePlayers({
                  value: {
                    ...G.currentTurn.team.reduce(
                      (acc, member) => ({
                        ...acc,
                        [member.playerId]: 'conductMission',
                      }),
                      {}
                    ),
                  },
                  moveLimit: 1,
                });
              } else {
                G.currentTurn.isRejected = BOOLEAN_STATE.TRUE;
                G.rejectionCount++;
                ctx.events.endStage();
                ctx.events.endTurn();
              }
            }
          },
        },
      },
      conductMission: {
        moves: {
          conductMission: (G: ResistanceGame, ctx, vote: MISSION_VOTE) => {
            G.currentTurn.mission.push({ playerId: ctx.currentPlayer, vote });

            if (G.currentTurn.mission.length === G.currentTurn.team.length) {
              G.currentTurn.isSuccess = G.currentTurn.mission
                .map((missionVote) => missionVote.vote)
                .reduce(
                  (pass, missionVote) =>
                    pass ? missionVote === MISSION_VOTE.PASS : pass,
                  true
                )
                ? BOOLEAN_STATE.TRUE
                : BOOLEAN_STATE.FALSE;

              G.missionNumber++;
              ctx.events.endStage();
              ctx.events.endTurn();
            }
          },
        },
        moveLimit: 1,
      },
    },
  },
};

// [{playerId:0}, {playerId:1}]
