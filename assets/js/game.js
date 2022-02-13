import PlayersInfo from './components/PlayersInfo.js'
import Board from './components/Board.js'
import store from './store/index.js'
import Controller from './components/Controller.js'
import stateProps from './stateProps.js'

let { state: game } = store

window.addEventListener('DOMContentLoaded', () => {
  let sessionData = {}

  // retrieve state data of type number from sessionStorage
  stateProps.slice(3, 9).map((prop) => {
    sessionData[prop] = Number(sessionStorage.getItem(prop))
  })

  // retrieve state data of type string from sessionStorage
  stateProps.slice(9).map((prop) => {
    sessionData[prop] = sessionStorage.getItem(prop)
  })

  let { xCells, oCells, isOver } = sessionData

  // persist number of wins and ties state with sessionStorage
  stateProps.slice(3, 7).map((prop) => {
    store.dispatch(
      `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
      Number(sessionData[prop]),
    )
  })

  // if game is over, re-initialize movesCount state in store and sessionStorage
  if (isOver) {
    stateProps.slice(7, 9).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        0,
      )
      sessionStorage.setItem(prop, 0)
    })
    // otherwise, retrieve it from sessionStorage
  } else {
    stateProps
      .slice(7, 9)
      .map((prop) =>
        store.dispatch(
          `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
          sessionData[prop],
        ),
      )
  }

  // persist nextTurn state with sessionStorage
  store.dispatch('setNextTurn', sessionData.nextTurn)

  // if xCells sessionStorage is populated with empty string,
  // push zero into the xCells array in store
  if (xCells === '') {
    stateProps.slice(10, 12).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        Number(sessionData[prop]),
      )
    })
    // if xCells sessionStorage is not an empty string, iterate over
    // the string, casting each number character to a number and pushing
    // the number into xCells array in store
  } else if (xCells !== null && !Boolean(isOver)) {
    stateProps.slice(10, 12).map((prop) => {
      let cellNums = sessionStorage.getItem(prop)
      for (let s of cellNums) {
        store.dispatch(
          `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
          Number(s),
        )
      }
    })
    if (oCells === '') store.dispatch('setOCells', Number(sessionData.oCells))
  }

  // retrieve isActive and isOver state from sessionStorage
  stateProps.slice(12).map((prop) => {
    store.dispatch(
      `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
      Boolean(sessionData[prop]),
    )
  })

  const playersInfoInstance = new PlayersInfo()
  const boardInstance = new Board()
  const controllerInstance = new Controller()

  playersInfoInstance.render()
  boardInstance.render()
  controllerInstance.render()

  // if game is not over yet, restore the marks on board
  if (!game.isOver) {
    let cellSpan
    // if either xCells or oCells array is populated and last element is not zero
    if (game.xCells.length !== 0 && game.xCells[game.xCells.length - 1] !== 0) {
      game.xCells.map((cellNumber) => {
        cellSpan = document.querySelector(`#cell${cellNumber}`).firstChild
        cellSpan.textContent = 'X'
        cellSpan.style.color = 'rgb(11, 214, 221)'
      })
    }

    if (game.oCells.length !== 0 && game.oCells[game.oCells.length - 1] !== 0) {
      game.oCells.map((cellNumber) => {
        cellSpan = document.querySelector(`#cell${cellNumber}`).firstChild
        cellSpan.textContent = 'O'
        cellSpan.style.color = 'rgb(255, 170, 4)'
      })
    }
  } else {
    // set movesCount and currentCell to zero
    stateProps.slice(7, 9).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        prop === 'moveCount' ? -game.prop : 0,
      )
      sessionStorage.setItem(prop, 0)
    })

    store.dispatch('setNextTurn', 'X')
    sessionStorage.setItem('nextTurn', 'X')

    // set xcells and oCells to one-element arrays containing zero
    stateProps.slice(10, 12).map((prop) => {
      store.dispatch(
        `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        0,
      )
      sessionStorage.setItem(prop, 0)
    })

    store.dispatch('setIsOver', false)
    sessionStorage.setItem('isOver', '')

    if (game.player2IsHuman || game.player1 === 'X') {
      store.dispatch('setIsActive', true)
      sessionStorage.setItem('isActive', 'true')
    } else {
      store.dispatch('setIsActive', false)
      sessionStorage.setItem('isActive', '')
    }
  }

  // display updated number of ties
  document.querySelector('#ties').textContent = game.ties

  // display updated number of wins
  if (game.player1 === 'X') {
    document.querySelector('#playerX-wins').textContent = game.player1Wins
    document.querySelector('#playerO-wins').textContent = game.player2IsHuman
      ? game.player2Wins
      : game.CPUWins
  } else {
    document.querySelector('#playerX-wins').textContent = game.player2IsHuman
      ? game.player2Wins
      : game.CPUWins
    document.querySelector('#playerO-wins').textContent = game.player1Wins
  }

  store.dispatch('setIsOver', Boolean(sessionStorage.getItem('isOver')))

  document.querySelector('#quit-btn').addEventListener('click', (evt) => {
    // re-initialize number of wins, ties, moves and currentCell
    stateProps.slice(3, 9).map((prop) => {
      store.dispatch(
        `#set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
        0,
      )
      sessionStorage.setItem(prop, 0)
    })

    // re-initialize isActive
    store.dispatch('setIsActive', false)
    sessionStorage.setItem('isActive', '')

    modalButtonEvent()

    evt.target.setAttribute('href', './index.html')
  })

  document.querySelector('#next-round-btn').addEventListener('click', (e) => {
    e.preventDefault()
    // if X is not CPU or both players are human
    if (game.player1 === 'X' || game.player2IsHuman === true) {
      store.dispatch('setIsActive', true)
      sessionStorage.setItem('isActive', 'true')

      stateProps.slice(13).map((prop) => {
        store.dispatch(
          `set${prop.charAt(0).toUpperCase() + prop.substring(1)}`,
          false,
        )
        sessionStorage.setItem(prop, '')
      })
    } else {
      store.dispatch('setIsActive', false)
      sessionStorage.setItem('isActive', '')
    }

    modalButtonEvent()
  })

  function modalButtonEvent() {
    store.dispatch('setNextTurn', 'X')
    sessionStorage.setItem('nextTurn', 'X')

    // reinitialize xCells and oCells in sessionStorage
    stateProps.slice(10, 12).map((prop) => {
      sessionStorage.setItem(prop, '')
    })

    // reintialize movesCount and currentCell
    stateProps.slice(7, 9).map((prop) => {
      sessionStorage.setItem(prop, 0)
    })

    // reinitialize isOver and isWon in sessionStorage
    sessionStorage.setItem('isOver', '')
    sessionStorage.setItem('isWon', '')

    document.querySelector('#modal').style.display = 'none'
    document.querySelector('#overlay').style.display = 'none'
    document.location.reload()
  }
})
