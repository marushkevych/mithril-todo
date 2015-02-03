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