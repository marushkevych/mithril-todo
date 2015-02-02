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

