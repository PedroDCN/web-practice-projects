'use strict'

const $gameContainer = document.querySelector('[data-js="game-container"]')
const $ticTacToe = document.querySelector('[data-js="tictactoe"]')
const $squares = document.querySelectorAll('[data-square]')
const $startContainer = document.querySelector('[data-js="start-screen"]')
const $startButton = document.querySelector('[data-js="start-btn"]')
const $modalContainer = document.querySelector('[data-js="end-screen"]')
const $restartButton = document.querySelector('[data-js="restart-btn"]')

const handleStartClick = (function() {

    let game = createGame()

    function createGame() {
        return {
            turn: true,
            player: true,
            gameGrid: Array(9).fill(null),
            verifyDraw() {
                return !this.gameGrid.includes(null)
            },
            verifyWin() {
                let win = false
                const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
                lines.forEach((pos) => {
                    const squares = [this.gameGrid[pos[0]], this.gameGrid[pos[1]], this.gameGrid[pos[2]]]
                    if (squares.includes(null)) return
                    const crossWin = squares[0] && squares[1] && squares[2]
                    const circleWin = !(squares[0] || squares[1] || squares[2])
                    if (crossWin || circleWin) win = true
                })
                return win
            },
            gameLogic(index) {
                this.gameGrid[index] = this.turn
                let isWin = this.verifyWin(this.gameGrid)
                let isDraw = this.verifyDraw(this.gameGrid)
                return [isWin, isDraw]
            },
            switchTurn() {
                this.turn = !this.turn
                this.player = !this.player
            }
        }
    }

    function resetGame() {
        game = createGame()
    }

    function getTurnClass(turn) { return turn ? 'cross' : 'circle' }

    function getPlayerClass(player) { return player ? 'player1' : 'player2' }

    function putMark(parentElement, turn, player) {
        let mark = document.createElement('div')
        mark.classList.add(getTurnClass(turn), getPlayerClass(player))
        parentElement.append(mark)
    }

    function toggleSquares() {
        $squares.forEach((element) => element.classList.toggle('disabled'))
    }

    function resetSquares() {
        toggleSquares()
        $squares.forEach((element) => element.hasChildNodes() && element.removeChild(element.firstChild))
    }

    function endgameCallback(isWin, turn, player) {
        toggleSquares()
        $ticTacToe.removeEventListener('click', handleGameInput)

        if (isWin) {
            showEndGameModal(`${getTurnClass(turn)} is the winner`, turn, player)
        } else {
            showEndGameModal('it\'s a draw')
        }
    }

    function showEndGameModal(text, turn, player) {
        $modalContainer.classList.add('show', 'animation')
        $modalContainer.firstElementChild.classList.add('animation')
        $restartButton.addEventListener('click', handleRestartClick)

        const title = $modalContainer.querySelector('[data-js="modal-title"]')
        title.textContent = text

        const content = $modalContainer.querySelector('[data-js="modal-player"]')
        if (typeof turn === "boolean" && typeof player === "boolean") {
            content.innerHTML = ''
            const div = document.createElement('div')
            putMark(div, turn, player)
            content.appendChild(div)
        } else {
            content.innerHTML = ''
            const div1 = document.createElement('div')
            const div2 = document.createElement('div')
            putMark(div1, turn, player)
            putMark(div2, !turn, !player)
            content.append(div1, div2)
        }
    }

    function handleGameInput(event) {
        const element = event.target

        if (element.hasAttribute('data-square') && !element.hasChildNodes()) {
            putMark(element, game.turn, game.player)

            const index = Number(element.dataset.square) - 1
            const [isWin, isDraw] = game.gameLogic(index)

            if (isWin) endgameCallback(isWin,game.turn, game.player)
            else if (isDraw) endgameCallback(isWin)
            else game.switchTurn()
        }
    }

    function handleStartClick() {
        $startContainer.classList.add('animation')

        $startContainer.addEventListener('animationend', () => {
            $startContainer.classList.remove('show')
            $gameContainer.classList.add('show')
            $ticTacToe.classList.add('animation')

            $squares.forEach((square, index) => square.style.animationDelay = `calc(100ms * ${index})`)

            $squares[$squares.length-1].addEventListener('animationend', () => {
                $ticTacToe.classList.remove('animation')
                $squares.forEach(square => square.style.opacity = '1')

                $ticTacToe.addEventListener('click', handleGameInput)
            })
        })
    }

    function handleRestartClick() {
        resetGame()
        resetSquares()

        $modalContainer.classList.remove('show', 'animation')
        $modalContainer.firstElementChild.classList.remove('animation')

        $restartButton.removeEventListener('click', handleRestartClick)
        $ticTacToe.addEventListener('click', handleGameInput)
    }

    return handleStartClick
})()

$startButton.addEventListener('click', handleStartClick)

