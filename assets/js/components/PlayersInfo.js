import Component from '../lib/Component.js'
import store from '../store/index.js'

export default class PlayersInfo extends Component {
  constructor() {
    super({ element: document.querySelector('#players-info') })
  }

  render() {
    let self = this
    let sessionData = {}
    let stateProps = ['player1', 'player2', 'player2IsHuman']
    let { state: game } = store

    stateProps
      .slice(0, 2)
      .map((item) => (sessionData[item] = sessionStorage.getItem(item)))

    sessionData['player2IsHuman'] = Boolean(
      sessionStorage.getItem('player2IsHuman'),
    )

    let { player1, player2, player2IsHuman } = sessionData

    if (player1 && player2) {
      store.dispatch('setPlayer1', player1)
      store.dispatch('setPlayer2', player2)
    }

    store.dispatch('setPlayer2IsHuman', player2IsHuman)

    if (game.player1 === 'X') {
      self.element.querySelector('#player1').textContent = game.player2IsHuman
        ? 'PLAYER1'
        : 'YOU'
      self.element.querySelector('#player2').textContent = game.player2IsHuman
        ? 'PLAYER2'
        : 'CPU'
      self.element.querySelector('#info').textContent = game.player2IsHuman
        ? 'PLAYER1 goes first'
        : 'YOU go first'
      document.querySelector('#playerX').textContent = game.player2IsHuman
        ? 'PLAYER1'
        : 'YOU'
      document.querySelector('#playerO').textContent = game.player2IsHuman
        ? 'PLAYER2'
        : 'CPU'
    } else {
      self.element.querySelector('#player1').textContent = game.player2IsHuman
        ? 'PLAYER2'
        : 'CPU'
      self.element.querySelector('#player2').textContent = game.player2IsHuman
        ? 'PLAYER1'
        : 'YOU'
      self.element.querySelector('#info').textContent = game.player2IsHuman
        ? 'PLAYER2 goes first'
        : 'CPU goes first. Click refresh button to begin'
      document.querySelector('#playerX').textContent = game.player2IsHuman
        ? 'PLAYER2'
        : 'CPU'
      document.querySelector('#playerO').textContent = game.player2IsHuman
        ? 'PLAYER1'
        : 'YOU'
    }
  }
}
