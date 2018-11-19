import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

class Square extends Component {
    state = {}
    render() {
        return (
            <div style={!this.props.gameOver ? { display: "block" } : { display: "none" }} className={this.props.class}>

            </div>
        );
    }
};





class Board extends Component {

    render() {

        let { snake } = this.props;
        let squareArray = [];
        let boxClass;

        for (let x = 0; x < 20; x++) {
            for (let y = 0; y < 20; y++) {

                let snakeArray = [x, y];
                boxClass = "square normalSquare";

                for (let x in this.props.snake) {
                    if (JSON.stringify(snakeArray) === JSON.stringify(this.props.snake[x])) {
                        boxClass = "square snakeSquare";
                    }
                }

                if (x === this.props.food[0] && y === this.props.food[1]) {
                    boxClass = "square foodSquare";
                }

                squareArray.push(
                    <Square
                        key={x + "_" + y}
                        id={x + "_" + y}
                        class={boxClass}
                        gameOver={this.props.gameOver}
                    />
                )
            }
        }
        return (
            <div className="board">
                {squareArray}
            </div>
        );
    }
}


class App extends Component {
    state = {
        snake: [],
        food: [],
        startGame: false,
        direction: 39,
        gameOver: false
    }

    FoodPosition = () => {
        let x = Math.floor(Math.random() * 19);
        let y = Math.floor(Math.random() * 19);
        let food = [x, y];

        this.setState({
            food: food
        });
    }

    foodCollision = () => {

        let { snake } = this.state;
        let { food } = this.state

        if (JSON.stringify(food) === JSON.stringify(snake[0])) {
            this.FoodPosition();

            let snakeCopy = JSON.parse(JSON.stringify(this.state.snake));
            let lastPosition = snakeCopy[snakeCopy.length - 1];

            if (this.state.direction === 39) {
                let newCell = [lastPosition[0], lastPosition[1] - 1];
                snakeCopy.push(newCell);
            }


            if (this.state.direction === 37) {
                let newCell = [lastPosition[0], lastPosition[1] + 1];
                snakeCopy.push(newCell);
            }


            if (this.state.direction === 38) {
                let newCell = [lastPosition[0] - 1, lastPosition[1]];
                snakeCopy.push(newCell);
            }


            if (this.state.direction === 40) {
                let newCell = [lastPosition[0] + 1, lastPosition[1]];
                snakeCopy.push(newCell);
            }

            this.setState({
                snake: snakeCopy
            })
        }

    }


    wallCollision = () => {

        let { snake } = this.state;
        let snakeCopy = JSON.parse(JSON.stringify(snake));
        // console.log(snakeCopy[0][0]);

        //Wall right
        if (snakeCopy[0][1] > 19) {
            snakeCopy[0][1] = 0;
        }

        //Wall Left 
        if (snakeCopy[0][1] < 0) {
            snakeCopy[0][1] = 19
        }

        //Wall Top
        if (snakeCopy[0][0] < 0) {
            snakeCopy[0][0] = 19;
        }

        //Wall Bottom 
        if (snakeCopy[0][0] > 19) {
            snakeCopy[0][0] = 0
        }

        this.setState({
            snake: snakeCopy
        })
    }

    snakeCollision = () => {
        let snakeCopy = JSON.parse(JSON.stringify(this.state.snake));

        for (let x = 1; x < snakeCopy.length; x++) {
            if (JSON.stringify(snakeCopy[0]) === JSON.stringify(snakeCopy[x])) {
                this.setState({
                    gameOver: true
                })
            }
        }
    }


    endGame = () => {
        if (this.state.gameOver) {
            clearInterval(this.moveSnake);
        }
    }

    moveSnake = () => {
        console.log("moving snake");
        let { snake } = this.state;
        let snakeSize = snake.length - 1;
        let firstCell = snake[0][0];
        let copy = JSON.parse(JSON.stringify(this.state.snake));


        if (this.state.direction === 37) {
            let newCell = [snake[0][0], snake[0][1] - 1];
            copy.pop();
            copy.unshift(newCell);
        }


        if (this.state.direction === 39) {
            let newCell = [snake[0][0], snake[0][1] + 1];
            copy.pop();
            copy.unshift(newCell);
        }


        if (this.state.direction === 40) {
            let newCell = [snake[0][0] + 1, snake[0][1]];
            copy.pop();
            copy.unshift(newCell);
        }

        if (this.state.direction === 38) {
            let newCell = [snake[0][0] - 1, snake[0][1]];
            copy.pop();
            copy.unshift(newCell);
        }

        this.setState({
            snake: copy
        })

        this.foodCollision();
        this.wallCollision();
        this.snakeCollision();
        this.endGame();
    };


    startGame = () => {

        console.log("restarted");

        this.setState({
            gameOver: false,
            startGame: true,
            snake: [
                [5, 5],
                [5, 4],
                [5, 3],
                [5, 2],
                [5, 1]
            ],
            food: [2, 11],
        });

        this.moveSnake = setInterval(this.moveSnake, 110);
        console.log("after");
    }


    handleKeys = (e) => {

        if (e.keyCode === 37) {
            this.setState({
                direction: 37
            })
        }

        else if (e.keyCode === 38) {
            this.setState({
                direction: 38
            })
        }

        else if (e.keyCode === 39) {
            this.setState({
                direction: 39
            })
        }

        else if (e.keyCode === 40) {
            this.setState({
                direction: 40
            })
        }
    }


    componentWillMount() {
        document.addEventListener("keydown", this.handleKeys);
    }


    reset = () => {
        window.location.reload();
    }

    render() {

        let gameOver;

        return (
            <div className="app">
                <h1></h1>
                <div id="boardWrap">
                    <div style={this.state.startGame ? { display: "block" } : { display: "none" }} id="score">Score: {this.state.snake.length - 5}</div>

                    <div id="gameOver" style={this.state.gameOver ? { display: "block" } : { display: "none" }} className="overlay">
                        <h2 className="h2">Game Over</h2>
                        <h3 className="h2">You got {this.state.snake.length - 5} points!</h3>
                        <button id="reset" onClick={this.reset} className="content">Replay</button>
                    </div>



                    <div style={!this.state.startGame ? { display: "block" } : { display: "none" }} className="overlay">
                        <button onClick={this.startGame} className="content">Play Game</button>
                    </div>

                    <Board startGame={this.state.startGame} food={this.state.food} snake={this.state.snake} />
                </div>
            </div>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('root'));
