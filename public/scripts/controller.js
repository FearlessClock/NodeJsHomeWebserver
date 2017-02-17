var currentBodyPart;
var currentAngle;


function chooseBodyPart(bodyPart)
{
	var elem = document.getElementById("bodypart");
	currentBodyPart = bodyPart;
	elem.innerHTML = currentBodyPart;
}
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


var actions = [{angle: 10, bodyPart: 1}];
actions.push({angle: 90, bodyPart: 1});
var url = "http://192.168.1.26/Control";
$( document ).ready(function() {
    $('#submit').click(function()
    {   
        var data = new FormData();
        data.append("angle", currentAngle);
        data.append("bodyPart", currentBodyPart);
         $.ajax({
                url: url,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(result) {
                    console.log("Success");
                },
                error: function(data, result) {
                    console.log(data);
                }
            });
    });
    var interID = undefined;
    $('#wave').click(function()
    {
        var counter = 0;
        interID = setInterval(function(){
            if(counter > 1)
                clearInterval(interID);
        var data = new FormData();
        data.append("angle", actions[counter].angle);
        data.append("bodyPart", actions[counter].bodyPart);
        $.ajax({
            url: url,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(result) {
                console.log("Success");
            },
            error: function(data, result) {
                console.log(data);
            }
        });
        counter++;
        }, 2000);
    });
});
