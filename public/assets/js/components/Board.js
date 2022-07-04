import Component from '../lib/Component.js';
import store from '../store/index.js';
import cells from './cells.js';

export default class Board extends Component {
  constructor() {
    super({ store, element: document.querySelector('#board') });
  }

  render() {
    let self = this;

    self.element.innerHTML = cells
      .map(
        (item, i) => `<button id=${item} class="cell"><span></span></button>`,
      )
      .join('');
  }
}
