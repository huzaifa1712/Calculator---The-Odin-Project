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


class IO{
    constructor(){
        IO.buttonSetup();
    }

    static display = document.getElementById("display");
    static buttonDiv = document.getElementById("buttons");

    static buttonSetup(){
        const attrString = "data-value";
        // add event listener to buttons div, use bubbling to get the value
        this.buttonDiv.addEventListener('click', function(evt){
            let target = evt.target; // the elem that was clicked

            if(target.hasAttribute(attrString)){
                console.log(target);
            }
            
        });
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
// calculator object takes in Controller instead
// calc is the Model, Controller is interface between IO methods and model
// pass IO to controller, pass controller to calculator 
class Calculator{
    constructor(IOInterface, operate){
        this.IO = IOInterface;
        this.result = 0;
        this.text = String(this.result);
        this.overwrite = true;
        this.operate = operate;
    }
}