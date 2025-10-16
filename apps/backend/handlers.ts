import type { Server, Socket } from "socket.io";
import type { Board, Game, Tile } from "./types.ts";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
function getTile(board: Board, index: [number, number]) {
  if (board[index[0]] !== undefined) {
    const row = board[index[0]];
    if (row !== undefined) {
      if (row[index[1]] !== undefined) {
        return row[index[1]];
      }
      return undefined;
    }
    return undefined;
  }
  return undefined;
}
function randomizeBomb(board: Board, bombNum: number) {
  let count = 0;
  while (count < bombNum) {
    const index: [number, number] = [getRandomInt(6), getRandomInt(6)];
    const tile = getTile(board, index);
    if (tile !== undefined) {
      if (tile.bomb == false) {
        tile.bomb = true;
        count++;
      }
    }
  }
  return board;
}
function createBoard(rowSize: number, colSize: number) {
  const board: Board = [];
  for (let i = 0; i < rowSize; i++) {
    const row: Tile[] = [];
    for (let j = 0; j < colSize; j++) {
      row.push({
        state: "hidden", //{"hidden", "revealed"},
        bomb: false,
        revealer: null, //{"Player1", "Player2"}
        index: [i, j],
      });
    }
    board.push(row);
  }
  randomizeBomb(board, 11);
  return board;
}

const gameMap = new Map<string, Game>();
function generateid() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  if (gameMap.has(result)) {
    generateid();
  }
  return result;
}

const timeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();

export function registerHandlers(socket: Socket, io: Server) {
  let room: string | undefined = undefined;

  function updateTurn(game: Game, onStart: boolean) {
    if (room === undefined) return;

    if (onStart == true) {
      game.currentTurn = getRandomInt(2);
    } else {
      clearTimeout(timeouts.get(room));
      if (game.currentTurn == 0) {
        game.currentTurn++;
      } else {
        game.currentTurn = 0;
      }
    }
    game.turnStartTime = Date.now();
    game.turnEndTime = game.turnStartTime + 10000;
    // whose turn?
    const turn = game.currentTurn;
    timeouts.set(
      room,
      setTimeout(() => {
        // Time is up
        const currentTurnPlayer = game.players[turn];
        if (currentTurnPlayer === undefined) throw new Error();
        currentTurnPlayer.emit("timeOut");
        updateTurn(game, false);
      }, game.turnEndTime - Date.now())
    );

    io.to(room).emit("gameState", game);
  }

  function startGame(game: Game, replay: boolean) {
    if (game !== undefined) {
      game.status = "in-progress";
      //console.log(startGame.board===constBoard) //2
      //game.board = createBoard(6,6);

      if (replay) {
        game.board = createBoard(6, 6);
        game.bombFound = 0;

        const maxScore = game.players.reduce(
          (acc, cur) => (cur.score > acc ? cur.score : acc),
          -Infinity
        );

        const loserIndex = game.players.findIndex((p) => p.score < maxScore);

        // Sets the current turn to be loser so that the updateTurn() will set
        // the turn to the winning player
        game.currentTurn = loserIndex;
        game.players.forEach((p) => (p.score = 0));
        updateTurn(game, false);
      } else {
        updateTurn(game, true);
      }
    } else {
      return;
    }
  }

  socket.on("create", (mode: string) => {
    const code = generateid();
    gameMap.set(code, {
      code: code,
      status: "waiting", //{"waiting", "in-progress", "ended"}
      mode: mode, //{"classic","zen","blind"}
      players: [],
      currentTurn: 0,
      board: createBoard(6, 6),
      turnStartTime: null,
      turnEndTime: null,
      bombFound: 0,
    });

    socket.emit("created", code);
  });

  socket.on("join", (name: string, code: string) => {
    room = code;

    const socketsInRoom = io.sockets.adapter.rooms.get(room)?.size;

    if (socketsInRoom !== undefined && socketsInRoom >= 2) {
      socket.emit("error", "too many clients");
      return;
    } else {
      socket.join(room);
    }

    const game = gameMap.get(code);
    if (game !== undefined) {
      game.players.push({
        name: name,
        score: 0,
        socketID: socket.id,
        emit: (event: string) => socket.emit(event),
      });
      if (game.players.length == 2) {
        startGame(game, false);
      }
    } else {
      return;
    }

    io.to(room).emit("gameState", game);
  });

  socket.on("click", (tileIndex: [number, number]) => {
    if (room === undefined) return;

    const game = gameMap.get(room);
    if (game != undefined) {
      const turnClicker = game.players[game.currentTurn];
      const tile = getTile(game.board, tileIndex);
      if (turnClicker !== undefined && tile !== undefined) {
        console.log(socket.id, turnClicker.socketID);
        if (socket.id != turnClicker.socketID) return gameMap.get(room);
        if (tile.state == "revealed") return gameMap.get(room);
        if (tile.bomb == true) {
          turnClicker.score++;
          game.bombFound++;
        }
        tile.state = "revealed";
        tile.revealer = game.currentTurn;
        console.log(tile);

        if (game.bombFound === 11) {
          clearTimeout(timeouts.get(room));

          const maxScore = game.players.reduce(
            (acc, cur) => (cur.score > acc ? cur.score : acc),
            -Infinity
          );

          const winner = game.players.find((p) => p.score >= maxScore);
          const loser = game.players.find((p) => p.score < maxScore);

          game.status = "ended";

          winner?.emit("win");
          loser?.emit("lose");

          game.turnStartTime = null;
          game.turnEndTime = null;

          io.to(room).emit("gameState", game);
        } else {
          updateTurn(game, false);
        }
      }

      io.to(room).emit("gameState", game);
    }
  });

  socket.on("replay", () => {
    if (room === undefined) return;
    const game = gameMap.get(room);
    if (game === undefined) return;

    startGame(game, true);
    io.to(room).emit("replay");
    io.to(room).emit("gameState", game);
  });
}

export function registerAdminHandlers(socket: Socket, io: Server) {
  socket.on("reset", () => {
    gameMap.clear();
    timeouts.values().forEach(clearTimeout);

    io.of("/").emit("reset");
  });
}

// export function onReset(code: string) {
//   //not done yet
//   const game = gameMap.get(code);
//   if (game !== undefined) {
//     game.currentTurn = 0;
//     game.turnStartTime = null;
//     game.turnEndTime = null;
//     game.bombFound = 0;
//     for (let i = 0; i < game.players.length; i++) {
//       const player = game.players[i];
//       if (player !== undefined) player.score = 0;
//     }
//     const startNewGame = onStart(game, false);
//     if (startNewGame !== undefined) gameMap.set(code, startNewGame);
//   }
//   return gameMap.get(code);
// }
export function onReplay(code: string) {
  //not done yet
  const game = gameMap.get(code);
  if (game !== undefined) {
    if (game.status == "ended") {
      game.bombFound = 0;
      for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];
        if (player !== undefined) player.score = 0;
      }
      game.status = "in-progress";
      const startNewGame = updateTurn(game, false); //start with winner of last game
      if (startNewGame !== undefined) gameMap.set(code, startNewGame);
    }
  }
  return gameMap.get(code);
}
/*type mockSocket = {
    id:string,
    emit: (message:string)=>object,
}
const Socket1 = {
    id:"1234",
    emit: (message:string)=>{console.log(`id ${Socket1.id} emits ${message}`)}
}
const Socket2 = {
    id:"5678",
    emit: (message:string)=>{console.log(`id ${Socket2.id} emits ${message}`)}
}
const constBoard:Board = [
    [{index:[0,0],"state": "hidden","bomb": false,"revealer": null},{index:[0,1],"state": "hidden","bomb": false,"revealer": null},{index:[0,2],"state": "hidden","bomb": false,"revealer": null},{index:[0,3],"state": "hidden","bomb": true,"revealer": null},{index:[0,4],"state": "hidden","bomb": true,"revealer": null},{index:[0,5],"state": "hidden","bomb": false,"revealer": null}],
    [{index:[1,0],"state": "hidden","bomb": true,"revealer": null},{index:[1,1],"state": "hidden","bomb": false,"revealer": null},{index:[1,2],"state": "hidden","bomb": false,"revealer": null},{index:[1,3],"state": "hidden","bomb": true,"revealer": null},{index:[1,4],"state": "hidden","bomb": false,"revealer": null},{index:[1,5],"state": "hidden","bomb": false,"revealer": null}],
    [{index:[2,0],"state": "hidden","bomb": true,"revealer": null},{index:[2,1],"state": "hidden","bomb": false,"revealer": null},{index:[2,2],"state": "hidden","bomb": false,"revealer": null},{index:[2,3],"state": "hidden","bomb": false,"revealer": null},{index:[2,4],"state": "hidden","bomb": false,"revealer": null},{index:[2,5],"state": "hidden","bomb": false,"revealer": null}],
    [{index:[3,0],"state": "hidden","bomb": false,"revealer": null},{index:[3,1],"state": "hidden","bomb": false,"revealer": null},{index:[3,2],"state": "hidden","bomb": false,"revealer": null},{index:[3,3],"state": "hidden","bomb":false,"revealer": null},{index:[3,4],"state": "hidden","bomb": true,"revealer": null},{index:[3,5],"state": "hidden","bomb": false,"revealer": null}],
    [{index:[4,0],"state": "hidden","bomb": true,"revealer": null},{index:[4,1],"state": "hidden","bomb": true,"revealer": null},{index:[4,2],"state": "hidden","bomb": true,"revealer": null},{index:[4,3],"state": "hidden","bomb": false,"revealer": null},{index:[4,4],"state": "hidden","bomb": false,"revealer": null},{index:[4,5],"state": "hidden","bomb": false,"revealer": null}],
    [{index:[5,0],"state": "hidden","bomb": true,"revealer": null},{index:[5,1],"state": "hidden","bomb": false,"revealer": null},{index:[5,2],"state": "hidden","bomb": true,"revealer": null},{index:[5,3],"state": "hidden","bomb": false,"revealer": null},{index:[5,4],"state": "hidden","bomb": false,"revealer": null},{index:[5,5],"state": "hidden","bomb": false,"revealer": null}]
  ]
const firstGameState = {
  "code": "rFzJIjIX",
  "status": "waiting",
  "mode": "classic",
  "players": [],
  "currentTurn": 0,
  "board": constBoard,
  "turnStartTime": null,
  "turnEndTime": null,
  "bombFound": 0
}
gameMap.set("rFzJIjIX",firstGameState)

function print(gameState:Game|undefined,index:[number,number]|undefined){
    if(gameState!==undefined){
        if(index!==undefined){
            const clickedTile = gameState.board?.[index[0]]?.[index[1]] ?? "undefined";
            console.log(JSON.stringify({
                status:gameState.status,
                players:gameState.players,
                currentTurn:gameState.currentTurn,
                clickedTile: clickedTile,
                bombFound:gameState.bombFound
            },null,2))}
        else{
            console.log(JSON.stringify({
                status:gameState.status,
                players:gameState.players,
                currentTurn:gameState.currentTurn,
                bombFound:gameState.bombFound
            },null,2))}
    }
    else{
        console.log("undefined")
    }
}*/
//let gameState = onCreate("classic");
/*let gameState:Game|undefined = firstGameState
if(gameState!==undefined){
    //console.log(Socket1,gameState.code)
    gameState = onJoin(Socket1,"Bob",gameState.code)
    print(gameState,undefined)
}
if(gameState!==undefined){
    //console.log(gameState.board===constBoard) //1
    gameState = onJoin(Socket2,"Alice",gameState.code)
    print(gameState,undefined)
}*/
/*if(gameState!==undefined){
    console.log(gameState.board===constBoard) //3
}*/
/*if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket1,[0,3])
    print(gameState,[0,3])
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket2,[0,4])
    print(gameState,[0,4])
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket1,[1,0])
    print(gameState,[1,0])
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket2,[1,3])
    print(gameState,[1,3])
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket1,[2,0])
    print(gameState,[2,0])
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket2,[3,4])
    print(gameState,[3,4])
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket1,[4,0])
    print(gameState,[4,0])
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket2,[4,1])
    print(gameState,[4,1])
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket1,[4,2])
    print(gameState,[4,0])
}
if(gameState!==undefined){
    gameState = onReset(gameState.code)
    print(gameState,undefined)
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket2,[5,0])
    print(gameState,[5,0])
}
if(gameState!==undefined){
    gameState = onClick(gameState.code,Socket1,[5,2])
    print(gameState,[5,2])
}
if(gameState!==undefined){
    gameState = onReset(gameState.code)
    print(gameState,undefined)
}*/
