;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//app goes here
var todo = require('./modules/todo');
var nav = require('./modules/nav');
var home = require('./modules/home');
var dashboard = require('./modules/dashboard');
var footer = require('./modules/footer');

var xmlDisplay = require('./modules/xmlDisplay');
var xml = require('./xml');

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

//m.route(document.body, "/", {
//    "/": new ParentPage(home),
//    "/todo": new ParentPage(todo),
//    "/dashboard/:userID": new ParentPage(dashboard),
//});

m.module(document.body, {
    controller: function(){
        return {xml: xml, collapse:true};
    }, 
    view: xmlDisplay.view
});


},{"./modules/dashboard":2,"./modules/footer":3,"./modules/home":4,"./modules/nav":5,"./modules/todo":6,"./modules/xmlDisplay":7,"./xml":8}],2:[function(require,module,exports){
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
            xmlDisplay.view({xml: xml, collapse:true})
            
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

var view = exports.view = function(ctrl){
    var node = ctrl.xml;
    node.nodes = node.nodes || [];
    node.attrs = node.attrs || {};
    // is collapsed by default
    if(node.collapsed === undefined && ctrl.collapse){
        node.collapsed = true;
    }
    var clazz = node.collapsed ? 'hidden' : "";
        
    return m('ul', {class: 'xml'},[
        m('li', [
            openingTag(node),
            !hasNodes(node) ? node.value :
            m('div', {class: clazz},[
                node.nodes.map(function(child){
                    return view({xml:child, collapse:ctrl.collapse});
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
        hasChildren(node)? ">" : "/>",
        hasNodes(node) && node.collapsed ? doubleSpace + "..." : ""
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
    if(hasNodes(node)){
        return node.collapsed ? '+ ' : '- ';
    } else {
        return doubleSpace;
    }
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmRyZXkvZGV2L3dvcmsvZ2l0aHViL21pdGhyaWwtdG9kby9hcHAuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8vbW9kdWxlcy9kYXNoYm9hcmQuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8vbW9kdWxlcy9mb290ZXIuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8vbW9kdWxlcy9ob21lLmpzIiwiL1VzZXJzL2FuZHJleS9kZXYvd29yay9naXRodWIvbWl0aHJpbC10b2RvL21vZHVsZXMvbmF2LmpzIiwiL1VzZXJzL2FuZHJleS9kZXYvd29yay9naXRodWIvbWl0aHJpbC10b2RvL21vZHVsZXMvdG9kby5qcyIsIi9Vc2Vycy9hbmRyZXkvZGV2L3dvcmsvZ2l0aHViL21pdGhyaWwtdG9kby9tb2R1bGVzL3htbERpc3BsYXkuanMiLCIvVXNlcnMvYW5kcmV5L2Rldi93b3JrL2dpdGh1Yi9taXRocmlsLXRvZG8veG1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvL2FwcCBnb2VzIGhlcmVcbnZhciB0b2RvID0gcmVxdWlyZSgnLi9tb2R1bGVzL3RvZG8nKTtcbnZhciBuYXYgPSByZXF1aXJlKCcuL21vZHVsZXMvbmF2Jyk7XG52YXIgaG9tZSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9ob21lJyk7XG52YXIgZGFzaGJvYXJkID0gcmVxdWlyZSgnLi9tb2R1bGVzL2Rhc2hib2FyZCcpO1xudmFyIGZvb3RlciA9IHJlcXVpcmUoJy4vbW9kdWxlcy9mb290ZXInKTtcblxudmFyIHhtbERpc3BsYXkgPSByZXF1aXJlKCcuL21vZHVsZXMveG1sRGlzcGxheScpO1xudmFyIHhtbCA9IHJlcXVpcmUoJy4veG1sJyk7XG5cbnZhciBQYXJlbnRQYWdlID0gZnVuY3Rpb24oY2hpbGRDb21wb25lbnQpe1xuICAgIHRoaXMuY29udHJvbGxlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuY2hpbGRDb250cm9sbGVyID0gbmV3IGNoaWxkQ29tcG9uZW50LmNvbnRyb2xsZXIoKTtcbiAgICB9O1xuICAgIHRoaXMudmlldyA9IGZ1bmN0aW9uKGN0cmwpe1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbmF2LnZpZXcoKSxcbiAgICAgICAgICAgIGNoaWxkQ29tcG9uZW50LnZpZXcoY3RybC5jaGlsZENvbnRyb2xsZXIpLFxuICAgICAgICAgICAgZm9vdGVyLnZpZXcoKVxuICAgICAgICBdOyAgICAgICAgXG4gICAgfVxufVxuXG5cbi8vc2V0dXAgcm91dGVzIHRvIHN0YXJ0IHcvIHRoZSBgI2Agc3ltYm9sXG5tLnJvdXRlLm1vZGUgPSBcImhhc2hcIjtcblxuLy9tLnJvdXRlKGRvY3VtZW50LmJvZHksIFwiL1wiLCB7XG4vLyAgICBcIi9cIjogbmV3IFBhcmVudFBhZ2UoaG9tZSksXG4vLyAgICBcIi90b2RvXCI6IG5ldyBQYXJlbnRQYWdlKHRvZG8pLFxuLy8gICAgXCIvZGFzaGJvYXJkLzp1c2VySURcIjogbmV3IFBhcmVudFBhZ2UoZGFzaGJvYXJkKSxcbi8vfSk7XG5cbm0ubW9kdWxlKGRvY3VtZW50LmJvZHksIHtcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4ge3htbDogeG1sLCBjb2xsYXBzZTp0cnVlfTtcbiAgICB9LCBcbiAgICB2aWV3OiB4bWxEaXNwbGF5LnZpZXdcbn0pO1xuXG4iLCJ2YXIgZGFzaGJvYXJkID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaWQgPSBtLnJvdXRlLnBhcmFtKFwidXNlcklEXCIpO1xuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oY29udHJvbGxlcikge1xuICAgICAgICByZXR1cm4gbShcImRpdlwiLCBbXG4gICAgICAgICAgICBtKFwiaDFcIiwgJ1VzZXIgRGFzaGJvYXJkJyksXG4gICAgICAgICAgICBtKFwic3BhblwiLCBcIlVzZXJJRDogXCIpLFxuICAgICAgICAgICAgbShcInNwYW5cIiwgY29udHJvbGxlci5pZCksXG4gICAgICAgIF0pO1xuICAgIH1cbn07XG5cbiIsInZhciBmb290ZXIgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgfSxcbiAgICB2aWV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG0oXCJmb290ZXJcIiwgW1xuICAgICAgICAgICAgbSgnaHInKSxcbiAgICAgICAgICAgIG0oJ3NwYW4nLCBcIkFuZHJleSBNLCBhbGwgcmlnaHRzIHJlc2VydmVkXCIpLFxuICAgICAgICBdKTtcbiAgICB9XG59O1xuXG4iLCJ2YXIgeG1sRGlzcGxheSA9IHJlcXVpcmUoJy4veG1sRGlzcGxheScpO1xudmFyIHhtbCA9IHJlcXVpcmUoJy4uL3htbCcpO1xuXG52YXIgdXNlcklkID0gbS5wcm9wKFwiXCIpO1xuXG5cbnZhciBzZXRVc2VyID0gZnVuY3Rpb24obmFtZSl7XG4gICAgdXNlcklkKG5hbWUpO1xuICAgIHRlcm0obmFtZSk7XG59XG5cbnZhciB1c2VycyA9IG0ucHJvcChbXG4gICAge2lkOiAxLCBuYW1lOiBcIkpvaG5cIn0sIFxuICAgIHtpZDogMiwgbmFtZTogXCJKYWNrXCJ9LCBcbiAgICB7aWQ6IDMsIG5hbWU6IFwiSm9sbFwifSwgXG4gICAge2lkOiA0LCBuYW1lOiBcIkJvYlwifSwgXG4gICAge2lkOiA1LCBuYW1lOiBcIk1hcnlcIn1cbl0pO1xudmFyIHRlcm0gPSBtLnByb3AoXCJcIik7XG52YXIgc2VhcmNoID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB0ZXJtKHZhbHVlLnRvTG93ZXJDYXNlKCkpO1xufTtcbnZhciBmaWx0ZXIgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIHRlcm0oKSAmJiBpdGVtLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlcm0oKSkgPiAtMTtcbi8vcmV0dXJuIHRydWU7XG59O1xuXG52YXIgaG9tZSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlZGlyZWN0VG9EYXNoYm9hcmQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbS5yb3V0ZShcIi9kYXNoYm9hcmQvXCIrdXNlcklkKCkpO1xuICAgICAgICAgICAgXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oY3RybCkge1xuICAgICAgICByZXR1cm4gbSgnZGl2JyxbXG4gICAgICAgICAgICBtKFwiaDFcIiwgXCJIb21lIHBhZ2VcIiksXG4gICAgICAgICAgICBtKFwiZGl2XCIsIHVzZXJJZCgpKSxcbiAgICAgICAgICAgIG0oJ2lucHV0Jywge29ua2V5dXA6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBzZWFyY2gpLCB2YWx1ZTogdGVybSgpfSksXG4gICAgICAgICAgICB1c2VycygpLmZpbHRlcihmaWx0ZXIpLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwge29uY2xpY2s6IHNldFVzZXIuYmluZCh0aGlzLCBpdGVtLm5hbWUpfSwgaXRlbS5uYW1lKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbSgnYnV0dG9uJywgeyBvbmNsaWNrOiBjdHJsLnJlZGlyZWN0VG9EYXNoYm9hcmR9LCAnc2hvdyB1c2VyJyksXG4gICAgICAgICAgICBtKFwiaDJcIiwgXCJYbWwgZGlzcGxheVwiKSxcbiAgICAgICAgICAgIHhtbERpc3BsYXkudmlldyh7eG1sOiB4bWwsIGNvbGxhcHNlOnRydWV9KVxuICAgICAgICAgICAgXG4gICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIFxuICAgIH1cbn07XG4iLCJ2YXIgbmF2ID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24oY29udHJvbGxlcikge1xuICAgICAgICByZXR1cm4gbShcImhlYWRlclwiLCBbXG4gICAgICAgICAgICBtKCdzcGFuJywgXCIgfCBcIiksXG4gICAgICAgICAgICBtKCdhJywge2hyZWY6ICcjLyd9LCBcIkhvbWVcIiksXG4gICAgICAgICAgICBtKCdzcGFuJywgXCIgfCBcIiksXG4gICAgICAgICAgICBtKCdhJywge2hyZWY6ICcjL3RvZG8nfSwgJ1RPRE8nKSxcbiAgICAgICAgICAgIG0oJ3NwYW4nLCBcIiB8IFwiKSxcbiAgICAgICAgICAgIG0oJ2EnLCB7aHJlZjogJyMvZGFzaGJvYXJkL3VzZXIxMjMnfSwgJ3VzZXIxMjMnKSxcbiAgICAgICAgICAgIG0oJ3NwYW4nLCBcIiB8IFwiKSxcbiAgICAgICAgXSk7XG4gICAgfVxufTsiLCIvL2FwcCBnb2VzIGhlcmVcbnZhciB0b2RvID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gTU9ERUxcbnRvZG8uVG9kbyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gbS5wcm9wKGRhdGEuZGVzY3JpcHRpb24pO1xuICAgIHRoaXMuZG9uZSA9IG0ucHJvcChmYWxzZSk7XG59O1xuXG50b2RvLlRvZG9MaXN0ID0gQXJyYXk7XG5cbi8vZGVmaW5lIHRoZSB2aWV3LW1vZGVsXG50b2RvLnZtID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciB2bSA9IHt9O1xuICAgIHZtLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9hIHJ1bm5pbmcgbGlzdCBvZiB0b2Rvc1xuICAgICAgICB2bS5saXN0ID0gbmV3IHRvZG8uVG9kb0xpc3QoKTtcbiAgICAgICAgXG4gICAgICAgIHZtLmxpc3QucHVzaChuZXcgdG9kby5Ub2RvKHtkZXNjcmlwdGlvbjogXCJhIHRhc2tcIn0pKTtcblxuICAgICAgICAvL2Egc2xvdCB0byBzdG9yZSB0aGUgbmFtZSBvZiBhIG5ldyB0b2RvIGJlZm9yZSBpdCBpcyBjcmVhdGVkXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uID0gbS5wcm9wKFwiaGVsbG9cIik7XG5cbiAgICAgICAgLy9hZGRzIGEgdG9kbyB0byB0aGUgbGlzdCwgYW5kIGNsZWFycyB0aGUgZGVzY3JpcHRpb24gZmllbGQgZm9yIHVzZXIgY29udmVuaWVuY2VcbiAgICAgICAgdm0uYWRkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodm0uZGVzY3JpcHRpb24oKSkge1xuICAgICAgICAgICAgICAgIHZtLmxpc3QucHVzaChuZXcgdG9kby5Ub2RvKHtkZXNjcmlwdGlvbjogdm0uZGVzY3JpcHRpb24oKX0pKTtcbiAgICAgICAgICAgICAgICB2bS5kZXNjcmlwdGlvbihcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiB2bTtcbn0oKSk7IFxuXG50b2RvLmNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0b2RvLnZtLmluaXQoKTtcbn07XG5cbnRvZG8udmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtKFwiZGl2XCIsIFtcbiAgICAgICAgICAgIG0oXCJoMVwiLCBcIlRPRE8gYXBwXCIpLFxuICAgICAgICAgICAgbShcImlucHV0XCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cihcInZhbHVlXCIsIHRvZG8udm0uZGVzY3JpcHRpb24pLCAgdmFsdWU6IHRvZG8udm0uZGVzY3JpcHRpb24oKX0pLFxuICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7b25jbGljazogdG9kby52bS5hZGR9LCBcIkFkZFwiKSxcbiAgICAgICAgICAgIG0oXCJ0YWJsZVwiLCB0b2RvLnZtLmxpc3QubWFwKGZ1bmN0aW9uKHRhc2ssIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJ0clwiLCBbXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0ZFwiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiaW5wdXRbdHlwZT1jaGVja2JveF1cIiwge29uY2xpY2s6IG0ud2l0aEF0dHIoXCJjaGVja2VkXCIsIHRhc2suZG9uZSksIGNoZWNrZWQ6IHRhc2suZG9uZSgpfSlcbiAgICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ0ZFwiLCB7c3R5bGU6IHt0ZXh0RGVjb3JhdGlvbjogdGFzay5kb25lKCkgPyBcImxpbmUtdGhyb3VnaFwiIDogXCJub25lXCJ9fSwgdGFzay5kZXNjcmlwdGlvbigpKVxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgIF0pO1xufTtcbiIsInZhciBzcGFjZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMTYwKTtcbnZhciBkb3VibGVTcGFjZSA9IHNwYWNlICsgc3BhY2U7XG5cbnZhciBjb250cm9sbGVyID0gZXhwb3J0cy5jb250cm9sbGVyID0gZnVuY3Rpb24oKXtcbn1cblxudmFyIHZpZXcgPSBleHBvcnRzLnZpZXcgPSBmdW5jdGlvbihjdHJsKXtcbiAgICB2YXIgbm9kZSA9IGN0cmwueG1sO1xuICAgIG5vZGUubm9kZXMgPSBub2RlLm5vZGVzIHx8IFtdO1xuICAgIG5vZGUuYXR0cnMgPSBub2RlLmF0dHJzIHx8IHt9O1xuICAgIC8vIGlzIGNvbGxhcHNlZCBieSBkZWZhdWx0XG4gICAgaWYobm9kZS5jb2xsYXBzZWQgPT09IHVuZGVmaW5lZCAmJiBjdHJsLmNvbGxhcHNlKXtcbiAgICAgICAgbm9kZS5jb2xsYXBzZWQgPSB0cnVlO1xuICAgIH1cbiAgICB2YXIgY2xhenogPSBub2RlLmNvbGxhcHNlZCA/ICdoaWRkZW4nIDogXCJcIjtcbiAgICAgICAgXG4gICAgcmV0dXJuIG0oJ3VsJywge2NsYXNzOiAneG1sJ30sW1xuICAgICAgICBtKCdsaScsIFtcbiAgICAgICAgICAgIG9wZW5pbmdUYWcobm9kZSksXG4gICAgICAgICAgICAhaGFzTm9kZXMobm9kZSkgPyBub2RlLnZhbHVlIDpcbiAgICAgICAgICAgIG0oJ2RpdicsIHtjbGFzczogY2xhenp9LFtcbiAgICAgICAgICAgICAgICBub2RlLm5vZGVzLm1hcChmdW5jdGlvbihjaGlsZCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2aWV3KHt4bWw6Y2hpbGQsIGNvbGxhcHNlOmN0cmwuY29sbGFwc2V9KTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgY2xvc2luZ1RhZyhub2RlKVxuICAgICAgICBdKVxuICAgIF0pO1xufTtcblxuXG52YXIgb3BlbmluZ1RhZyA9IGZ1bmN0aW9uKG5vZGUpe1xuICAgIHZhciBjbGF6eiA9IFwieG1sLWVsZW1lbnRcIjtcbiAgICB2YXIgY3Vyc29yID0gaGFzTm9kZXMobm9kZSkgPyAncG9pbnRlcicgOiBcIlwiO1xuICAgIHZhciB0b2dnbGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBub2RlLmNvbGxhcHNlZCA9IG5vZGUuY29sbGFwc2VkID8gZmFsc2UgOiB0cnVlO1xuICAgIH07XG4gICAgcmV0dXJuIG0oXCJzcGFuW3N0eWxlPSdjdXJzb3I6XCIrY3Vyc29yK1wiJ11cIiwge2NsYXNzOiBjbGF6eiwgb25jbGljazogdG9nZ2xlfSxbXG4gICAgICAgIGdldEljb24obm9kZSksXG4gICAgICAgIFwiPFwiLCBub2RlLm5hbWUsIFxuICAgICAgICBtKCdzcGFuJywge2NsYXNzOiBcInhtbC1hdHRyaWJ1dGVcIn0sW1xuICAgICAgICAgICAgXy5tYXAobm9kZS5hdHRycywgZnVuY3Rpb24odmFsdWUsIGtleSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiIFwiICsga2V5K1wiPVwiKydcIicrdmFsdWUrJ1wiJztcbiAgICAgICAgICAgIH0pXG4gICAgICAgIF0pLFxuICAgICAgICBoYXNDaGlsZHJlbihub2RlKT8gXCI+XCIgOiBcIi8+XCIsXG4gICAgICAgIGhhc05vZGVzKG5vZGUpICYmIG5vZGUuY29sbGFwc2VkID8gZG91YmxlU3BhY2UgKyBcIi4uLlwiIDogXCJcIlxuICAgIF0pO1xufTtcblxudmFyIGNsb3NpbmdUYWcgPSBmdW5jdGlvbihub2RlKXtcbiAgICB2YXIgc3BhY2luZyA9IG5vZGUudmFsdWUgPyBcIlwiIDogZG91YmxlU3BhY2U7XG4gICAgcmV0dXJuIGhhc0NoaWxkcmVuKG5vZGUpID8gbSgnc3BhbicsIHtjbGFzczogXCJ4bWwtZWxlbWVudFwifSwgc3BhY2luZyxcIjwvXCIgKyBub2RlLm5hbWUgKyBcIj5cIikgOiBcIlwiO1xufTtcblxudmFyIGhhc0NoaWxkcmVuID0gZnVuY3Rpb24obm9kZSl7XG4gICAgcmV0dXJuIG5vZGUudmFsdWUgfHwgaGFzTm9kZXMobm9kZSk7XG59O1xuXG52YXIgaGFzTm9kZXMgPSBmdW5jdGlvbihub2RlKXtcbiAgICByZXR1cm4gbm9kZS5ub2RlcyAmJiBub2RlLm5vZGVzLmxlbmd0aCAhPT0gMDtcbn07XG5cbnZhciBnZXRJY29uID0gZnVuY3Rpb24obm9kZSl7XG4gICAgaWYoaGFzTm9kZXMobm9kZSkpe1xuICAgICAgICByZXR1cm4gbm9kZS5jb2xsYXBzZWQgPyAnKyAnIDogJy0gJztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZG91YmxlU3BhY2U7XG4gICAgfVxuICAgIHJldHVybiBoYXNOb2Rlcyhub2RlKSA/ICcrICcgOiBkb3VibGVTcGFjZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIFwibmFtZVwiOiBcInJvb3ROb2RlXCIsXG4gIFwiYXR0cnNcIjoge1wiZm9vXCI6XCJiYXJcIiwgbmFtZTogXCJ2YWx1ZVwifSxcbiAgXCJub2Rlc1wiOiBbXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiY2hpbGRcIixcbiAgICAgIFwiYXR0cnNcIjoge1wiZm9vXCI6XCJiYXJcIiwgbmFtZTogXCJ2YWx1ZVwifSxcbiAgICAgIFwibm9kZXNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZWxlbWVudDFcIixcbiAgICAgICAgICBcInZhbHVlXCI6IFwidmFsdWVcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZWxlbWVudDJcIixcbiAgICAgICAgICBcInZhbHVlXCI6IFwiYW5vdGhlciB2YWx1ZVwiXG4gICAgICAgIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiY2hpbGQyXCIsXG4gICAgICAgIFwibm9kZXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbGVtZW50MVwiLFxuICAgICAgICAgICAgICBcInZhbHVlXCI6IFwidmFsdWVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWxlbWVudDJcIixcbiAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImFub3RoZXIgdmFsdWVcIixcbiAgICAgICAgICAgICAgXCJhdHRyc1wiOiB7XCJmb29cIjpcImJhclwifVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiZW1wdHlFbGVtZW50XCJcbiAgICB9LFxuICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJlbXB0eUVsZW1lbnRXaXRoQXR0cnNcIixcbiAgICAgICBcImF0dHJzXCI6IHtcImZvb1wiOlwiYmFyXCIsIG5hbWU6IFwidmFsdWVcIn1cbiAgICB9XG4gIF1cbn07XG5cbiJdfQ==
;