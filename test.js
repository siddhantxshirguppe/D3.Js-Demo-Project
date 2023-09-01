var vegaLiteSpec = 
{
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "height":500,
    "width":500,
    "data": {
        "values": [
            {"category": 1, "value": 10},
            {"category": 2, "value": 25},
            {"category": 3, "value": 15}
        ]
    },

    "params": [{
      "name": "highlight",
      "select": {"type": "point", "on": "mouseover"}
    }
    ],

    "mark": {
    "type": "bar",
    "stroke": "black",
    "cursor": "pointer",
    "size": 40 
  },

    "encoding": {
        "x": {"field": "category", "type": "ordinal"},
        "y": {"field": "value", "type": "quantitative"},
        "color": {
          "condition": [{
            "param": "highlight",
            "empty": false,
            "value": "red"
          }],
          "value": "yellow"
        }


      }
}
