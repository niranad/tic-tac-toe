export default {
  setPlayer1(context, payload) {
    context.commit('setPlayer1', payload)
  },
  setPlayer2(context, payload) {
    context.commit('setPlayer2', payload)
  },
  setPlayer2IsHuman(context, payload) {
    context.commit('setPlayer2IsHuman', payload)
  },
  setPlayer1Wins(context, payload) {
    context.commit('setPlayer1Wins', payload)
  },
  setPlayer2Wins(context, payload) {
    context.commit('setPlayer2Wins', payload)
  },
  setCPUWins(context, payload) {
    context.commit('setCPUWins', payload)
  },
  setTies(context, payload) {
    context.commit('setTies', payload)
  },
  setMovesCount(context, payload) {
    context.commit('setMovesCount', payload)
  },
  setCurrentCell(context, payload) {
    context.commit('setCurrentCell', payload)
  },
  setNextTurn(context, payload) {
    context.commit('setNextTurn', payload)
  },
  setIsOver(context, payload) {
    context.commit('setIsOver', payload)
  },
  setIsActive(context, payload) {
    context.commit('setIsActive', payload)
  },
  setXCells(context, payload) {
    context.commit('setXCells', payload)
  },
  setOCells(context, payload) {
    context.commit('setOCells', payload)
  },
}
