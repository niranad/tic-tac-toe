import store from '../store/index.js';
import Component from '../lib/Component.js';
import cells from './cells.js';
import PlayersStateInfo from './PlayersStateInfo.js';
import Modal from './Modal.js';

export default class Controller extends Component {
  constructor() {
    super({ store, element: document.querySelector('.cell') });
  }

  render() {
    let self = this;

    let { state: game } = store;
    const turnMark = document.querySelector('#turn-mark');
    const refreshBtn = document.querySelector('#refresh-btn');

    if (game.player1 === 'X') {
      document.querySelector('#refresh-btn').setAttribute('disabled', 'true');
      store.dispatch('setIsActive', true);
      sessionStorage.setItem('isActive', 'true');
    }

    const setGameOver = (lastPlayerCells) => {
      let cellsCheck = [];
      let trueCount = 0;
      let matchedCells = [];

      let currMark = document.querySelector(
        `#cell${store.state.currentCell}`,
      ).textContent;

      const checkCellsMatched = (cellNumber) => {
        matchedCells.push(cellNumber);
        cellsCheck.push(
          document.querySelector(`#cell${cellNumber}`).textContent === currMark,
        );
        if (cellsCheck[cellsCheck.length - 1]) ++trueCount;
        if (cellsCheck.length === 3) {
          if (trueCount === 3) {
            store.dispatch('setIsWon', true);
            sessionStorage.setItem('isWon', 'true');

            store.dispatch('setIsOver', true);
            sessionStorage.setItem('isOver', 'true');

            // highlight the matched cells
            if (game.nextTurn === 'X') {
              matchedCells.map((num) => {
                let cell = document.querySelector(`#cell${num}`);
                cell.style.backgroundColor = 'rgb(255, 170, 4)';
                cell.firstChild.style.color = 'rgba(0, 0, 5, 0.918)';
              });
            } else {
              matchedCells.map((num) => {
                let cell = document.querySelector(`#cell${num}`);
                cell.style.backgroundColor = 'rgb(11, 214, 221)';
                cell.firstChild.style.color = 'rgba(0, 0, 5, 0.918)';
              });
            }
          } else if (game.xCells.length + game.oCells.length === 9) {
            store.dispatch('setIsOver', true);
            sessionStorage.setItem('isOver', 'true');
          }

          cellsCheck = [];
          trueCount = 0;
          matchedCells = [];
        }
      };

      analyzePreviousMoves(lastPlayerCells, checkCellsMatched);
    };

    const analyzePreviousMoves = (
      cells,
      callback1,
      callback2 = () => 0,
      callback3 = () => 0,
      callback4 = () => 0,
      callback5 = () => 0,
    ) => {
      let totalMoves = store.state.movesCount;

      // analyze cell row
      if (cells[cells.length - 1] >= 1 && cells[cells.length - 1] <= 3) {
        for (let i = 1; i <= 3; i++) {
          callback1(i, callback2);
        }
      } else if (cells[cells.length - 1] >= 4 && cells[cells.length - 1] <= 6) {
        for (let i = 4; i <= 6; i++) {
          callback1(i, callback2);
        }
      } else if (cells[cells.length - 1] >= 7 && cells[cells.length - 1] <= 9) {
        for (let i = 7; i <= 9; i++) {
          callback1(i, callback2);
        }
      }

      // If CPU moved after row analysis, return a truthy value
      if (totalMoves < store.state.movesCount) return 'CPU moved';

      // analyze cell column
      if (
        cells[cells.length - 1] === 1 ||
        cells[cells.length - 1] === 4 ||
        cells[cells.length - 1] === 7
      ) {
        for (let i = 1; i <= 7; i += 3) {
          callback1(i, callback3);
        }
      } else if (
        cells[cells.length - 1] === 2 ||
        cells[cells.length - 1] === 5 ||
        cells[cells.length - 1] === 8
      ) {
        for (let i = 2; i <= 8; i += 3) {
          callback1(i, callback3);
        }
      } else if (
        cells[cells.length - 1] === 3 ||
        cells[cells.length - 1] === 6 ||
        cells[cells.length - 1] === 9
      ) {
        for (let i = 3; i <= 9; i += 3) {
          callback1(i, callback3);
        }
      }

      // If CPU moved after column analysis, return a truthy value
      if (totalMoves < store.state.movesCount) return 'CPU moved';

      // analyze cell diagonal (or diagonals in case cellIndex === 5)
      if (
        cells[cells.length - 1] === 1 ||
        cells[cells.length - 1] === 5 ||
        cells[cells.length - 1] === 9
      ) {
        for (let i = 1; i <= 9; i += 4) {
          callback1(i, callback4);
        }
      }

      // If CPU moved after first diagonal analysis, return a truthy value
      if (totalMoves < store.state.movesCount) return 'CPU moved';

      if (
        cells[cells.length - 1] === 3 ||
        cells[cells.length - 1] === 5 ||
        cells[cells.length - 1] === 7
      ) {
        for (let i = 3; i <= 7; i += 2) {
          callback1(i, callback5);
        }
      }

      // If CPU moved after second diagonal analysis, return a truthy value
      if (totalMoves < store.state.movesCount) return 'CPU moved';
    };

    // Moves CPU to the cell in line with its previous cell's row, column or diagonal
    // with or without an opposite mark on the same line
    const blockCellInAlignment = (cpuCells, noOppMarkInLine = true) => {
      let cellsCheck = [];
      let falseCount = 0;
      let value = noOppMarkInLine ? 2 : 1;

      let calcRowIndex = (idx) =>
        cellsCheck
          .map((el, i) => {
            if (!el) return i;
          })
          .filter((el) => el !== undefined)[Math.floor(Math.random() * value)] +
        (idx - 2);

      let calcColIndex = (idx) =>
        cellsCheck
          .map((el, i) => {
            if (!el) return i;
          })
          .filter((el) => el !== undefined)[Math.floor(Math.random() * value)] *
          3 +
        (idx - 6);

      let calcFirstDiagIndex = (idx) =>
        cellsCheck
          .map((el, i) => {
            if (!el) return i;
          })
          .filter((el) => el !== undefined)[Math.floor(Math.random() * value)] *
          4 +
        (idx - 8);

      let calcSecondDiagIndex = (idx) =>
        cellsCheck
          .map((el, i) => {
            if (!el) return i;
          })
          .filter((el) => el !== undefined)[Math.floor(Math.random() * value)] *
          2 +
        (idx - 4);

      const checkCellInAlignment = (cellIdx, callback) => {
        let cellText = document.querySelector(`#cell${cellIdx}`).textContent;
        cellsCheck.push(cellText !== '');
        if (!cellsCheck[cellsCheck.length - 1]) ++falseCount;
        if (cellsCheck.length === 3) {
          // if there is at least one empty cell in a checked row, column or
          // diagonal, enable the cell before clicking it, remove "#thinking"
          // and enable previously disabled cells
          if (falseCount >= value) {
            let alignedCellIdx = callback(cellIdx);
            let cell = document.querySelector(`#cell${alignedCellIdx}`);

            cell.disabled = false;
            cell.onclick = buttonClickEventHandler(cell, alignedCellIdx - 1);
            cell.click();

            document.querySelector('#thinking').style.display = 'none';

            cells.map((id, idx) => {
              cell = document.querySelector(`#${id}`);
              cell.disabled = false;
              cell.onclick = buttonClickEventHandler(cell, idx);
            });
          }
          cellsCheck = [];
          falseCount = 0;
        }
      };

      return analyzePreviousMoves(
        cpuCells,
        checkCellInAlignment,
        calcRowIndex,
        calcColIndex,
        calcFirstDiagIndex,
        calcSecondDiagIndex,
      );
    };

    // Move CPU to block the mark's last cell to be matched in a row, column or diagonal
    const blockLastCell = (mark, playerCells) => {
      let cellsCheck = [];
      let trueCount = 0;

      let calcRowIndex = (idx) => cellsCheck.findIndex((el) => !el) + (idx - 2);
      let calcColIndex = (idx) =>
        cellsCheck.findIndex((el) => !el) * 3 + (idx - 6);
      let calcFirstDiagIndex = (idx) =>
        cellsCheck.findIndex((el) => !el) * 4 + (idx - 8);
      let calcSecondDiagIndex = (idx) =>
        cellsCheck.findIndex((el) => !el) * 2 + (idx - 4);

      const checkBlockableLastCell = (currCellIdx, callback) => {
        cellsCheck.push(
          document.querySelector(`#cell${currCellIdx}`).textContent === mark,
        );
        if (cellsCheck[cellsCheck.length - 1]) ++trueCount;
        if (cellsCheck.length === 3) {
          if (trueCount === 2) {
            let lastCellIdx = callback(currCellIdx);
            let cell = document.querySelector(`#cell${lastCellIdx}`);

            // if cell is available, enable it before clicking it,
            // remove "CPU is thinking" and enable previously disabled cells
            if (cell.textContent === '') {
              cell.disabled = false;
              cell.onclick = buttonClickEventHandler(cell, lastCellIdx - 1);
              cell.click();

              document.querySelector('#thinking').style.display = 'none';

              cells.map((id, idx) => {
                cell = document.querySelector(`#${id}`);
                cell.disabled = false;
                cell.onclick = buttonClickEventHandler(cell, idx);
              });
            }
          }
          cellsCheck = [];
          trueCount = 0;
        }
      };

      // analyze row or column such that cpu moves to block the last cell in alignment
      return analyzePreviousMoves(
        playerCells,
        checkBlockableLastCell,
        calcRowIndex,
        calcColIndex,
        calcFirstDiagIndex,
        calcSecondDiagIndex,
      );
    };

    const buttonClickEventHandler = (evtTarget, index) => (target, i) => {
      i = index;
      target = evtTarget;
      let cell = target;
      if (game.isActive && !game.isOver && cell.firstChild.textContent === '') {
        // mark the cell
        cell.firstChild.textContent = game.nextTurn;

        // set the color of the mark
        if (game.nextTurn === 'X') {
          cell.firstChild.style.color = 'rgb(11, 214, 221)';
        } else {
          cell.firstChild.style.color = 'rgb(255, 170, 4)';
        }

        // update nextTurn, currentCell, and movesCount
        store.dispatch('setNextTurn', game.nextTurn === 'X' ? 'O' : 'X');
        sessionStorage.setItem('nextTurn', game.nextTurn);
        store.dispatch('setCurrentCell', i + 1);
        sessionStorage.setItem('currentCell', i + 1);
        turnMark.textContent = game.nextTurn;
        store.dispatch('setMovesCount', 1);
        sessionStorage.setItem('movesCount', game.movesCount);

        // push currentCell into array of previously occupied cells for the last
        // player, determine whether game is over and update state accordingly
        if (game.nextTurn === 'X') {
          store.dispatch('setOCells', game.currentCell);
          sessionStorage.setItem('oCells', game.oCells.join(''));
          setGameOver(game.oCells);
        } else {
          store.dispatch('setXCells', game.currentCell);
          sessionStorage.setItem('xCells', game.xCells.join(''));
          setGameOver(game.xCells);
        }

        if (game.isOver) {
          const modalInstance = new Modal();
          const playersStateInfoInstance = new PlayersStateInfo();
          playersStateInfoInstance.render();
          modalInstance.render();
        }

        // if player2 is human, disable all cells when CPU is thinking
        if (!game.player2IsHuman) {
          if (
            (game.player1 === 'X' && game.nextTurn === 'O') ||
            (game.player1 === 'O' && game.nextTurn === 'X')
          ) {
            cells.map((id) => {
              document.querySelector(`#${id}`).disabled = true;
            });
          }
        }

        // if player2 is CPU, display "CPU is thinking"
        if (!game.player2IsHuman && !game.isOver)
          document.querySelector('#thinking').style.display = 'block';

        // CPU's turn
        setTimeout(() => {
          if (!game.player2IsHuman) {
            // if CPU goes first
            if (game.player1 === 'O' && game.nextTurn === 'X') {
              if (game.movesCount === 2) {
                blockCellInAlignment(game.xCells, true);
              }
              if (game.movesCount >= 4) {
                blockLastCell('X', game.xCells) ||
                  blockLastCell('O', game.oCells) ||
                  blockCellInAlignment(game.xCells) ||
                  blockCellInAlignment(
                    game.xCells.slice(0, game.xCells.length - 1),
                    false,
                  ) ||
                  blockCellInAlignment(game.oCells) ||
                  blockCellInAlignment(
                    game.oCells.slice(0, game.oCells.length - 1),
                    false,
                  ) ||
                  blockCellInAlignment(game.oCells, false) ||
                  blockCellInAlignment(game.xCells, false);
              }
              // if CPU goes second
            } else if (game.player1 === 'X' && game.nextTurn === 'O') {
              if (game.movesCount === 1) {
                let preferredCells = [1, 3, 7, 9];
                let idx = Math.floor(Math.random() * 4);
                let cell = document.querySelector(
                  `#cell${preferredCells[idx]}`,
                );

                // if cell is available, enable it and then click it
                if (cell.firstChild.textContent === '') {
                  cell.disabled = false;
                  cell.onclick = buttonClickEventHandler(cell, idx);
                  cell.click();
                } else {
                  cell = document.querySelector('#cell5');
                  cell.disabled = false;
                  cell.onclick = buttonClickEventHandler(cell, 4);
                  cell.click();
                }

                // remove "CPU is thinking"
                document.querySelector('#thinking').style.display = 'none';

                // enable the previously disabled cells
                cells.map((id, i) => {
                  cell = document.querySelector(`#${id}`);
                  cell.disabled = false;
                  cell.onclick = buttonClickEventHandler(cell, i);
                });
              } else if (game.movesCount >= 3) {
                blockLastCell('O', game.oCells) ||
                  blockLastCell('X', game.xCells) ||
                  blockCellInAlignment(game.oCells) ||
                  blockCellInAlignment(
                    game.oCells.slice(0, game.oCells.length - 1),
                    false,
                  ) ||
                  blockCellInAlignment(game.xCells) ||
                  blockCellInAlignment(
                    game.xCells.slice(0, game.xCells.length - 1),
                    false,
                  ) ||
                  blockCellInAlignment(game.xCells, false) ||
                  blockCellInAlignment(game.oCells, false);
              }
            }
          }
        }, 2000);
      }
    };

    // add a click event the board cells
    cells.map((id, i) => {
      document
        .querySelector(`#${id}`)
        .addEventListener(
          'click',
          buttonClickEventHandler(document.querySelector(`#${id}`), i),
        );
    });

    // Refresh button
    refreshBtn.addEventListener('click', () => {
      if (!game.player2IsHuman && !game.isActive) {
        // display "#thinking"
        document.querySelector('#thinking').style.display = 'block';

        store.dispatch('setIsActive', true);
        sessionStorage.setItem('isActive', 'true');

        cells.map((id, i) => {
          document.querySelector(`#${id}`).disabled = true;
        });

        setTimeout(() => {
          if (game.player1 === 'O') {
            let preferredCells = [1, 3, 5, 7, 9];
            let idx = Math.floor(Math.random() * 5);
            let cell = document.querySelector(`#cell${preferredCells[idx]}`);

            // enable the cell to be clicked and then click it
            cell.disabled = false;
            cell.onclick = buttonClickEventHandler(cell, idx);
            cell.click();

            // remove "CPU is thinking"
            document.querySelector('#thinking').style.display = 'none';

            // enable the previously disabled cells
            cells.map((id) => {
              cell = document.querySelector(`#${id}`);
              cell.disabled = false;
              cell.onclick = buttonClickEventHandler(cell, id);
            });
          }

          // update isOver state in store
          store.dispatch('setIsOver', false);
          sessionStorage.setItem('isOver', '');
        }, 1500);
      }
    });
  }
}
