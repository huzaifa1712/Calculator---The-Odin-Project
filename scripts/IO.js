// Interface to read/write to the DOM and control buttons
class IO{
    display = document.getElementById("display");
    buttonDiv = document.getElementById("buttons");
    attrString = "data-value";
    MAX_LENGTH = 12;

    constructor(calculator){
        this.calculator = calculator;
        this.buttons = this.getButtons();
        this.setup();
    }

    buttonSetup(){
        // add event listener to buttons div, use bubbling to get the value
        // if we use this inside evt function, this refers to elem that called. to get this as surrounding IO obj,
        // use  fn.bind(this) where arg is the this context passed in. returns new function with that (this) context.
        this.buttonDiv.addEventListener('click', function(evt){
            let target = evt.target; // the elem that was clicked
            
            if(target.hasAttribute(this.attrString)){
                this.calculator.inputHandler(target.getAttribute(this.attrString));
            }
            
        }.bind(this));
    }

    // to convert input into a format Calculator recognises
    // String code, Bool shiftKey
    keyboardInputConverter(code, shiftKey){
        // shift + Equal = "+"
        // shift + 8 = "*"
        // shift + 5 = "%"
        code = code.startsWith("Digit") ? code[code.length-1] : code;
        if(shiftKey){
            switch(code){
                case "Equal":
                    return "+";
                case "8":
                    return "*";
                case "5":
                    return "%";
            }
        }

        else{
            if(!isNaN(code)){
                return code;
            }

            switch(code){
                case "Slash":
                    return "/";
                case "Minus":
                    return "-";
                case "Period":
                    return ".";
                case "Equal":
                    return "=";
            }
        }

        return code;
    }

    keyboardSetup(){
        document.addEventListener("keydown", function(evt){
            const input = this.keyboardInputConverter(evt.code, evt.shiftKey);
            
            this.calculator.inputHandler(input);
  
        }.bind(this));
    }


    setup(){
        this.buttonSetup();
        this.keyboardSetup();
    }

    // get the current value on the display
    getDisplayInput(){
        return this.display.innerText;
    }

    // overwrites the current text completely with new text
    changeDisplay(text){   
        if(text.length > this.MAX_LENGTH){
            text = text.slice(0,this.MAX_LENGTH);
        }

        this.display.innerText = text;
    }

    // appends the text directly to the current contents of display
    appendDisplay(text){
        return this.changeDisplay(this.display.innerText + text);
    }

    writeDisplay(text, overwrite){
        text = String(text);
        
        return overwrite ?  this.changeDisplay(text) : this.appendDisplay(text);
    }

    // each call removes one num off the end of display, not delete entirely
    deleteDisplay(){
        const curr = this.getDisplayInput();

        if(curr.length == 1){
            this.writeDisplay(0, true);
        }

        else{
            this.writeDisplay(curr.slice(0,-1), true);
        }
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

    // include additional var hasBackground: true if toggle bg color, false if don't toggle
    // safety: always checks if need to toggle or not instead of just calling toggle blindly
    toggleButtonBackgroundByValue(dataValue, hasBackground){
        const btn = this.getButtonByValue(dataValue);
        const className = "button-hold";

        if(hasBackground && !btn.classList.contains(className)){
            btn.classList.add(className);
        }

        else if(!hasBackground && btn.classList.contains(className)){
            btn.classList.remove(className);
        }        
    }

}
