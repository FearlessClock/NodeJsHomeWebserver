
var url = "http://localhost:8081/earData";
var paperElement = document.getElementById("graph");
var width = 400;
var height = 350;
var paper; //Raph drawing board
$(document).ready(function () {
    paper = new Raphael(paperElement, width, height);
    $.ajax({
        url: url,
        type: 'GET',
        success: function(result) {
            console.log(result[2]);
            createGraph(result);
        },
        error: function(data, result) {
            console.log(data);
        }
    });
});

function createGraph(data)
{
    var amountOfPoints = data.length;
    var start = 0;
    if(amountOfPoints>width)
    {
        start = amountOfPoints - width;
    }
    for(var i = start; i < amountOfPoints; i++)
    {
        // Creates circle at x = 50, y = 40, with radius 10
        var circle = paper.circle(data[i].timestamp*(width/data.length), height - data[i].value*(width/200), 3);
        var txt = paper.print(data[i].timestamp*10, height - data[i].value, "print", paper.getFont("Museo"), 40);
        // Sets the fill attribute of the circle to red (#f00)
        circle.attr("fill", "#f00");

        // Sets the stroke attribute of the circle to white
        circle.attr("stroke", "#fff");
    }
}      