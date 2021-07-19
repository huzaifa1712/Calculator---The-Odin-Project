// Class to manage state and communicate between Operate functions (model logic) and IO functions (view logic)
class Calculator{
    constructor(operate){
        // constant references to helper objects 
        this.io = new IO(this);
        this.operate = operate;

        // state variables that change over time
        this.overwrite = true;
        this.currentOperator = null;
        this.leftOperand = null;
        // arrays for Numbers, Special operations, and opMap operations
        // to check the type of input received so can decide appropriate action
        this.numbers = ["0","1","2","3","4","5","6","7","8","9"];
        this.special = ["float", "eval", "clear", "del"];
        this.opMap =  [...Object.keys(this.operate('opMap'))];
        
    }

    // helper predicates
    isNumber(val){
        return this.numbers.includes(val);
    }

    isSpecial(val){
        return this.special.includes(val);
    }

    isOp(val){
        return this.opMap.includes(val);
    }

    // Evaluation logic for evaluating current operator
    canEvaluate(){
        return this.currentOperator !== null && this.leftOperand !== null;
    }

    // calculate value if there is currently expr to be evaluated,then write to display
    // set overwrite to true, store result
    // reset variables for operator, left operand
    evaluate(){
        if(this.canEvaluate()){
            const rightOperand = this.io.getDisplayInput();
            const result = this.operate(this.currentOperator,this.leftOperand, rightOperand);

            this.io.writeDisplay(result, true);
            this.overwrite = true;
            this.io.toggleButtonBackgroundByValue(this.currentOperator, false);

            // reset operation state
            this.currentOperator = null;
            this.leftOperand  = null;
        }

    }

    // Input handlers

     // helper to convert input to a form Calculator understands
     convertInput(inputString){  
        if(!inputString){return;}

        const map = {
            ".":"float",
            "=":"eval",
            "%":"unary-percent",
            "Escape":"clear",
            "Backspace":"del",
        }

        if(inputString in map){
            return map[inputString];
        }

        return inputString;
    }

    inputHandler(inputString){

        inputString = this.convertInput(inputString);
        
        if(this.isNumber(inputString)){
            this.numberHandler(inputString);
            return;
        }

        if(this.isSpecial(inputString)){
            this.specialHandler(inputString);
            return;
        }

        if(this.isOp(inputString)){
            this.opHandler(inputString);
            return;
        }
    }

    numberHandler(numberString){
        // to prevent appending to display when current display is 0
        if(this.io.getDisplayInput() == "0"){
            this.overwrite = true;
        }

        if (this.overwrite){
            this.io.writeDisplay(numberString, true);
            this.overwrite = false;

            // if there is an operator toggle off the bg color
            if(this.currentOperator){
                this.io.toggleButtonBackgroundByValue(this.currentOperator, false);
            }
        }
        
        else{
            this.io.writeDisplay(numberString, false);
        }
    }

    binaryHandler(opString){    
        this.evaluate();

        this.io.toggleButtonBackgroundByValue(opString, true);
        this.currentOperator = opString;
        this.leftOperand = this.io.getDisplayInput();
        this.overwrite = true;
    }

    opHandler(opString){
        if(this.operate('isUnary', opString)){
            this.unaryHandler(opString);
            return;
        }

        else{
            this.binaryHandler(opString);
            return;
        }
    }

    // read current display input, apply unary operator to it, write back to display
    // no storage of results or state needed
    unaryHandler(opString){
        const currentDisplay = this.io.getDisplayInput();
        const result = this.operate(opString, currentDisplay);
        this.io.writeDisplay(result, true);
    }

    specialHandler(specialString){
        switch(specialString){
            case "eval":
                this.evaluate();
                break;

            case "clear":
                this.clear();
                break;

            case "del":
                this.delete();
                break;

            case "float":
                this.float();
                break;      
        }

    }

    // Special operator logic
     // reset leftOperand, currentOperator, overwrite and display value
     clear(){
        this.leftOperand = null;

        if(this.currentOperator != null){
            this.io.toggleButtonBackgroundByValue(this.currentOperator, false);
        }
        this.currentOperator = null;
        this.overwrite = true;
        this.io.writeDisplay(0, true);
    }

    // back space/delete - each press removes one number off the end of the string
    delete(){
        this.io.deleteDisplay();
        return;
    }
    
    // put a . after current display input
    // only do if there isn't a . already there
    float(){

        const curr = this.io.getDisplayInput();
        const placeString = ".";

        if(!curr.includes(placeString)){
            this.io.writeDisplay(placeString, false);

            if(this.overwrite == true){
                this.overwrite = false;
            }
        }

        else if (this.overwrite ==  true){
            this.io.writeDisplay("0" + placeString, true);
            this.overwrite = false;
        }

    }  
}

