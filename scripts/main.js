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


class IO{
    constructor(){
        IO.buttonSetup();
    }

    static display = document.getElementById("display");

    static buttonSetup(){
        // add event listeners  to buttons
        console.log("hi buttons");

    }

    // overwrites the current text completely with new text
    static changeDisplay(text){   
        this.display.innerText = text;
    }

    // appends the text directly to the current contents of display
    static appendDisplay(text){
        return this.changeDisplay(this.display.innerText + text);
    }

    static writeDisplay(text, overwrite){
        return overwrite ?  this.changeDisplay(text) : this.appendDisplay(text);
    }

}

io = new IO();

// pass in IO object with certain methods and operate object with certain methods
class Calculator{
    constructor(IOInterface, operate){
        this.IO = IOInterface;
        this.result = 0;
        this.text = String(this.result);
        this.overwrite = true;
        this.operate = operate;
    }
}