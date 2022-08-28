

const calculadoraContainer = document.querySelector('[data-js="calculator-number-pad"]')
const calculadoraDisplayCurrElement = document.querySelector('[data-js="calculator-display-value"]')
const calculadoraDisplayPrevElement = document.querySelector('[data-js="calculator-previous-value"]')

calculadoraContainer.addEventListener('click', handleCalculadoraClick)

class Calculadora {
    constructor(currElDisplay, prevElDisplay) {
        this.currentDisplay = currElDisplay
        this.previousDisplay = prevElDisplay
        this.clear()
    }

    addDigit(number) {
        if (this.current.replace('.', '').length === 10) return
        if (this.current.includes('.') && number === '.') return
        if (this.current === '0' && number === '0') return;
        if (this.current === '0' && number !== '.') return this.current = number
        this.current += number.toString()
    }

    removeDigit() {
        if (this.current.length === 1 || (this.current.length === 2 && this.current[0] === '-')) {
            this.current = '0'
        } else {
            this.current = this.current.slice(0, -1)
        }
    }

    invert() {
        if ((parseFloat(this.current)) !== 0){
            if (this.current[0] === '-') {
                this.current = this.current.slice(1)
            } else {
                this.current = ('-' + this.current).toString()
            }
        }
    }

    clear() {
        this.operation = undefined
        this.previous = ''
        this.current = '0'
    }

    addOperation(operation) {
        if (this.previous !== '') {
            const err = this.evaluate()
            if (err) return err
        }

        const _operation = [['divide', '/'], ['multiply', '*'], ['subtract', '-'], ['sum', '+']]
            .find(op => op[0] === operation)

        this.operation = _operation[1]
        this.previous = this.current
        this.current = '0'
    }

    evaluate() {
        let result

        const _previous = parseFloat(this.previous)
        const _current = parseFloat(this.current)

        if (Number.isNaN(_previous) || Number.isNaN(_current)) return

        if (this.operation === '/' && this.current === '0') {
            this.showError()
            return true
        }

        // https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/eval#never_use_eval
        result = Function(`'use strict'; return ${_previous} ${this.operation} ${_current}`)()

        const resultString = result.toString()
        const decimalDigits = resultString.split('.')[1]?.length
        const precision = decimalDigits > 3 ? 3 : decimalDigits // decimal precision for result

        this.operation = undefined
        this.previous = ''
        this.current = result.toFixed(precision)
    }

    updateDisplay() {
        const decimalPoint = this.current[this.current.length-1] === '.' ? '.' : ''
        this.currentDisplay.textContent = `${this.formatDecimalNumber(this.current)}${decimalPoint}`
        this.previousDisplay.textContent = `${this.formatDecimalNumber(this.previous)} ${this.operation || ''}`
    }

    formatDecimalNumber(number) {
        const floatNumber = parseFloat(number)
        const isNotNumber = Number.isNaN(floatNumber)
        if (isNotNumber) {
            return ''
        } else {
            return floatNumber.toLocaleString('en-US', {
                minimumFractionDigits: number.toString().split('.')[1]?.length,
                maximumFractionDigits: number.toString().split('.')[1]?.length,
            })
        }
    }

    showError() {
        this.clear()
        this.updateDisplay()
        this.currentDisplay.textContent = 'division error'
    }
}

const calculadora = new Calculadora(calculadoraDisplayCurrElement, calculadoraDisplayPrevElement)

function handleCalculadoraClick(event) {
    const element = event.target
    const [ operation, number ] = [ element.dataset.operation, element.dataset.number ]

    if (!operation && !number) return

    let err

    switch (true) {
        case operation === 'clear':
            calculadora.clear()
            break
        case operation === 'invert':
            calculadora.invert()
            break
        case operation === 'remove':
            calculadora.removeDigit()
            break
        case operation === 'evaluate':
            err = calculadora.evaluate()
            break
        case ['divide', 'multiply', 'subtract', 'sum'].some(_operation => _operation === operation):
            err = calculadora.addOperation(operation)
            break
        default:
            calculadora.addDigit(number)
    }

    if (!err) calculadora.updateDisplay()
}


