import { Client } from 'boardgame.io/react';
import { ResistanceGame } from '@wlr/resistance/game';

const App = Client({ game: ResistanceGame });

export default App;
