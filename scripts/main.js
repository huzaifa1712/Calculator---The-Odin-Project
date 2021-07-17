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
        return b == 0 ? "Error" : a/b;
    }

    function negate(a){
        return a == 0 ? 0 : -a;
    }

    function percent(a){
        return a/100;
    }

    opMap = {
        '+': add,
        '-': minus,
        '*': multiply,
        '/':divide,
        'neg':negate,
        'percent':percent
    }
    

    return function(op, ...args){
        if(op in this.opMap){
            return this.opMap[op](...args);
        }

        else if(op === 'opMap'){
            return opMap;
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
    operate('neg',1),
    operate('percent',2)
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
    constructor(calculator){
        this.calculator = calculator;
        console.log(this.calculator);
    }

    display = document.getElementById("display");
    buttonDiv = document.getElementById("buttons");

    buttonSetup(){
        const attrString = "data-value";
        // add event listener to buttons div, use bubbling to get the value
        // if we use this inside evt function, this refers to elem that called. to get this as surrounding IO obj,
        // use  fn.bind(this) where arg is the this context passed in. returns new function with that (this) context.
        this.buttonDiv.addEventListener('click', function(evt){
            let target = evt.target; // the elem that was clicked

            if(target.hasAttribute(attrString)){
                this.calculator.testMethod(target.getAttribute(attrString));
            }
            
        }.bind(this));
    }

    setup(){
        this.buttonSetup();
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

}



// pass in IO object with certain methods and operate object with certain methods
// calculator object takes in Controller instead
// calc is the Model, Controller is interface between IO methods and model
// pass IO to controller, pass controller to calculator 
class Calculator{
    constructor(operate){
        this.io = new IO(this);
        console.log(this.io.calculator);
        this.io.buttonSetup();

        this.result = 0;
        this.text = String(this.result);
        this.overwrite = true;
        this.operate = operate;
    }

    testMethod(val){
        console.log("Called from IO : " + val);
    }
}

calc = new Calculator(operate);
// io = new IO(calc);