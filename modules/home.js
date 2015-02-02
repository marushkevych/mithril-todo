var xmlDisplay = require('./xmlDisplay');
var xml = require('../xml');

var userId = m.prop("");


var setUser = function(name){
    userId(name);
    term(name);
}

var users = m.prop([
    {id: 1, name: "John"}, 
    {id: 2, name: "Jack"}, 
    {id: 3, name: "Joll"}, 
    {id: 4, name: "Bob"}, 
    {id: 5, name: "Mary"}
]);
var term = m.prop("");
var search = function(value) {
    term(value.toLowerCase());
};
var filter = function(item) {
    return term() && item.name.toLowerCase().indexOf(term()) > -1;
//return true;
};

var home = module.exports = {
    controller: function() {
        this.redirectToDashboard = function(){
            m.route("/dashboard/"+userId());
            
        };
        
    },
    view: function(ctrl) {
        return m('div',[
            m("h1", "Home page"),
            m("div", userId()),
            m('input', {onkeyup: m.withAttr("value", search), value: term()}),
            users().filter(filter).map(function(item) {
                return m("div", {onclick: setUser.bind(this, item.name)}, item.name);
            }),
            m('button', { onclick: ctrl.redirectToDashboard}, 'show user'),
            m("h2", "Xml display"),
            xmlDisplay.view(xml)
            
        ]);
                
    }
};
