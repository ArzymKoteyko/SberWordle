
import React from "react";
import "../../css/app.scss"

import { Game } from "./game"

type Props = {}
type State = {}

export class App extends React.Component<Props, State> {
    render(): React.ReactNode { return(<>
        <div className="App">
            <Game></Game>
        </div>
    </>) }
}