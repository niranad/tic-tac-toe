import Component from '../lib/Component.js';
import store from '../store/index.js';

export default class PlayersStateInfo extends Component {
  constructor() {
    super({ store, element: document.querySelectorAll('.state') });
  }

  render() {
    let self = this;

    let { state: game } = store;

    console.log(game.isWon);

    if (
      game.xCells.length + game.oCells.length !== 9 ||
      (game.isWon && game.xCells.length + game.oCells.length === 9)
    ) {
      if (!game.player2IsHuman) {
        if (
          (game.player1 === 'X' && game.nextTurn === 'X') ||
          (game.player1 === 'O' && game.nextTurn === 'O')
        ) {
          store.dispatch('setCPUWins', 1);
          sessionStorage.setItem('CPUWins', game.CPUWins);
        } else if (
          (game.player1 === 'X' && game.nextTurn === 'O') ||
          (game.player1 === 'O' && game.nextTurn === 'X')
        ) {
          store.dispatch('setPlayer1Wins', 1);
          sessionStorage.setItem('player1Wins', game.player1Wins);
        }

        self.element[0].querySelector('#playerX').textContent =
          game.player1 === 'X' ? 'YOU' : 'CPU';
        self.element[0].querySelector('#playerX-wins').textContent =
          game.player1 === 'X' ? game.player1Wins : game.CPUWins;
        self.element[2].querySelector('#playerO').textContent =
          game.player1 === 'X' ? 'CPU' : 'YOU';
        self.element[2].querySelector('#playerO-wins').textContent =
          game.player1 === 'X' ? game.CPUWins : game.player1Wins;
      } else {
        if (
          (game.player1 === 'X' && game.nextTurn === 'X') ||
          (game.player1 === 'O' && game.nextTurn === 'O')
        ) {
          store.dispatch('setPlayer2Wins', 1);
          sessionStorage.setItem('player2Wins', game.player2Wins);
        } else if (
          (game.player1 === 'X' && game.nextTurn === 'O') ||
          (game.player1 === 'O' && game.nextTurn === 'X')
        ) {
          store.dispatch('setPlayer1Wins', 1);
          sessionStorage.setItem('player1Wins', game.player1Wins);
        }

        self.element[0].querySelector('#playerX').textContent =
          game.player1 === 'X' ? 'Player1' : 'Player2';
        self.element[0].querySelector('#playerX-wins').textContent =
          game.player1 === 'X' ? game.player1Wins : game.player2Wins;
        self.element[2].querySelector('#playerO').textContent =
          game.player1 === 'X' ? 'Player2' : 'Player1';
        self.element[2].querySelector('#playerO-wins').textContent =
          game.player1 === 'X' ? game.player2Wins : game.player1Wins;
      }
    } else {
      store.dispatch('setTies', 1);
      sessionStorage.setItem('ties', game.ties);
      self.element[1].querySelector('#ties').textContent = game.ties;
    }
  }
}
