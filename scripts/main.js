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
        return a/b;
    }

    function negate(a){
        return a == 0 ? 0 : -a;
    }

    function percent(a){
        return a/100;
    }

    function handler(op, ...args){

    }
}


class IO{
    static display = document.getElementById("display");

    static buttonSetup(){
        // add event listeners to buttons
    }

    // overwrites the current text completely with new text
    static changeDisplay(text){   
        this.display.innerText = text;
    }

    // appends the text directly to the current contents of display
    static appendDisplay(text){
        return this.changeDisplay(this.display.innerText + text);
    }

}

