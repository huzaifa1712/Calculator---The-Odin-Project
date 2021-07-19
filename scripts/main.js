operate = Operate();
// IO object uses as an inteface to DOM for input/output
// Operate provides arithmetic logic

// Calculator acts as the controller for managing state and deciding which logic and IO functions to call
// as a result
calc = new Calculator(operate);