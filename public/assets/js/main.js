import store from './store/index.js'
import stateProps from './stateProps.js'

const checkbox = document.querySelector('#checkbox')
const vsCPU = document.querySelector('#vs-cpu')
const vsHuman = document.querySelector('#vs-human')

let { state: game } = store

let sessionData = {}

stateProps.map((prop) => (sessionData[prop] = sessionStorage.getItem(prop)))

let { player1, player2, player1Wins, nextTurn, xCells, isActive, isWon } = sessionData

window.addEventListener('DOMContentLoaded', () => {
  if (player1 && player2) {
    store.dispatch('setPlayer1', player1)
    store.dispatch('setPlayer2', player2)
  } else {
    store.dispatch('setPlayer1', 'X')
    store.dispatch('setPlayer2', 'O')

    sessionStorage.setItem('player1', game.player1)
    sessionStorage.setItem('player2', game.player2)
  }

  // if player1Wins sessionStorage is populated (assumes other state including
  // player2Wins, CPUWins, ties, movesCount and currentCell are also populated),
  // persist the state data with sessionStorage
  if (player1Wins !== null) {
    stateProps
      .slice(3, 9)
      .map((prop) =>
        store.dispatch(
          `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
          Number(sessionData[prop]),
        ),
      )
    // else set the corresponding state data to zero
  } else {
    stateProps.slice(3, 9).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        0,
      )
      sessionStorage.setItem(prop, 0)
    })
  }

  // if nextTurn sessionStorage is populated, persist its state in store
  // with sessionStorage
  if (nextTurn !== null) {
    store.dispatch('setNextTurn', sessionData.nextTurn)
    // otherwise, set it to X
  } else {
    store.dispatch('setNextTurn', 'X')
    sessionStorage.setItem('nextTurn', 'X')
  }

  // if sessionStorage for xCells or oCells is populated,
  // persist xCells and oCells state in store with sessionStorage
  if (xCells !== null) {
    stateProps.slice(10, 12).map((prop) => {
      for (let numChar of sessionData[prop]) {
        store.dispatch(
          `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
          prop === '' ? 0 : Number(numChar),
        )
      }
    })
    //
  } else {
    stateProps.slice(10, 12).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        [],
      )
      sessionStorage.setItem(prop, '')
    })
  }

  // if isActive sessionStorage is populated, (definitely isOver 
  // is also populated), persist the data with sessionStorage
  if (isActive !== null) {
    stateProps
      .slice(12, 14)
      .map((prop) =>
        store.dispatch(
          `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
          sessionData[prop],
        ),
      )
  } else {
    stateProps.slice(12, 14).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        false,
      )
      sessionStorage.setItem(prop, false)
    })
  }

  // never persist isWon from sessionStorage
  store.dispatch('setIsWon', false)
  sessionStorage.setItem('isWon', '')

  checkbox.addEventListener('change', () => {
    store.dispatch('setPlayer1', game.player1 === 'O' ? 'X' : 'O')
    store.dispatch('setPlayer2', game.player1 === 'O' ? 'X' : 'O')

    sessionStorage.setItem('player1', game.player1)
    sessionStorage.setItem('player2', game.player2)

    initializeGame()
  })

  vsCPU.addEventListener('click', () => {
    store.dispatch('setPlayer2IsHuman', false)
    sessionStorage.setItem('player2IsHuman', '')

    initializeGame()
  })

  vsHuman.addEventListener('click', () => {
    store.dispatch('setPlayer2IsHuman', true)
    sessionStorage.setItem('player2IsHuman', 'true')

    initializeGame()
  })

  function initializeGame() {
    stateProps.slice(3, 9).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        0,
      )
      sessionStorage.setItem(prop, 0)
    })

    store.dispatch('setNextTurn', 'X')
    sessionStorage.setItem('nextTurn', 'X')

    stateProps.slice(10, 12).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        0,
      )
      sessionStorage.setItem(prop, '')
    })

    stateProps.slice(12).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        prop === 'isActive' && (game.player2IsHuman || game.player1 === 'X')
          ? true
          : false,
      )
      sessionStorage.setItem(
        prop,
        prop === 'isActive' && (game.player2IsHuman || game.player1 === 'X')
          ? 'true'
          : '',
      )
    })
  }
})
