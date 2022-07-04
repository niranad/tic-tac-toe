import actions from './actions.js'
import mutations from './mutations.js'
import game from './gameState.js'
import Store from './Store.js'

export default new Store({ actions, mutations, game })
