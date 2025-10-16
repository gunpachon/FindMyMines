export type Player = {
  name: string;
  score: number;
  socketID: string;
  emit: (event: string) => Object;
  active: boolean;
};
export type Tile = {
  index: [number, number];
  state: string; //{"hidden", "revealed"},
  bomb: boolean;
  revealer: number | null; //{"Player1", "Player2"}
};
export type Board = Tile[][];
export type Game = {
  code: string;
  status: string; //{"waiting", "in-progress", "ended"}
  mode: string; //{"classic","zen","blind"}
  players: Player[];
  currentTurn: number;
  bombFound: number;
  board: Board;
  turnStartTime: number | null;
  turnEndTime: number | null;
};
