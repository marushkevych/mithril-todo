;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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



},{"./modules/dashboard":2,"./modules/footer":3,"./modules/home":4,"./modules/nav":5,"./modules/todo":6}],2:[function(require,module,exports){
var dashboard = module.exports = {
    controller: function() {
        this.id = m.route.param("userID");
    },
    view: function(controller) {
        return m("div", [
            m("h1", 'User Dashboard'),
            m("span", "UserID: "),
            m("span", controller.id),
        ]);
    }
};


},{}],3:[function(require,module,exports){
var footer = module.exports = {
    controller: function() {
        
    },
    view: function() {
        return m("footer", [
            m('hr'),
            m('span', "Andrey M, all rights reserved"),
        ]);
    }
};


},{}],4:[function(require,module,exports){
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

},{"../xml":8,"./xmlDisplay":7}],5:[function(require,module,exports){
var nav = module.exports = {
    controller: function() {
        
    },
    view: function(controller) {
        return m("header", [
            m('span', " | "),
            m('a', {href: '#/'}, "Home"),
            m('span', " | "),
            m('a', {href: '#/todo'}, 'TODO'),
            m('span', " | "),
            m('a', {href: '#/dashboard/user123'}, 'user123'),
            m('span', " | "),
        ]);
    }
};
},{}],6:[function(require,module,exports){
//app goes here
var todo = module.exports = {};

// MODEL
todo.Todo = function(data) {
    this.description = m.prop(data.description);
    this.done = m.prop(false);
};

todo.TodoList = Array;

//define the view-model
todo.vm = (function() {
    var vm = {};
    vm.init = function() {
        //a running list of todos
        vm.list = new todo.TodoList();
        
        vm.list.push(new todo.Todo({description: "a task"}));

        //a slot to store the name of a new todo before it is created
        vm.description = m.prop("hello");

        //adds a todo to the list, and clears the description field for user convenience
        vm.add = function() {
            if (vm.description()) {
                vm.list.push(new todo.Todo({description: vm.description()}));
                vm.description("");
            }
        };
    };
    return vm;
}()); 

todo.controller = function() {
    todo.vm.init();
};

todo.view = function() {
    return m("div", [
            m("h1", "TODO app"),
            m("input", {onchange: m.withAttr("value", todo.vm.description),  value: todo.vm.description()}),
            m("button", {onclick: todo.vm.add}, "Add"),
            m("table", todo.vm.list.map(function(task, index) {
                return m("tr", [
                    m("td", [
                        m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})
                    ]),
                    m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description())
                ]);
            }))
        ]);
};

},{}],7:[function(require,module,exports){
var space = String.fromCharCode(160);
var doubleSpace = space + space;

var controller = exports.controller = function(){
}

var view = exports.view = function(node){
    node.nodes = node.nodes || [];
    node.attrs = node.attrs || {};
    var clazz = node.collapsed ? 'hidden' : "";
        
    return m('ul', {class: 'xml'},[
        m('li', [
            openingTag(node),
            !hasNodes(node) ? node.value :
            m('div', {class: clazz},[
                node.nodes.map(function(node){
                    return view(node);
                }),
            ]),
            closingTag(node)
        ])
    ]);
};


var openingTag = function(node){
    var clazz = "xml-element";
    var cursor = hasNodes(node) ? 'pointer' : "";
    var toggle = function(){
        node.collapsed = node.collapsed ? false : true;
    };
    return m("span[style='cursor:"+cursor+"']", {class: clazz, onclick: toggle},[
        getIcon(node),
        "<", node.name, 
        m('span', {class: "xml-attribute"},[
            _.map(node.attrs, function(value, key){
                return " " + key+"="+'"'+value+'"';
            })
        ]),
        hasChildren(node)? ">" : "/>"
    ]);
};

var closingTag = function(node){
    var spacing = node.value ? "" : doubleSpace;
    return hasChildren(node) ? m('span', {class: "xml-element"}, spacing,"</" + node.name + ">") : "";
};

var hasChildren = function(node){
    return node.value || hasNodes(node);
};

var hasNodes = function(node){
    return node.nodes && node.nodes.length !== 0;
};

var getIcon = function(node){
    return hasNodes(node) ? '+ ' : doubleSpace;
};
},{}],8:[function(require,module,exports){
module.exports = {
  "name": "rootNode",
  "attrs": {"foo":"bar", name: "value"},
  "nodes": [
    {
      "name": "child",
      "attrs": {"foo":"bar", name: "value"},
      "nodes": [
        {
          "name": "element1",
          "value": "value"
        },
        {
          "name": "element2",
          "value": "another value"
        },
      ]
    },
    {
       "name": "child2",
        "nodes": [
            {
              "name": "element1",
              "value": "value"
            },
            {
              "name": "element2",
              "value": "another value",
              "attrs": {"foo":"bar"}
            }
        ]
    },
    {
       "name": "emptyElement"
    },
    {
       "name": "emptyElementWithAttrs",
       "attrs": {"foo":"bar", name: "value"}
    }
  ]
};


},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmRyZXkvZGV2L3dvcmsvZ2l0aHViL21pdGhyaWwtdG9kby9hcHAuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8vbW9kdWxlcy9kYXNoYm9hcmQuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8vbW9kdWxlcy9mb290ZXIuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8vbW9kdWxlcy9ob21lLmpzIiwiL1VzZXJzL2FuZHJleS9kZXYvd29yay9naXRodWIvbWl0aHJpbC10b2RvL21vZHVsZXMvbmF2LmpzIiwiL1VzZXJzL2FuZHJleS9kZXYvd29yay9naXRodWIvbWl0aHJpbC10b2RvL21vZHVsZXMvdG9kby5qcyIsIi9Vc2Vycy9hbmRyZXkvZGV2L3dvcmsvZ2l0aHViL21pdGhyaWwtdG9kby9tb2R1bGVzL3htbERpc3BsYXkuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8veG1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8vYXBwIGdvZXMgaGVyZVxudmFyIHRvZG8gPSByZXF1aXJlKCcuL21vZHVsZXMvdG9kbycpO1xudmFyIG5hdiA9IHJlcXVpcmUoJy4vbW9kdWxlcy9uYXYnKTtcbnZhciBob21lID0gcmVxdWlyZSgnLi9tb2R1bGVzL2hvbWUnKTtcbnZhciBkYXNoYm9hcmQgPSByZXF1aXJlKCcuL21vZHVsZXMvZGFzaGJvYXJkJyk7XG52YXIgZm9vdGVyID0gcmVxdWlyZSgnLi9tb2R1bGVzL2Zvb3RlcicpO1xuXG52YXIgUGFyZW50UGFnZSA9IGZ1bmN0aW9uKGNoaWxkQ29tcG9uZW50KXtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmNoaWxkQ29udHJvbGxlciA9IG5ldyBjaGlsZENvbXBvbmVudC5jb250cm9sbGVyKCk7XG4gICAgfTtcbiAgICB0aGlzLnZpZXcgPSBmdW5jdGlvbihjdHJsKXtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG5hdi52aWV3KCksXG4gICAgICAgICAgICBjaGlsZENvbXBvbmVudC52aWV3KGN0cmwuY2hpbGRDb250cm9sbGVyKSxcbiAgICAgICAgICAgIGZvb3Rlci52aWV3KClcbiAgICAgICAgXTsgICAgICAgIFxuICAgIH1cbn1cblxuXG4vL3NldHVwIHJvdXRlcyB0byBzdGFydCB3LyB0aGUgYCNgIHN5bWJvbFxubS5yb3V0ZS5tb2RlID0gXCJoYXNoXCI7XG5cbm0ucm91dGUoZG9jdW1lbnQuYm9keSwgXCIvXCIsIHtcbiAgICBcIi9cIjogbmV3IFBhcmVudFBhZ2UoaG9tZSksXG4gICAgXCIvdG9kb1wiOiBuZXcgUGFyZW50UGFnZSh0b2RvKSxcbiAgICBcIi9kYXNoYm9hcmQvOnVzZXJJRFwiOiBuZXcgUGFyZW50UGFnZShkYXNoYm9hcmQpLFxufSk7XG5cblxuIiwidmFyIGRhc2hib2FyZCA9IG1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmlkID0gbS5yb3V0ZS5wYXJhbShcInVzZXJJRFwiKTtcbiAgICB9LFxuICAgIHZpZXc6IGZ1bmN0aW9uKGNvbnRyb2xsZXIpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwgW1xuICAgICAgICAgICAgbShcImgxXCIsICdVc2VyIERhc2hib2FyZCcpLFxuICAgICAgICAgICAgbShcInNwYW5cIiwgXCJVc2VySUQ6IFwiKSxcbiAgICAgICAgICAgIG0oXCJzcGFuXCIsIGNvbnRyb2xsZXIuaWQpLFxuICAgICAgICBdKTtcbiAgICB9XG59O1xuXG4iLCJ2YXIgZm9vdGVyID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtKFwiZm9vdGVyXCIsIFtcbiAgICAgICAgICAgIG0oJ2hyJyksXG4gICAgICAgICAgICBtKCdzcGFuJywgXCJBbmRyZXkgTSwgYWxsIHJpZ2h0cyByZXNlcnZlZFwiKSxcbiAgICAgICAgXSk7XG4gICAgfVxufTtcblxuIiwidmFyIHhtbERpc3BsYXkgPSByZXF1aXJlKCcuL3htbERpc3BsYXknKTtcbnZhciB4bWwgPSByZXF1aXJlKCcuLi94bWwnKTtcblxudmFyIHVzZXJJZCA9IG0ucHJvcChcIlwiKTtcblxuXG52YXIgc2V0VXNlciA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHVzZXJJZChuYW1lKTtcbiAgICB0ZXJtKG5hbWUpO1xufVxuXG52YXIgdXNlcnMgPSBtLnByb3AoW1xuICAgIHtpZDogMSwgbmFtZTogXCJKb2huXCJ9LCBcbiAgICB7aWQ6IDIsIG5hbWU6IFwiSmFja1wifSwgXG4gICAge2lkOiAzLCBuYW1lOiBcIkpvbGxcIn0sIFxuICAgIHtpZDogNCwgbmFtZTogXCJCb2JcIn0sIFxuICAgIHtpZDogNSwgbmFtZTogXCJNYXJ5XCJ9XG5dKTtcbnZhciB0ZXJtID0gbS5wcm9wKFwiXCIpO1xudmFyIHNlYXJjaCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdGVybSh2YWx1ZS50b0xvd2VyQ2FzZSgpKTtcbn07XG52YXIgZmlsdGVyID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiB0ZXJtKCkgJiYgaXRlbS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXJtKCkpID4gLTE7XG4vL3JldHVybiB0cnVlO1xufTtcblxudmFyIGhvbWUgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZWRpcmVjdFRvRGFzaGJvYXJkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG0ucm91dGUoXCIvZGFzaGJvYXJkL1wiK3VzZXJJZCgpKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgICAgICBcbiAgICB9LFxuICAgIHZpZXc6IGZ1bmN0aW9uKGN0cmwpIHtcbiAgICAgICAgcmV0dXJuIG0oJ2RpdicsW1xuICAgICAgICAgICAgbShcImgxXCIsIFwiSG9tZSBwYWdlXCIpLFxuICAgICAgICAgICAgbShcImRpdlwiLCB1c2VySWQoKSksXG4gICAgICAgICAgICBtKCdpbnB1dCcsIHtvbmtleXVwOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgc2VhcmNoKSwgdmFsdWU6IHRlcm0oKX0pLFxuICAgICAgICAgICAgdXNlcnMoKS5maWx0ZXIoZmlsdGVyKS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHtvbmNsaWNrOiBzZXRVc2VyLmJpbmQodGhpcywgaXRlbS5uYW1lKX0sIGl0ZW0ubmFtZSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG0oJ2J1dHRvbicsIHsgb25jbGljazogY3RybC5yZWRpcmVjdFRvRGFzaGJvYXJkfSwgJ3Nob3cgdXNlcicpLFxuICAgICAgICAgICAgbShcImgyXCIsIFwiWG1sIGRpc3BsYXlcIiksXG4gICAgICAgICAgICB4bWxEaXNwbGF5LnZpZXcoeG1sKVxuICAgICAgICAgICAgXG4gICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIFxuICAgIH1cbn07XG4iLCJ2YXIgbmF2ID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oY29udHJvbGxlcikge1xuICAgICAgICByZXR1cm4gbShcImhlYWRlclwiLCBbXG4gICAgICAgICAgICBtKCdzcGFuJywgXCIgfCBcIiksXG4gICAgICAgICAgICBtKCdhJywge2hyZWY6ICcjLyd9LCBcIkhvbWVcIiksXG4gICAgICAgICAgICBtKCdzcGFuJywgXCIgfCBcIiksXG4gICAgICAgICAgICBtKCdhJywge2hyZWY6ICcjL3RvZG8nfSwgJ1RPRE8nKSxcbiAgICAgICAgICAgIG0oJ3NwYW4nLCBcIiB8IFwiKSxcbiAgICAgICAgICAgIG0oJ2EnLCB7aHJlZjogJyMvZGFzaGJvYXJkL3VzZXIxMjMnfSwgJ3VzZXIxMjMnKSxcbiAgICAgICAgICAgIG0oJ3NwYW4nLCBcIiB8IFwiKSxcbiAgICAgICAgXSk7XG4gICAgfVxufTsiLCIvL2FwcCBnb2VzIGhlcmVcbnZhciB0b2RvID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gTU9ERUxcbnRvZG8uVG9kbyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gbS5wcm9wKGRhdGEuZGVzY3JpcHRpb24pO1xuICAgIHRoaXMuZG9uZSA9IG0ucHJvcChmYWxzZSk7XG59O1xuXG50b2RvLlRvZG9MaXN0ID0gQXJyYXk7XG5cbi8vZGVmaW5lIHRoZSB2aWV3LW1vZGVsXG50b2RvLnZtID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciB2bSA9IHt9O1xuICAgIHZtLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9hIHJ1bm5pbmcgbGlzdCBvZiB0b2Rvc1xuICAgICAgICB2bS5saXN0ID0gbmV3IHRvZG8uVG9kb0xpc3QoKTtcbiAgICAgICAgXG4gICAgICAgIHZtLmxpc3QucHVzaChuZXcgdG9kby5Ub2RvKHtkZXNjcmlwdGlvbjogXCJhIHRhc2tcIn0pKTtcblxuICAgICAgICAvL2Egc2xvdCB0byBzdG9yZSB0aGUgbmFtZSBvZiBhIG5ldyB0b2RvIGJlZm9yZSBpdCBpcyBjcmVhdGVkXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uID0gbS5wcm9wKFwiaGVsbG9cIik7XG5cbiAgICAgICAgLy9hZGRzIGEgdG9kbyB0byB0aGUgbGlzdCwgYW5kIGNsZWFycyB0aGUgZGVzY3JpcHRpb24gZmllbGQgZm9yIHVzZXIgY29udmVuaWVuY2VcbiAgICAgICAgdm0uYWRkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodm0uZGVzY3JpcHRpb24oKSkge1xuICAgICAgICAgICAgICAgIHZtLmxpc3QucHVzaChuZXcgdG9kby5Ub2RvKHtkZXNjcmlwdGlvbjogdm0uZGVzY3JpcHRpb24oKX0pKTtcbiAgICAgICAgICAgICAgICB2bS5kZXNjcmlwdGlvbihcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiB2bTtcbn0oKSk7IFxuXG50b2RvLmNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0b2RvLnZtLmluaXQoKTtcbn07XG5cbnRvZG8udmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtKFwiZGl2XCIsIFtcbiAgICAgICAgICAgIG0oXCJoMVwiLCBcIlRPRE8gYXBwXCIpLFxuICAgICAgICAgICAgbShcImlucHV0XCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cihcInZhbHVlXCIsIHRvZG8udm0uZGVzY3JpcHRpb24pLCAgdmFsdWU6IHRvZG8udm0uZGVzY3JpcHRpb24oKX0pLFxuICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7b25jbGljazogdG9kby52bS5hZGR9LCBcIkFkZFwiKSxcbiAgICAgICAgICAgIG0oXCJ0YWJsZVwiLCB0b2RvLnZtLmxpc3QubWFwKGZ1bmN0aW9uKHRhc2ssIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJ0clwiLCBbXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0ZFwiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiaW5wdXRbdHlwZT1jaGVja2JveF1cIiwge29uY2xpY2s6IG0ud2l0aEF0dHIoXCJjaGVja2VkXCIsIHRhc2suZG9uZSksIGNoZWNrZWQ6IHRhc2suZG9uZSgpfSlcbiAgICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0ZFwiLCB7c3R5bGU6IHt0ZXh0RGVjb3JhdGlvbjogdGFzay5kb25lKCkgPyBcImxpbmUtdGhyb3VnaFwiIDogXCJub25lXCJ9fSwgdGFzay5kZXNjcmlwdGlvbigpKVxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgIF0pO1xufTtcbiIsInZhciBzcGFjZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMTYwKTtcbnZhciBkb3VibGVTcGFjZSA9IHNwYWNlICsgc3BhY2U7XG5cbnZhciBjb250cm9sbGVyID0gZXhwb3J0cy5jb250cm9sbGVyID0gZnVuY3Rpb24oKXtcbn1cblxudmFyIHZpZXcgPSBleHBvcnRzLnZpZXcgPSBmdW5jdGlvbihub2RlKXtcbiAgICBub2RlLm5vZGVzID0gbm9kZS5ub2RlcyB8fCBbXTtcbiAgICBub2RlLmF0dHJzID0gbm9kZS5hdHRycyB8fCB7fTtcbiAgICB2YXIgY2xhenogPSBub2RlLmNvbGxhcHNlZCA/ICdoaWRkZW4nIDogXCJcIjtcbiAgICAgICAgXG4gICAgcmV0dXJuIG0oJ3VsJywge2NsYXNzOiAneG1sJ30sW1xuICAgICAgICBtKCdsaScsIFtcbiAgICAgICAgICAgIG9wZW5pbmdUYWcobm9kZSksXG4gICAgICAgICAgICAhaGFzTm9kZXMobm9kZSkgPyBub2RlLnZhbHVlIDpcbiAgICAgICAgICAgIG0oJ2RpdicsIHtjbGFzczogY2xhenp9LFtcbiAgICAgICAgICAgICAgICBub2RlLm5vZGVzLm1hcChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZpZXcobm9kZSk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIGNsb3NpbmdUYWcobm9kZSlcbiAgICAgICAgXSlcbiAgICBdKTtcbn07XG5cblxudmFyIG9wZW5pbmdUYWcgPSBmdW5jdGlvbihub2RlKXtcbiAgICB2YXIgY2xhenogPSBcInhtbC1lbGVtZW50XCI7XG4gICAgdmFyIGN1cnNvciA9IGhhc05vZGVzKG5vZGUpID8gJ3BvaW50ZXInIDogXCJcIjtcbiAgICB2YXIgdG9nZ2xlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgbm9kZS5jb2xsYXBzZWQgPSBub2RlLmNvbGxhcHNlZCA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9O1xuICAgIHJldHVybiBtKFwic3BhbltzdHlsZT0nY3Vyc29yOlwiK2N1cnNvcitcIiddXCIsIHtjbGFzczogY2xhenosIG9uY2xpY2s6IHRvZ2dsZX0sW1xuICAgICAgICBnZXRJY29uKG5vZGUpLFxuICAgICAgICBcIjxcIiwgbm9kZS5uYW1lLCBcbiAgICAgICAgbSgnc3BhbicsIHtjbGFzczogXCJ4bWwtYXR0cmlidXRlXCJ9LFtcbiAgICAgICAgICAgIF8ubWFwKG5vZGUuYXR0cnMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBcIiBcIiArIGtleStcIj1cIisnXCInK3ZhbHVlKydcIic7XG4gICAgICAgICAgICB9KVxuICAgICAgICBdKSxcbiAgICAgICAgaGFzQ2hpbGRyZW4obm9kZSk/IFwiPlwiIDogXCIvPlwiXG4gICAgXSk7XG59O1xuXG52YXIgY2xvc2luZ1RhZyA9IGZ1bmN0aW9uKG5vZGUpe1xuICAgIHZhciBzcGFjaW5nID0gbm9kZS52YWx1ZSA/IFwiXCIgOiBkb3VibGVTcGFjZTtcbiAgICByZXR1cm4gaGFzQ2hpbGRyZW4obm9kZSkgPyBtKCdzcGFuJywge2NsYXNzOiBcInhtbC1lbGVtZW50XCJ9LCBzcGFjaW5nLFwiPC9cIiArIG5vZGUubmFtZSArIFwiPlwiKSA6IFwiXCI7XG59O1xuXG52YXIgaGFzQ2hpbGRyZW4gPSBmdW5jdGlvbihub2RlKXtcbiAgICByZXR1cm4gbm9kZS52YWx1ZSB8fCBoYXNOb2Rlcyhub2RlKTtcbn07XG5cbnZhciBoYXNOb2RlcyA9IGZ1bmN0aW9uKG5vZGUpe1xuICAgIHJldHVybiBub2RlLm5vZGVzICYmIG5vZGUubm9kZXMubGVuZ3RoICE9PSAwO1xufTtcblxudmFyIGdldEljb24gPSBmdW5jdGlvbihub2RlKXtcbiAgICByZXR1cm4gaGFzTm9kZXMobm9kZSkgPyAnKyAnIDogZG91YmxlU3BhY2U7XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBcIm5hbWVcIjogXCJyb290Tm9kZVwiLFxuICBcImF0dHJzXCI6IHtcImZvb1wiOlwiYmFyXCIsIG5hbWU6IFwidmFsdWVcIn0sXG4gIFwibm9kZXNcIjogW1xuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcImNoaWxkXCIsXG4gICAgICBcImF0dHJzXCI6IHtcImZvb1wiOlwiYmFyXCIsIG5hbWU6IFwidmFsdWVcIn0sXG4gICAgICBcIm5vZGVzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImVsZW1lbnQxXCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiBcInZhbHVlXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImVsZW1lbnQyXCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiBcImFub3RoZXIgdmFsdWVcIlxuICAgICAgICB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgIFwibmFtZVwiOiBcImNoaWxkMlwiLFxuICAgICAgICBcIm5vZGVzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWxlbWVudDFcIixcbiAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInZhbHVlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVsZW1lbnQyXCIsXG4gICAgICAgICAgICAgIFwidmFsdWVcIjogXCJhbm90aGVyIHZhbHVlXCIsXG4gICAgICAgICAgICAgIFwiYXR0cnNcIjoge1wiZm9vXCI6XCJiYXJcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgIFwibmFtZVwiOiBcImVtcHR5RWxlbWVudFwiXG4gICAgfSxcbiAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiZW1wdHlFbGVtZW50V2l0aEF0dHJzXCIsXG4gICAgICAgXCJhdHRyc1wiOiB7XCJmb29cIjpcImJhclwiLCBuYW1lOiBcInZhbHVlXCJ9XG4gICAgfVxuICBdXG59O1xuXG4iXX0=
;