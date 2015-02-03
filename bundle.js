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
//    return require('../xml');
}

var view = exports.view = function(node){
    node.nodes = node.nodes || [];
    node.attrs = node.attrs || {};
    var clazz = node.collapsed ? 'hidden' : "";
//    var clazz = '';
    var toggleListener = function(){
        node.collapsed = node.collapsed ? false : true;
        console.log("clicked", node.name, node.collapsed)
//        clazz = node.collapsed ? 'hidden' : "";
        clazz = 'hidden';
        
    };
    return m('ul', {class: 'xml'},[
        m('li', [
            openingTag(node, toggleListener),
            node.value,
            m('div', {class: clazz},[
                node.nodes.map(function(node){
                    return view(node);
                }),
            ]),
            closingTag(node)
        ])
    ]);
};


var openingTag = function(node, toggleListener){
    var clazz = "xml-element";
    var cursor = hasNodes(node) ? 'pointer' : "";
    var toggle = function(){
        if(hasNodes(node)){
            toggleListener();
        }
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmRyZXkvZGV2L3dvcmsvZ2l0aHViL21pdGhyaWwtdG9kby9hcHAuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8vbW9kdWxlcy9kYXNoYm9hcmQuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8vbW9kdWxlcy9mb290ZXIuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8vbW9kdWxlcy9ob21lLmpzIiwiL1VzZXJzL2FuZHJleS9kZXYvd29yay9naXRodWIvbWl0aHJpbC10b2RvL21vZHVsZXMvbmF2LmpzIiwiL1VzZXJzL2FuZHJleS9kZXYvd29yay9naXRodWIvbWl0aHJpbC10b2RvL21vZHVsZXMvdG9kby5qcyIsIi9Vc2Vycy9hbmRyZXkvZGV2L3dvcmsvZ2l0aHViL21pdGhyaWwtdG9kby9tb2R1bGVzL3htbERpc3BsYXkuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8veG1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLy9hcHAgZ29lcyBoZXJlXG52YXIgdG9kbyA9IHJlcXVpcmUoJy4vbW9kdWxlcy90b2RvJyk7XG52YXIgbmF2ID0gcmVxdWlyZSgnLi9tb2R1bGVzL25hdicpO1xudmFyIGhvbWUgPSByZXF1aXJlKCcuL21vZHVsZXMvaG9tZScpO1xudmFyIGRhc2hib2FyZCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9kYXNoYm9hcmQnKTtcbnZhciBmb290ZXIgPSByZXF1aXJlKCcuL21vZHVsZXMvZm9vdGVyJyk7XG5cbnZhciBQYXJlbnRQYWdlID0gZnVuY3Rpb24oY2hpbGRDb21wb25lbnQpe1xuICAgIHRoaXMuY29udHJvbGxlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuY2hpbGRDb250cm9sbGVyID0gbmV3IGNoaWxkQ29tcG9uZW50LmNvbnRyb2xsZXIoKTtcbiAgICB9O1xuICAgIHRoaXMudmlldyA9IGZ1bmN0aW9uKGN0cmwpe1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbmF2LnZpZXcoKSxcbiAgICAgICAgICAgIGNoaWxkQ29tcG9uZW50LnZpZXcoY3RybC5jaGlsZENvbnRyb2xsZXIpLFxuICAgICAgICAgICAgZm9vdGVyLnZpZXcoKVxuICAgICAgICBdOyAgICAgICAgXG4gICAgfVxufVxuXG5cbi8vc2V0dXAgcm91dGVzIHRvIHN0YXJ0IHcvIHRoZSBgI2Agc3ltYm9sXG5tLnJvdXRlLm1vZGUgPSBcImhhc2hcIjtcblxubS5yb3V0ZShkb2N1bWVudC5ib2R5LCBcIi9cIiwge1xuICAgIFwiL1wiOiBuZXcgUGFyZW50UGFnZShob21lKSxcbiAgICBcIi90b2RvXCI6IG5ldyBQYXJlbnRQYWdlKHRvZG8pLFxuICAgIFwiL2Rhc2hib2FyZC86dXNlcklEXCI6IG5ldyBQYXJlbnRQYWdlKGRhc2hib2FyZCksXG59KTtcblxuXG4iLCJ2YXIgZGFzaGJvYXJkID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaWQgPSBtLnJvdXRlLnBhcmFtKFwidXNlcklEXCIpO1xuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oY29udHJvbGxlcikge1xuICAgICAgICByZXR1cm4gbShcImRpdlwiLCBbXG4gICAgICAgICAgICBtKFwiaDFcIiwgJ1VzZXIgRGFzaGJvYXJkJyksXG4gICAgICAgICAgICBtKFwic3BhblwiLCBcIlVzZXJJRDogXCIpLFxuICAgICAgICAgICAgbShcInNwYW5cIiwgY29udHJvbGxlci5pZCksXG4gICAgICAgIF0pO1xuICAgIH1cbn07XG5cbiIsInZhciBmb290ZXIgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgfSxcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJmb290ZXJcIiwgW1xuICAgICAgICAgICAgbSgnaHInKSxcbiAgICAgICAgICAgIG0oJ3NwYW4nLCBcIkFuZHJleSBNLCBhbGwgcmlnaHRzIHJlc2VydmVkXCIpLFxuICAgICAgICBdKTtcbiAgICB9XG59O1xuXG4iLCJ2YXIgeG1sRGlzcGxheSA9IHJlcXVpcmUoJy4veG1sRGlzcGxheScpO1xudmFyIHhtbCA9IHJlcXVpcmUoJy4uL3htbCcpO1xuXG52YXIgdXNlcklkID0gbS5wcm9wKFwiXCIpO1xuXG5cbnZhciBzZXRVc2VyID0gZnVuY3Rpb24obmFtZSl7XG4gICAgdXNlcklkKG5hbWUpO1xuICAgIHRlcm0obmFtZSk7XG59XG5cbnZhciB1c2VycyA9IG0ucHJvcChbXG4gICAge2lkOiAxLCBuYW1lOiBcIkpvaG5cIn0sIFxuICAgIHtpZDogMiwgbmFtZTogXCJKYWNrXCJ9LCBcbiAgICB7aWQ6IDMsIG5hbWU6IFwiSm9sbFwifSwgXG4gICAge2lkOiA0LCBuYW1lOiBcIkJvYlwifSwgXG4gICAge2lkOiA1LCBuYW1lOiBcIk1hcnlcIn1cbl0pO1xudmFyIHRlcm0gPSBtLnByb3AoXCJcIik7XG52YXIgc2VhcmNoID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB0ZXJtKHZhbHVlLnRvTG93ZXJDYXNlKCkpO1xufTtcbnZhciBmaWx0ZXIgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIHRlcm0oKSAmJiBpdGVtLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlcm0oKSkgPiAtMTtcbi8vcmV0dXJuIHRydWU7XG59O1xuXG52YXIgaG9tZSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlZGlyZWN0VG9EYXNoYm9hcmQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbS5yb3V0ZShcIi9kYXNoYm9hcmQvXCIrdXNlcklkKCkpO1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgICAgICByZXR1cm4gbSgnZGl2JyxbXG4gICAgICAgICAgICBtKFwiaDFcIiwgXCJIb21lIHBhZ2VcIiksXG4gICAgICAgICAgICBtKFwiZGl2XCIsIHVzZXJJZCgpKSxcbiAgICAgICAgICAgIG0oJ2lucHV0Jywge29ua2V5dXA6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBzZWFyY2gpLCB2YWx1ZTogdGVybSgpfSksXG4gICAgICAgICAgICB1c2VycygpLmZpbHRlcihmaWx0ZXIpLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwge29uY2xpY2s6IHNldFVzZXIuYmluZCh0aGlzLCBpdGVtLm5hbWUpfSwgaXRlbS5uYW1lKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbSgnYnV0dG9uJywgeyBvbmNsaWNrOiBjdHJsLnJlZGlyZWN0VG9EYXNoYm9hcmR9LCAnc2hvdyB1c2VyJyksXG4gICAgICAgICAgICBtKFwiaDJcIiwgXCJYbWwgZGlzcGxheVwiKSxcbiAgICAgICAgICAgIHhtbERpc3BsYXkudmlldyh4bWwpXG4gICAgICAgICAgICBcbiAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgXG4gICAgfVxufTtcbiIsInZhciBuYXYgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgfSxcbiAgICB2aWV3OiBmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gICAgICAgIHJldHVybiBtKFwiaGVhZGVyXCIsIFtcbiAgICAgICAgICAgIG0oJ3NwYW4nLCBcIiB8IFwiKSxcbiAgICAgICAgICAgIG0oJ2EnLCB7aHJlZjogJyMvJ30sIFwiSG9tZVwiKSxcbiAgICAgICAgICAgIG0oJ3NwYW4nLCBcIiB8IFwiKSxcbiAgICAgICAgICAgIG0oJ2EnLCB7aHJlZjogJyMvdG9kbyd9LCAnVE9ETycpLFxuICAgICAgICAgICAgbSgnc3BhbicsIFwiIHwgXCIpLFxuICAgICAgICAgICAgbSgnYScsIHtocmVmOiAnIy9kYXNoYm9hcmQvdXNlcjEyMyd9LCAndXNlcjEyMycpLFxuICAgICAgICAgICAgbSgnc3BhbicsIFwiIHwgXCIpLFxuICAgICAgICBdKTtcbiAgICB9XG59OyIsIi8vYXBwIGdvZXMgaGVyZVxudmFyIHRvZG8gPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBNT0RFTFxudG9kby5Ub2RvID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBtLnByb3AoZGF0YS5kZXNjcmlwdGlvbik7XG4gICAgdGhpcy5kb25lID0gbS5wcm9wKGZhbHNlKTtcbn07XG5cbnRvZG8uVG9kb0xpc3QgPSBBcnJheTtcblxuLy9kZWZpbmUgdGhlIHZpZXctbW9kZWxcbnRvZG8udm0gPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZtID0ge307XG4gICAgdm0uaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2EgcnVubmluZyBsaXN0IG9mIHRvZG9zXG4gICAgICAgIHZtLmxpc3QgPSBuZXcgdG9kby5Ub2RvTGlzdCgpO1xuICAgICAgICBcbiAgICAgICAgdm0ubGlzdC5wdXNoKG5ldyB0b2RvLlRvZG8oe2Rlc2NyaXB0aW9uOiBcImEgdGFza1wifSkpO1xuXG4gICAgICAgIC8vYSBzbG90IHRvIHN0b3JlIHRoZSBuYW1lIG9mIGEgbmV3IHRvZG8gYmVmb3JlIGl0IGlzIGNyZWF0ZWRcbiAgICAgICAgdm0uZGVzY3JpcHRpb24gPSBtLnByb3AoXCJoZWxsb1wiKTtcblxuICAgICAgICAvL2FkZHMgYSB0b2RvIHRvIHRoZSBsaXN0LCBhbmQgY2xlYXJzIHRoZSBkZXNjcmlwdGlvbiBmaWVsZCBmb3IgdXNlciBjb252ZW5pZW5jZVxuICAgICAgICB2bS5hZGQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh2bS5kZXNjcmlwdGlvbigpKSB7XG4gICAgICAgICAgICAgICAgdm0ubGlzdC5wdXNoKG5ldyB0b2RvLlRvZG8oe2Rlc2NyaXB0aW9uOiB2bS5kZXNjcmlwdGlvbigpfSkpO1xuICAgICAgICAgICAgICAgIHZtLmRlc2NyaXB0aW9uKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIHZtO1xufSgpKTsgXG5cbnRvZG8uY29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRvZG8udm0uaW5pdCgpO1xufTtcblxudG9kby52aWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG0oXCJkaXZcIiwgW1xuICAgICAgICAgICAgbShcImgxXCIsIFwiVE9ETyBhcHBcIiksXG4gICAgICAgICAgICBtKFwiaW5wdXRcIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgdG9kby52bS5kZXNjcmlwdGlvbiksICB2YWx1ZTogdG9kby52bS5kZXNjcmlwdGlvbigpfSksXG4gICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtvbmNsaWNrOiB0b2RvLnZtLmFkZH0sIFwiQWRkXCIpLFxuICAgICAgICAgICAgbShcInRhYmxlXCIsIHRvZG8udm0ubGlzdC5tYXAoZnVuY3Rpb24odGFzaywgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcInRyXCIsIFtcbiAgICAgICAgICAgICAgICAgICAgbShcInRkXCIsIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJpbnB1dFt0eXBlPWNoZWNrYm94XVwiLCB7b25jbGljazogbS53aXRoQXR0cihcImNoZWNrZWRcIiwgdGFzay5kb25lKSwgY2hlY2tlZDogdGFzay5kb25lKCl9KVxuICAgICAgICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgICAgICAgbShcInRkXCIsIHtzdHlsZToge3RleHREZWNvcmF0aW9uOiB0YXNrLmRvbmUoKSA/IFwibGluZS10aHJvdWdoXCIgOiBcIm5vbmVcIn19LCB0YXNrLmRlc2NyaXB0aW9uKCkpXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgXSk7XG59O1xuIiwidmFyIHNwYWNlID0gU3RyaW5nLmZyb21DaGFyQ29kZSgxNjApO1xudmFyIGRvdWJsZVNwYWNlID0gc3BhY2UgKyBzcGFjZTtcblxudmFyIGNvbnRyb2xsZXIgPSBleHBvcnRzLmNvbnRyb2xsZXIgPSBmdW5jdGlvbigpe1xuLy8gICAgcmV0dXJuIHJlcXVpcmUoJy4uL3htbCcpO1xufVxuXG52YXIgdmlldyA9IGV4cG9ydHMudmlldyA9IGZ1bmN0aW9uKG5vZGUpe1xuICAgIG5vZGUubm9kZXMgPSBub2RlLm5vZGVzIHx8IFtdO1xuICAgIG5vZGUuYXR0cnMgPSBub2RlLmF0dHJzIHx8IHt9O1xuICAgIHZhciBjbGF6eiA9IG5vZGUuY29sbGFwc2VkID8gJ2hpZGRlbicgOiBcIlwiO1xuLy8gICAgdmFyIGNsYXp6ID0gJyc7XG4gICAgdmFyIHRvZ2dsZUxpc3RlbmVyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgbm9kZS5jb2xsYXBzZWQgPSBub2RlLmNvbGxhcHNlZCA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIsIG5vZGUubmFtZSwgbm9kZS5jb2xsYXBzZWQpXG4vLyAgICAgICAgY2xhenogPSBub2RlLmNvbGxhcHNlZCA/ICdoaWRkZW4nIDogXCJcIjtcbiAgICAgICAgY2xhenogPSAnaGlkZGVuJztcbiAgICAgICAgXG4gICAgfTtcbiAgICByZXR1cm4gbSgndWwnLCB7Y2xhc3M6ICd4bWwnfSxbXG4gICAgICAgIG0oJ2xpJywgW1xuICAgICAgICAgICAgb3BlbmluZ1RhZyhub2RlLCB0b2dnbGVMaXN0ZW5lciksXG4gICAgICAgICAgICBub2RlLnZhbHVlLFxuICAgICAgICAgICAgbSgnZGl2Jywge2NsYXNzOiBjbGF6en0sW1xuICAgICAgICAgICAgICAgIG5vZGUubm9kZXMubWFwKGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmlldyhub2RlKTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgY2xvc2luZ1RhZyhub2RlKVxuICAgICAgICBdKVxuICAgIF0pO1xufTtcblxuXG52YXIgb3BlbmluZ1RhZyA9IGZ1bmN0aW9uKG5vZGUsIHRvZ2dsZUxpc3RlbmVyKXtcbiAgICB2YXIgY2xhenogPSBcInhtbC1lbGVtZW50XCI7XG4gICAgdmFyIGN1cnNvciA9IGhhc05vZGVzKG5vZGUpID8gJ3BvaW50ZXInIDogXCJcIjtcbiAgICB2YXIgdG9nZ2xlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoaGFzTm9kZXMobm9kZSkpe1xuICAgICAgICAgICAgdG9nZ2xlTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG0oXCJzcGFuW3N0eWxlPSdjdXJzb3I6XCIrY3Vyc29yK1wiJ11cIiwge2NsYXNzOiBjbGF6eiwgb25jbGljazogdG9nZ2xlfSxbXG4gICAgICAgIGdldEljb24obm9kZSksXG4gICAgICAgIFwiPFwiLCBub2RlLm5hbWUsIFxuICAgICAgICBtKCdzcGFuJywge2NsYXNzOiBcInhtbC1hdHRyaWJ1dGVcIn0sW1xuICAgICAgICAgICAgXy5tYXAobm9kZS5hdHRycywgZnVuY3Rpb24odmFsdWUsIGtleSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiIFwiICsga2V5K1wiPVwiKydcIicrdmFsdWUrJ1wiJztcbiAgICAgICAgICAgIH0pXG4gICAgICAgIF0pLFxuICAgICAgICBoYXNDaGlsZHJlbihub2RlKT8gXCI+XCIgOiBcIi8+XCJcbiAgICBdKTtcbn07XG5cbnZhciBjbG9zaW5nVGFnID0gZnVuY3Rpb24obm9kZSl7XG4gICAgdmFyIHNwYWNpbmcgPSBub2RlLnZhbHVlID8gXCJcIiA6IGRvdWJsZVNwYWNlO1xuICAgIHJldHVybiBoYXNDaGlsZHJlbihub2RlKSA/IG0oJ3NwYW4nLCB7Y2xhc3M6IFwieG1sLWVsZW1lbnRcIn0sIHNwYWNpbmcsXCI8L1wiICsgbm9kZS5uYW1lICsgXCI+XCIpIDogXCJcIjtcbn07XG5cbnZhciBoYXNDaGlsZHJlbiA9IGZ1bmN0aW9uKG5vZGUpe1xuICAgIHJldHVybiBub2RlLnZhbHVlIHx8IGhhc05vZGVzKG5vZGUpO1xufTtcblxudmFyIGhhc05vZGVzID0gZnVuY3Rpb24obm9kZSl7XG4gICAgcmV0dXJuIG5vZGUubm9kZXMgJiYgbm9kZS5ub2Rlcy5sZW5ndGggIT09IDA7XG59O1xuXG52YXIgZ2V0SWNvbiA9IGZ1bmN0aW9uKG5vZGUpe1xuICAgIHJldHVybiBoYXNOb2Rlcyhub2RlKSA/ICcrICcgOiBkb3VibGVTcGFjZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIFwibmFtZVwiOiBcInJvb3ROb2RlXCIsXG4gIFwiYXR0cnNcIjoge1wiZm9vXCI6XCJiYXJcIiwgbmFtZTogXCJ2YWx1ZVwifSxcbiAgXCJub2Rlc1wiOiBbXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiY2hpbGRcIixcbiAgICAgIFwiYXR0cnNcIjoge1wiZm9vXCI6XCJiYXJcIiwgbmFtZTogXCJ2YWx1ZVwifSxcbiAgICAgIFwibm9kZXNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZWxlbWVudDFcIixcbiAgICAgICAgICBcInZhbHVlXCI6IFwidmFsdWVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZWxlbWVudDJcIixcbiAgICAgICAgICBcInZhbHVlXCI6IFwiYW5vdGhlciB2YWx1ZVwiXG4gICAgICAgIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiY2hpbGQyXCIsXG4gICAgICAgIFwibm9kZXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbGVtZW50MVwiLFxuICAgICAgICAgICAgICBcInZhbHVlXCI6IFwidmFsdWVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWxlbWVudDJcIixcbiAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImFub3RoZXIgdmFsdWVcIixcbiAgICAgICAgICAgICAgXCJhdHRyc1wiOiB7XCJmb29cIjpcImJhclwifVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiZW1wdHlFbGVtZW50XCJcbiAgICB9LFxuICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJlbXB0eUVsZW1lbnRXaXRoQXR0cnNcIixcbiAgICAgICBcImF0dHJzXCI6IHtcImZvb1wiOlwiYmFyXCIsIG5hbWU6IFwidmFsdWVcIn1cbiAgICB9XG4gIF1cbn07XG5cbiJdfQ==
;