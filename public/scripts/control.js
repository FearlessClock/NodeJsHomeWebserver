var currentAngle = 0;
//Setup the slider
$(document).ready(function () {
	$("#slider").roundSlider({
            width: 21,
            radius: "50",
            value: 36,
            mouseScrollAction: true,
            max: "180",
            handleSize: "+3",
            sliderType: "min-range",
            circleShape: "custom-half",
            startAngle: 90,
                change: function (args) {
                    currentAngle = args.value;
            }
        });
});

var currentBodyPart = 0;
//Choose which bodypart to use
function chooseBodyPart(bodyPart)
{
    var elem = document.getElementById("bodypart");
    currentBodyPart = bodyPart;
    elem.innerHTML = "Body part number: " + currentBodyPart;
}

var pathSetSingle = "/setSingleAction";
//When the submit button is pressed, the server updates the current position
$( document ).ready(function() {
    $('#submit').click(function()
    {
        $.ajax({
                url: pathSetSingle,
                data: JSON.stringify({angle:currentAngle, body:currentBodyPart}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: 'POST',
                success: function(result) {
                    console.log("Success");
                },
                error: function(err, result) {
                    console.log(result);
                }
            });
    });
});

var pathSetAction = "/setAction";
//Launch an animation
$( document ).ready(function() {
    $('#wave').click(function()
    {
        $.ajax({
                url: pathSetAction,
                data: JSON.stringify({collName:"wave", key:0}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: 'POST',
                success: function(result) {
                    console.log("Success");
                },
                error: function(err, result) {
                    console.log(result);
                }
            });
    }); 
});