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