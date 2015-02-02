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
