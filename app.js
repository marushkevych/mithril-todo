//app goes here
var todo = require('./modules/todo');
var nav = require('./modules/nav');
var home = require('./modules/home');
var dashboard = require('./modules/dashboard');
var footer = require('./modules/footer');

var ParentPage = function(childComponent){
    this.controller = function(){
        this.childController = new childComponent.controller();
    };
    this.view = function(ctrl){
        return [
            nav.view(),
            childComponent.view(ctrl.childController),
            footer.view()
        ];        
    }
}


//setup routes to start w/ the `#` symbol
m.route.mode = "hash";

m.route(document.body, "/", {
    "/": new ParentPage(home),
    "/todo": new ParentPage(todo),
    "/dashboard/:userID": new ParentPage(dashboard),
});


