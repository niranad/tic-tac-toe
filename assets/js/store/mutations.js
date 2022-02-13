export default {
  setPlayer1(state, payload) {
    state = { ...state, player1: payload }

    return state
  },
  setPlayer2(state, payload) {
    state = { ...state, player2: payload }

    return state
  },
  setPlayer2IsHuman(state, payload) {
    state = { ...state, player2IsHuman: payload }

    return state
  },
  setPlayer1Wins(state, payload) {
    if (state.player1Wins === undefined) {
      state = { ...state, player1Wins: 0 }
    }
    state = { ...state, player1Wins: state.player1Wins + payload }

    return state
  },
  setPlayer2Wins(state, payload) {
    if (state.player2Wins === undefined) {
      state = { ...state, player2Wins: 0 }
    }
    state = { ...state, player2Wins: state.player2Wins + payload }

    return state
  },
  setCPUWins(state, payload) {
    if (state.CPUWins === undefined) {
      state = { ...state, CPUWins: 0 }
    }
    state = { ...state, CPUWins: state.CPUWins + payload }

    return state
  },
  setTies(state, payload) {
    if (state.ties === undefined) {
      state = { ...state, ties: 0 }
    }
    state = { ...state, ties: state.ties + payload }

    return state
  },
  setMovesCount(state, payload) {
    if (state.movesCount === undefined) {
      state = { ...state, movesCount: 0 }
    }
    state = { ...state, movesCount: state.movesCount + payload }

    return state
  },
  setCurrentCell(state, payload) {
    state = { ...state, currentCell: payload }

    return state
  },
  setNextTurn(state, payload) {
    state = { ...state, nextTurn: payload }

    return state
  },
  setIsOver(state, payload) {
    state = { ...state, isOver: payload }

    return state
  },
  setIsActive(state, payload) {
    state = { ...state, isActive: payload }

    return state
  },
  setXCells(state, payload) {
    if (state.xCells === undefined) {
      state = { ...state, xCells: [] }
    }
    if (state.xCells[state.xCells.length - 1] === 0) {
      state.xCells.pop()
    }
    state = { ...state, xCells: state.xCells.concat(payload) }

    return state
  },
  setOCells(state, payload) {
    if (state.oCells === undefined) {
      state = { ...state, oCells: [] }
    }
    if (state.oCells[state.oCells.length - 1] === 0) {
      state.oCells.pop()
    }
    state = { ...state, oCells: state.oCells.concat(payload) }

    return state
  },
}
