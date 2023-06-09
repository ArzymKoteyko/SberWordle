
import React, { ReactElement } from "react";
import Confetti from 'react-confetti'
import "../../css/game.scss"

const colorSuccess = '#12A557'
const colorSuccessTransparent = 'rgba(18, 165, 87, 0.3)'
const colorWarning = '#EF6B25'
const colorWarningTransparent = 'rgba(239, 107, 37, 0.3)'
const colorCritical = '#DC283A'
const colorCriticalTransparent = 'rgba(220, 40, 58, 0.3)'

const shakeAnimation = [
    {transform: 'translate3d(-1px, 0, 0)'},  // 1
    {transform: 'translate3d(2px, 0, 0)'},   // 2
    {transform: 'translate3d(-4px, 0, 0)'},  // 3
    {transform: 'translate3d(4px, 0, 0)'},   // 4
    {transform: 'translate3d(-4px, 0, 0)'},  // 3
    {transform: 'translate3d(4px, 0, 0)'},   // 4
    {transform: 'translate3d(-4px, 0, 0)'},  // 3
    {transform: 'translate3d(2px, 0, 0)'},   // 2
    {transform: 'translate3d(-1px, 0, 0)'},  // 1

    // 1 {transform: 'translate3d(-1px, 0, 0)'},
    // 2 {transform: 'translate3d(2px, 0, 0)'},
    // 3 {transform: 'translate3d(-4px, 0, 0)'},
    // 4 {transform: 'translate3d(4px, 0, 0)'}
]

import {wordsList} from './words_list'


type WordProps = {onGuess}
type WordState = {pointer, word}
class Word extends React.Component<WordProps, WordState> {
    letters
    onGuess
    notChanged = true
    constructor(props) {
        super(props)
        this.state = {
            pointer: 0,
            word: '',
        }
        this.onGuess = props.onGuess ?? (() => {});
        this.letters = Array.apply(null, {length: 5}).map(() => {return React.createRef()})
    }

    componentDidMount(): void {
        this.disableInput()
    }

    disableInput = () => {
        for (let letter of this.letters) {
            letter.current.disabled = true;
        }
    }

    enableInput = () => {
        for (let letter of this.letters) {
            letter.current.disabled = false;
        }
    }

    updateWord = () => {
        let newWord = this.letters.map((letter) => {return letter.current.value}).join('')
        /*
        if (newWord.length == 5) {
            this.onGuess(newWord)
        }
        */
        this.setState({word: newWord})
    }

    enterWord = () => {
        if (this.state.word.length == 5) {
            this.onGuess(this.state.word)
        }
        else {
            for (let letter of this.letters) {
                letter.current.animate(
                    shakeAnimation,
                    {duration: 500, iterations: 1}
                )
            }
        }
    }

    emptyWord = () => {
        for (let letter of this.letters) {
            letter.current.value = '';
            letter.current.style.backgroundColor = 'rgba(0,0,0,0)'
            letter.current.style.borderColor ='white'
        }
        this.setState({
            word: '',
            pointer: 0
        })
    }

    updateLetters = (lettersStates) => {
        for (let idx = 0; idx < this.letters.length; idx++) { 
            switch (lettersStates[idx]) {
                case Letter.ABSENT:
                    this.letters[idx].current.style.backgroundColor = colorCriticalTransparent
                    this.letters[idx].current.style.borderColor = colorCritical
                    break
                case Letter.PRESENT:
                    this.letters[idx].current.style.backgroundColor = colorWarningTransparent
                    this.letters[idx].current.style.borderColor = colorWarning
                    break
                case Letter.INPLACE:
                    this.letters[idx].current.style.backgroundColor = colorSuccessTransparent
                    this.letters[idx].current.style.borderColor = colorSuccess
                    break
            }
        }
    }

    inputLetter = (letter) => {
        if (this.letters[this.state.pointer].current.value === '') {
            this.letters[this.state.pointer].current.value = letter.toLowerCase()
            this.letters[this.state.pointer].current.focus()
        }
        else if (this.letters[this.state.pointer+1]) {
            if (this.letters[this.state.pointer+1].current.value !== '' && this.notChanged) {
                this.letters[this.state.pointer].current.value = letter.toLowerCase()
                this.letters[this.state.pointer].current.focus()
                this.notChanged = false
            }
            else if (this.movePointerRight()) {
                this.letters[this.state.pointer+1].current.value = letter.toLowerCase()
                if (this.state.pointer == 5) {
                    this.notChanged = true
                }
            }
        }
        else {
            this.letters[this.state.pointer].current.value = letter.toLowerCase()
            this.letters[this.state.pointer].current.focus()
            this.notChanged = true
        }
        this.updateWord()
    }

    removeLetter = () => {
        if (this.letters.length > 0) {
            this.letters[this.state.pointer].current.value = ''
            if (this.state.pointer != 0) {
                this.letters[this.state.pointer-1].current.focus()
                this.setState({pointer: this.state.pointer-1})
            }
            else {
                this.letters[this.state.pointer].current.focus()
            }
        }
    }

    movePointerRight = (dst=1) => {
        if (this.state.pointer < 5-dst) {
            this.letters[this.state.pointer+dst].current.focus()
            this.setState({pointer: this.state.pointer+dst})
            return true
        }
        else {
            return false
        }
    }

    movePointerLeft = () => {
        if (this.state.pointer > 0) {
            this.letters[this.state.pointer-1].current.focus()
            this.setState({pointer: this.state.pointer-1})
            return true
        }
        else {
            return false
        }
    }

    handleLetterInput = (event) => {
        console.log(this.state.pointer)
        if (event.target.value.length > 1) {
            if (this.movePointerRight(event.target.value.length-1)) {
                for (let i = event.target.value.length-1; i > 0; i--) {
                    this.letters[this.state.pointer+i].current.value = event.target.value[i].toLowerCase()
                }        
            }
            this.letters[this.state.pointer].current.value = event.target.value[0].toLowerCase()
        }
        this.updateWord()
    }

    handleLetterFocus = (idx, event) => {
        console.log(this.state.pointer)
        this.notChanged = true
        this.movePointerRight(idx - this.state.pointer)
    }

    render(): React.ReactNode  { return(<div className="Word">
        <form>
            {this.letters.map((ref, idx) => {
                return (
                <input
                    readOnly={true}
                    key={idx}
                    ref={ref}
                    onChange={this.handleLetterInput}
                    onClick={(event) => {this.handleLetterFocus(idx, event)}}
                ></input>)
            })}
        </form>
    </div>)}
}

const Letter = {
    ABSENT: 1,
    PRESENT: 2,
    INPLACE: 3
}

const KeyboardCharacters = [
    ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ' ],
    ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
    ['Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю']
]

type Props = {}
type State = {goal, pointer, isWin, isConfetti, score}
export class Game extends React.Component<Props, State> {
    words
    absentCharacters: Array<String> = []
    presentCharacters: Array<String> = []
    inplaceCharacters: Array<String> = []
    characters
    constructor(porps) {
        super(porps)
        this.state = {
            goal: 'coder',
            pointer: 0,
            isWin: false,
            isConfetti: false,
            score: 0,
        }
        this.words = Array.apply(null, {length: 6}).map(() => {return React.createRef()})
        this.characters = {
            'А': React.createRef(),
            'Б': React.createRef(),
            'В': React.createRef(),
            'Г': React.createRef(),
            'Д': React.createRef(),
            'Е': React.createRef(),
            'Ж': React.createRef(),
            'З': React.createRef(),
            'И': React.createRef(),
            'Й': React.createRef(),
            'К': React.createRef(),
            'Л': React.createRef(),
            'М': React.createRef(),
            'Н': React.createRef(),
            'О': React.createRef(),
            'П': React.createRef(),
            'Р': React.createRef(),
            'С': React.createRef(),
            'Т': React.createRef(),
            'У': React.createRef(),
            'Ф': React.createRef(),
            'Х': React.createRef(),
            'Ц': React.createRef(),
            'Ч': React.createRef(),
            'Ш': React.createRef(),
            'Щ': React.createRef(),
            'Ъ': React.createRef(),
            'Ы': React.createRef(),
            'Ь': React.createRef(),
            'Э': React.createRef(),
            'Ю': React.createRef(),
            'Я': React.createRef(),
        }
    }

    componentDidMount(): void {
        this.words[0].current.enableInput();
        this.setState({
            goal: wordsList[Math.floor(Math.random()*wordsList.length)],
        })
        addEventListener("keydown", (event) => {
            if (event.isComposing || event.code === 'Enter') {
                this.words[this.state.pointer].current.enterWord()
            }
            else if (event.isComposing || event.code === 'Backspace') {
                this.words[this.state.pointer].current.movePointerLeft()
            }
        })
    }

    handleGuess = (word) => {
        let goal = this.state.goal;
        let lettersStates : Array<Number> = [] 
        let guessScore = 0
        if (Object.values(wordsList).includes(word)) {
            for (let i = 0; i < goal.length; i++) {
                if (goal[i] == word[i]) {
                    lettersStates.push(Letter.INPLACE);
                    this.inplaceCharacters.push(word[i]);
                    this.characters[word[i].toUpperCase()].current.style.backgroundColor = colorSuccessTransparent;
                    this.characters[word[i].toUpperCase()].current.style.borderColor = colorSuccess; 
                    guessScore += 100
                }
                else if (goal.includes(word[i])) {
                    lettersStates.push(Letter.PRESENT);
                    this.presentCharacters.push(word[i]);
                    this.characters[word[i].toUpperCase()].current.style.backgroundColor = colorWarningTransparent;
                    this.characters[word[i].toUpperCase()].current.style.borderColor = colorWarning;
                    guessScore += 25
                }
                else {
                    lettersStates.push(Letter.ABSENT);
                    this.absentCharacters.push(word[i]);
                    this.characters[word[i].toUpperCase()].current.style.backgroundColor = colorCriticalTransparent;
                    this.characters[word[i].toUpperCase()].current.style.borderColor = colorCritical;
                    guessScore += 5
                }
            }
            
            this.words[this.state.pointer].current.disableInput()
            this.words[this.state.pointer].current.updateLetters(lettersStates)
            if (word === goal) {
                this.setState({ 
                    isWin: true,
                    isConfetti: true
                })
                setTimeout(() => {
                    this.setState({ 
                        isConfetti: false,
                    })
                }, 10000)
                guessScore += 500
            }
            else {
                this.words[this.state.pointer+1].current.enableInput()
                this.words[this.state.pointer+1].current.letters[0].current.focus()
                this.setState({
                    pointer: this.state.pointer+1,
                })
            }
            

            let prevScore = this.state.score
            for (let i=0; i<guessScore; i++) {
                setTimeout(() => {
                    this.setState({ score: this.state.score + 1 });
                }, i*15)
            }
            setTimeout(() => {
                this.setState({ score: prevScore + guessScore });
            }, guessScore*15);
        }
        else {
            for (let letter of this.words[this.state.pointer].current.letters) {
                letter.current.animate(
                    shakeAnimation,
                    {duration: 500, iterations: 1}
                )
            }
            setTimeout(() => {
                this.words[this.state.pointer].current.emptyWord()
                this.words[this.state.pointer].current.letters[0].current.focus()    
            }, 500)
        }
    }

    handleKeyClick = (key, event) => {
        this.words[this.state.pointer].current.inputLetter(key)
    }

    restart = () => {
        for (let word of this.words) {
            word.current.emptyWord();
        }
        for (let key of Object.keys(this.characters)) {
            this.characters[key].current.style.backgroundColor = 'rgba(0,0,0,0)'
            this.characters[key].current.style.borderColor ='white'
        }
        this.words[this.state.pointer].current.disableInput()
        this.words[0].current.enableInput()
        this.words[0].current.letters[0].current.focus()
        this.setState({ 
            pointer: 0,
            goal: wordsList[Math.floor(Math.random()*wordsList.length)],
            isWin: false
        })
    }
    render(): React.ReactNode { return(<>
        <div className="Game">
            {(() => {
                if (this.state.isConfetti) return <Confetti numberOfPieces={400} recycle={false}/>
            })()}
            <div className="Menu">
                <div className="restart" onClick={this.restart}></div>
                <div className="score">
                    <h2>Очки</h2>
                    <h1>{this.state.score}</h1>
                </div>
            </div>
            <div className="Puzzle">
                {this.words.map((ref, idx) => {
                    return <Word
                        key={idx}
                        ref={ref}
                        onGuess={this.handleGuess}
                    />
                })}
            </div>
            <div className="Keyboard">
                {KeyboardCharacters.map((row, idx) => { 
                    if (idx === 2) {
                        return (<div key={idx} className="key-row">
                            <div key={'enter'} className="key enter" onClick={() => this.words[this.state.pointer].current.enterWord()}></div>
                            {row.map((key, idx) => {
                                return <div 
                                    key={idx} 
                                    ref={this.characters[key]}
                                    onClick={(event) => this.handleKeyClick(key, event)} 
                                    className="key">
                                    <p>{key}</p>
                                </div>
                            })}
                            <div key={'delete'} className="key delete" onClick={() => this.words[this.state.pointer].current.removeLetter()}></div>
                        </div>)
                    }
                    return (<div key={idx} className="key-row">{
                        row.map((key, idx) => {
                            return <div 
                                key={idx} 
                                ref={this.characters[key]}
                                onClick={(event) => this.handleKeyClick(key, event)} 
                                className="key">
                                <p>{key}</p>
                            </div>
                        })
                    }</div>)
                })}
            </div>
        </div>
    </>) }
}