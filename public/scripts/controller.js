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
        waveSendAnimation();
    });    

});
var counter = 0;
var animationURL = "http://pieter.eu.ngrok.io/GetAnimationData";
function waveSendAnimation()
{
    $.ajax({
        url: animationURL,
        contentType: "application/x-www-form-urlencoded",
        data: {keyframe:counter},
        type: 'POST',
        success: function(result) {
            if(result != null)
            {
    			var actions = [];
	            actions.push(result.rightArm);
	            actions.push(result.leftArm);
	            actions.push(result.rightLeg);
	            actions.push(result.leftLeg);   

			    sendDataToArduino(actions);
        	}
        	else
        	{
        		console.log("Nothing left to send");
        		counter = 0;
        		return;
        	}
        },
        error: function(data, result) {
            console.log(data);
            console.log("The request failed");
            return;
        }
    });
}

function sendDataToArduino(act)
{
	for(var i = 0; i < 4; i++)
    {    
    	var formData = new FormData();
    	formData.append("angle", act[i]);
    	formData.append("bodyPart", i);
        $.ajax({
            url: url,
            data: formData,
            cache: false,
            async: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(result) {
                console.log("Success 2nd post");
            },
            error: function(data, result) {
            	console.log("Second post failed");
            }
        });
    }
    setTimeout(function(){waveSendAnimation();}, 2000);
    counter++;  
}
