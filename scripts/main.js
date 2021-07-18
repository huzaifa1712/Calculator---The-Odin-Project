function Operate(){

    function add(a,b){
        return a + b;
    }

    function minus(a,b){
        return a - b;
    }

    function multiply(a,b){
        return a * b;
    }

    function divide(a,b){
        return b == 0 ? "DivBy0" : a/b;
    }

    function negate(a){
        return a == 0 ? 0 : -a;
    }

    function percent(a){
        return a/100;
    }

    function isUnary(op){
        return op.startsWith('unary');
    }

    // input: array of args
    // output: array of args converted to Number
    function inputConverter(args){
        return args.map((str) => Number(str));
    }

    // input: array of args
    // output: true if all inputs are number
    function inputValidation(args){
        return !args.some(isNaN);
    }

    opMap = {
        '+': add,
        '-': minus,
        '*': multiply,
        '/':divide,
        'unary-neg':negate,
        'unary-percent':percent,
    }

    return function(op, ...args){
        // console.log("from operate");
        // console.log(op, args);
        if(op === 'opMap'){
            return opMap;
        }

        if (op === 'isUnary'){
            return isUnary(...args)
        }

        if(!inputValidation(args)){
            throw "Error on input validation: " + args;
        }
        if(op in opMap){
            return opMap[op](...inputConverter(args));
        }

        
    }

}

operate = Operate();

testOperate = [
    operate('+',1,2),
    operate('-',1,2),
    operate('*',3,2),
    operate('/',4,3),
    operate('/',1,0),
    operate('unary-neg',1),
    operate('unary-percent',2)
]


// class IO{
//     constructor(calculator){
//         this.calculator = calculator;
//         IO.buttonSetup();
//     }

//     static display = document.getElementById("display");
//     static buttonDiv = document.getElementById("buttons");

//     static buttonSetup(){
//         const attrString = "data-value";
//         // add event listener to buttons div, use bubbling to get the value
//         this.buttonDiv.addEventListener('click', function(evt){
//             let target = evt.target; // the elem that was clicked

//             if(target.hasAttribute(attrString)){
//                 console.log(target);
//             }
            
//         });
//     }

//     // overwrites the current text completely with new text
//     static changeDisplay(text){   
//         this.display.innerText = text;
//     }

//     // appends the text directly to the current contents of display
//     static appendDisplay(text){
//         return this.changeDisplay(this.display.innerText + text);
//     }

//     static writeDisplay(text, overwrite){
//         return overwrite ?  this.changeDisplay(text) : this.appendDisplay(text);
//     }

// }

class IO{
    display = document.getElementById("display");
    buttonDiv = document.getElementById("buttons");
    attrString = "data-value";

    constructor(calculator){
        this.calculator = calculator;
        this.buttons = this.getButtons();
    }

    

    buttonSetup(){
        // add event listener to buttons div, use bubbling to get the value
        // if we use this inside evt function, this refers to elem that called. to get this as surrounding IO obj,
        // use  fn.bind(this) where arg is the this context passed in. returns new function with that (this) context.
        this.buttonDiv.addEventListener('click', function(evt){
            let target = evt.target; // the elem that was clicked

            if(target.hasAttribute(this.attrString)){
                //this.calculator.testMethod(target.getAttribute(attrString));
                this.calculator.inputHandler(target.getAttribute(this.attrString));
            }
            
        }.bind(this));
    }

    setup(){
        this.buttonSetup();
    }

    // get the current value on the display
    displayInput(){
        return this.display.innerText;
    }

    // overwrites the current text completely with new text
    changeDisplay(text){   
        this.display.innerText = text;
    }

    // appends the text directly to the current contents of display
    appendDisplay(text){
        return this.changeDisplay(this.display.innerText + text);
    }

    writeDisplay(text, overwrite){
        return overwrite ?  this.changeDisplay(text) : this.appendDisplay(text);
    }


    getButtons(){
        let attrString = this.attrString;
        return [...this.buttonDiv.querySelectorAll("button")].reduce(
            function(acc,curr){
                if(curr.hasAttribute(this.attrString)){
                    acc[curr.getAttribute(this.attrString)] = curr;
                    return acc
                }
            }.bind(this),{}
        );
    }

    getButtonByValue(dataValue){
        return this.buttons[dataValue];
    }

    toggleButtonByValue(dataValue){
        const btn = this.getButtonByValue(dataValue);
        btn.disabled = !btn.disabled;
    }

    toggleButtonBackgroundByValue(dataValue){
        const btn = this.getButtonByValue(dataValue);
        btn.classList.toggle("button-hold");
        // btn.style.backgroundColor  = getComputedStyle(document.body).getPropertyValue("--button-bg-hover");
        
    }

}



// pass in IO object with certain methods and operate object with certain methods
// calculator object takes in Controller instead
// calc is the Model, Controller is interface between IO methods and model
// pass IO to controller, pass controller to calculator 
class Calculator{
    constructor(operate){
        this.io = new IO(this);
        this.io.buttonSetup();

        this.overwrite = true;
        this.operate = operate;

        this.currentOperator = null;
        this.leftOperand = null;

        // arrays for Numbers, Special operations, and opMap operations
        // to check the type of input received so can decide appropriate action
        this.numbers = ["0","1","2","3","4","5","6","7","8","9"];
        this.special = ["float", "eval", "clear"];
        this.opMap =  [...Object.keys(this.operate('opMap'))];
        
    }


    isNumber(val){
        return this.numbers.includes(val);
    }

    isSpecial(val){
        return this.special.includes(val);
    }

    isOp(val){
        return this.opMap.includes(val);
    }

    numberHandler(numberString){
        console.log("Number: " + numberString);
        
        // do nothing so that next input overwrites
        if(numberString == "0" && this.io.displayInput() == "0"){
            return;
        }
        //this.io.writeDisplay( `number:${numberString}`,numberString);
        if (this.overwrite){
            this.io.writeDisplay(numberString, true);
            this.overwrite = false;
        }
        
        else{
            this.io.writeDisplay(numberString, false);
        }
    }

    specialHandler(specialString){
        console.log("Special: " + specialString);
        //this.io.writeDisplay( `special:${specialString}`,specialString);

        if(specialString == "eval"){
            this.evaluate();
            return;
        }
    }

    // read current display input, apply unary operator to it, write back to display
    // no storage of results or state needed
    unaryHandler(opString){
        console.log("unary handler: " + opString);
        const currentDisplay = this.io.displayInput();
        const result = this.operate(opString, currentDisplay);
        this.io.writeDisplay(result, true);
    }

    canEvaluate(){
        return this.currentOperator !== null && this.leftOperand !== null;
    }

    // calculate value if there is currently expr to be evaluated,then write to display
    // set overwrite to true, store result
    // reset variables for operator, left operand
    evaluate(){
        if(this.canEvaluate()){
            const rightOperand = this.io.displayInput();
            // console.log("Left: " + this.leftOperand);
            // console.log("op: " + this.currentOperator);
            // console.log("Right: " + rightOperand);

            const result = this.operate(this.currentOperator,this.leftOperand, rightOperand);
            this.io.writeDisplay(result, true);
            this.overwrite = true;
            this.io.toggleButtonBackgroundByValue(this.currentOperator);



            // console.log(result);
        }
    }

    binaryHandler(opString){
        console.log('binary handler: ' + opString);

        // if currently can eval expression, evaluate first
        // if(this.canEvaluate()){

        // }

        this.io.toggleButtonBackgroundByValue(opString);
        this.currentOperator = opString;
        this.leftOperand = this.io.displayInput();
        this.overwrite = true;
    }

    opHandler(opString){
        //console.log("Op: " + opString);
        //this.io.writeDisplay( `op:${opString}`,opString);
        if(this.operate('isUnary', opString)){
            this.unaryHandler(opString);
            return;
        }

        else{
            this.binaryHandler(opString);
            return;
        }
    }

    inputHandler(inputString){
        if(this.isNumber(inputString)){
            this.numberHandler(inputString);
            return;
        }

        if(this.isSpecial(inputString)){
            this.specialHandler(inputString);
        }

        if(this.isOp(inputString)){
            this.opHandler(inputString);
        }
    }

}

calc = new Calculator(operate);
// io = new IO(calc);