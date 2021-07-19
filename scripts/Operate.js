// Provides arithmetical logic

// This was done with message passing so I could choose the correct function directly using a
// key lookup instead of a lengthy switch case and also selectively expose other utility functions

function Operate(){
    const divBy0Msg = "DivBy0"
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
        return b == 0 ? divBy0Msg : a/b;
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
        return args.map((str) => str == divBy0Msg ? 0 : Number(str));
    }

    // input: array of args
    // output: true if all inputs are number
    function inputValidation(args){
        return !args.some((arg) => arg == divBy0Msg ? false : isNaN(arg));
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

