export default class StateMachine {
    constructor(numOfStates) {
        this.states = new Array(numOfStates).fill(false); // it gets true or false successively denotes the state of the nth element. Alias can be given outer the class.

        // for each state, we create an independent variables from transformations of assets.
        this.statesCounter = []

        for (let i = 0; i < this.states.length; i++) {
            this.statesCounter.push(0)
        }

        // speed rate of each state state
        this.speedRatesOfCounters = []

        for (let i = 0; i < this.states.length; i++) {
            this.speedRatesOfCounters.push(0.1)
        }
    }

    updateIndependentVariables(){ // respect to independent variables
        for (let i = 0; i < this.states.length; i++)
            if (this.states[i]) {
                this.statesCounter[i] += this.speedRatesOfCounters[i]
            }
    }

    getIndependentVar(ind){
        return this.statesCounter[ind];
    }

    changeState(stateIndex, booleanNew){
        this.states[stateIndex] = booleanNew
    }

    setSpeedOfCounter(stateIndex, speedOfCounter){
        this.speedRatesOfCounters[stateIndex] = speedOfCounter
    }
}