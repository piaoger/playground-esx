
// This javascript shows how to use apply, call and bind.

// ----------------------------------------------------
// apply, call and bind
//   Bind () Allows us to Borrow Methods
//   Bind() supports partial function application,
//   Borrowing Functions with Apply and Call
//   Set the this value with Apply or Call
//   Use Apply () to Execute Variable-Arity Functions
//   Use .bind() when you want that function to later be called with a certain context, useful in events
//   Use .call() or .apply() when you want to invoke the funciton immediately, and modify the context.
// ----------------------------------------------------

// ----------------------------------------------------
// func.apply() v.s func.call() v.s func()
//   func.call(thisobj, arg1, arg2, arg3)
//   func.apply(thisobj, [arg1, arg2, ..])
//   func(arg1, arg2, arg3)
//   func():
//     this object in this func is in global scope. it's window object in browser
//   func.apply() / func.call() :
//     We can set this object for first argument to change the context.
//   func.apply() v.s func.call()
//     We can use arguments array in func.apply. It's helpful if we don't know the details of arguments.
// ----------------------------------------------------


// ----------------------------------------------------
// A naive implmentation of bind but not suport partial function application
// For completed implementation, see:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
// Function.prototype.bind = function(ctx) {
//     var fn = this;
//     return function() {
//         fn.apply(ctx, arguments);
//     };
// };
// ----------------------------------------------------

if(window) {
    global = window;
}
global.execContext = 'global';

function showContext(scope, name) {
    // this object of function is not always in global context
    // you can use apply or call to change execution context
    console.log( scope + ' { ' + name + '(..)' + ' }' + '  ==> ' + 'this.execContext = ' + this.execContext);
}

var BorrowedFunc = function() {
    this.execContext = 'BorrowedFunc';
    this.name = 'BorrowedFunc';
};

BorrowedFunc.prototype = {
    exec : function(){
        showContext.call(this, 'BorrowedFunc', 'showContext.call');
        showContext.apply(this, ['BorrowedFunc', 'showContext.apply']);
        showContext('BorrowedFunc', 'showContext');
    }
};

var JsFunc = function() {
    this.execContext = 'JsFunc';
    this.name = 'JsFunc';
};

JsFunc.prototype = {
    exec : function(){

        showContext.call(this, 'JsFunc', 'showContext.call');
        showContext.apply(this, ['JsFunc', 'showContext.apply']);
        showContext('JsFunc', 'showContext');

        // borrow BorrowedFunc.exec
        BorrowedFunc.prototype.exec.call(this);

        // borrow BorrowedFunc.exec but no thisobject given
        BorrowedFunc.prototype.exec.call();
    }
};

/* output
    JsFunc { showContext.call(..) }  ==> this.execContext = JsFunc
    JsFunc { showContext.apply(..) }  ==> this.execContext = JsFunc
    JsFunc { showContext(..) }  ==> this.execContext = global

    // borrow BorrowedFunc.exec
    BorrowedFunc { showContext.call(..) }  ==> this.execContext = JsFunc
    BorrowedFunc { showContext.apply(..) }  ==> this.execContext = JsFunc
    BorrowedFunc { showContext(..) }  ==> this.execContext = global

    // borrow BorrowedFunc.exec but no thisobject given
    BorrowedFunc { showContext.call(..) }  ==> this.execContext = global
    BorrowedFunc { showContext.apply(..) }  ==> this.execContext = global
    BorrowedFunc { showContext(..) }  ==> this.execContext = global
*/
new JsFunc().exec();

/* output
    global { showContext(..) }  ==> this.execContext = global
*/
showContext('global', 'showContext');

/* output
    JsFunc { showContext.call(..) }  ==> this.execContext = BindedJsFunc
    JsFunc { showContext.apply(..) }  ==> this.execContext = BindedJsFunc
    JsFunc { showContext(..) }  ==> this.execContext = global
    BorrowedFunc { showContext.call(..) }  ==> this.execContext = BindedJsFunc
    BorrowedFunc { showContext.apply(..) }  ==> this.execContext = BindedJsFunc
    BorrowedFunc { showContext(..) }  ==> this.execContext = global
    BorrowedFunc { showContext.call(..) }  ==> this.execContext = global
    BorrowedFunc { showContext.apply(..) }  ==> this.execContext = global
    BorrowedFunc { showContext(..) }  ==> this.execContext = global
*/
var bindedJsFuncExec = new JsFunc().exec.bind({
    execContext: 'BindedJsFunc',
    name: 'BindedJsFunc'
});
bindedJsFuncExec();


// ----------------------------------------------------
// bind: flexible partial function application
// reference:
//   http://javascriptissexy.com/javascript-apply-call-and-bind-methods-are-essential-for-javascript-professionals
// ----------------------------------------------------
function greet (gender, age, name) {
    // if a male, use Mr., else use Ms.
    var salutation = gender === "male" ? "Mr. " : "Ms. ";

    if (age > 25) {
        return "Hello, " + salutation + name + ".";
    } else {
        return "Hey, " + name + ".";
    }
}

// So we are passing null because we are not using the "this" keyword in our greet function.
var greetAnAdultMale = greet.bind (null, "male", 45);
greetAnAdultMale ("John Hartlove"); // "Hello, Mr. John Hartlove."

var greetAYoungster = greet.bind (null, "", 16);
greetAYoungster ("Alex"); // "Hey, Alex."
greetAYoungster ("Emma Waterloo"); // "Hey, Emma Waterloo."