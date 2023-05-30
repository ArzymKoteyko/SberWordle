
import React from "react";
import "../../css/game.scss"

import {wordsList} from './words_list'


type WordProps = {onGuess}
type WordState = {pointer, word}
class Word extends React.Component<WordProps, WordState> {
    letters
    onGuess
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
        if (newWord.length == 5) {
            this.onGuess(newWord)
        }
        this.setState({word: newWord})
    }

    updateLetters = (lettersStates) => {
        for (let idx = 0; idx < this.letters.length; idx++) { 
            switch (lettersStates[idx]) {
                case Letter.ABSENT:
                    this.letters[idx].current.style.backgroundColor = 'red'
                    break
                case Letter.PRESENT:
                    this.letters[idx].current.style.backgroundColor = 'orange'
                    break
                case Letter.INPLACE:
                    this.letters[idx].current.style.backgroundColor = 'green'
                    break
            }
        }
    }

    inputLetter = (letter) => {
        console.log(this.letters[this.state.pointer].current.value)
        if (this.letters[this.state.pointer].current.value === '') {
            this.letters[this.state.pointer].current.value = letter.toLowerCase()
            this.letters[this.state.pointer].current.focus()
        }
        else if (this.movePointerRight()) {
            this.letters[this.state.pointer+1].current.value = letter.toLowerCase()
        }
        this.updateWord()
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
        if (event.target.value.length == 0) {
            this.movePointerLeft();
        }
        else if (event.target.value.length > 1) {
            if (this.movePointerRight(event.target.value.length-1)) {
                for (let i = event.target.value.length-1; i > 0; i--) {
                    this.letters[this.state.pointer+i].current.value = event.target.value[i].toLowerCase()
                }        
            }
            this.letters[this.state.pointer].current.value = event.target.value[0].toLowerCase()
        }
        else {
            this.letters[this.state.pointer].current.value = event.target.value[0].toLowerCase()
        }
        this.updateWord()
    }

    render(): React.ReactNode  { return(<div className="Word">
        <form>
            {this.letters.map((ref, idx) => {
                return (
                <input
                    key={idx}
                    ref={ref}
                    onChange={this.handleLetterInput}
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
type State = {goal, pointer}
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
            goal: wordsList[Math.floor(Math.random()*wordsList.length)]
        })
    }

    handleGuess = (word) => {
        let goal = this.state.goal;
        let lettersStates : Array<Number> = [] 
        for (let i = 0; i < goal.length; i++) {
            console.log(word[i].toUpperCase()); 
            if (goal[i] == word[i]) {
                lettersStates.push(Letter.INPLACE);
                this.inplaceCharacters.push(word[i]);
                  
                this.characters[word[i].toUpperCase()].current.style.backgroundColor = 'green';
            }
            else if (goal.includes(word[i])) {
                lettersStates.push(Letter.PRESENT);
                this.presentCharacters.push(word[i]);
                this.characters[word[i].toUpperCase()].current.style.backgroundColor = 'orange';
            }
            else {
                lettersStates.push(Letter.ABSENT);
                this.absentCharacters.push(word[i]);
                this.characters[word[i].toUpperCase()].current.style.backgroundColor = 'red';
            }
        }
        console.log(word);
        console.log(lettersStates);
        this.words[this.state.pointer].current.disableInput()
        this.words[this.state.pointer].current.updateLetters(lettersStates)
        if (word === goal) {
            console.log('You win')
        }
        else {
            this.words[this.state.pointer+1].current.enableInput()
            this.words[this.state.pointer+1].current.letters[0].current.focus()
            this.setState({
                pointer: this.state.pointer+1,
            })
        }
    }

    handleKeyClick = (key, event) => {
        console.log(key)
        this.words[this.state.pointer].current.inputLetter(key)
    }

    render(): React.ReactNode { return(<>
        <div className="Game">
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