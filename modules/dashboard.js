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

