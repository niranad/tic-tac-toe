import Component from '../lib/Component.js'
import store from '../store/index.js'

export default class Modal extends Component {
  constructor() {
    super({ store, element: document.querySelector('#modal') })
  }

  render() {
    let self = this
    let winnerMark = self.element.querySelector('#win-mark')
    let winText = self.element.querySelector('#win-text')
    let nextRoundBtn = self.element.querySelector('#next-round-btn')
    let takesRoundTxt = self.element.querySelector('.takes')

    document.querySelector('#overlay').style.display = 'block'

    let { state: game } = store

    // if there are no more empty cells to occupy, game is a tie
    if (game.xCells.length + game.oCells.length === 9) {
      winnerMark.textContent = ''
      winText.textContent = 'DRAW!'
      takesRoundTxt.textContent = "IT'S A TIE"
      takesRoundTxt.style.color = 'rgb(182, 198, 212)'
      takesRoundTxt.setAttribute('id', 'round-info')
      nextRoundBtn.style.backgroundColor =
        game.player1 === 'X' ? 'rgb(11, 214, 221)' : 'rgb(255, 170, 4)'

      // if it's X's turn, then O won
    } else if (game.nextTurn === 'X') {
      winnerMark.textContent = 'O'
      winnerMark.style.color = 'rgb(255, 170, 4)'

      if (game.player2IsHuman) {
        winText.textContent =
          game.player1 === 'X' ? 'PLAYER2 WON!' : 'PLAYER1 WON!'
      } else {
        winText.textContent = game.player1 === 'X' ? 'CPU WON!' : 'YOU WON!'
      }

      nextRoundBtn.style.backgroundColor =
        game.player1 === 'X' ? 'rgb(11, 214, 221)' : 'rgb(255, 170, 4)'
      takesRoundTxt.removeAttribute('id')
      takesRoundTxt.style.color = 'rgb(255, 170, 4)'

      // else X won
    } else {
      winnerMark.textContent = 'X'
      winnerMark.style.color = 'rgb(11, 214, 221)'

      if (game.player2IsHuman) {
        winText.textContent =
          game.player1 === 'X' ? 'PLAYER1 WON!' : 'PLAYER2 WON!'
      } else {
        winText.textContent = game.player1 === 'X' ? 'YOU WON!' : 'CPU WON!'
      }

      nextRoundBtn.style.backgroundColor =
        game.player1 === 'X' ? 'rgb(11, 214, 221)' : 'rgb(255, 170, 4)'
      takesRoundTxt.removeAttribute('id')
      takesRoundTxt.style.color = 'rgb(11, 214, 221)'
    }

    self.element.style.display = 'flex'
  }
}
