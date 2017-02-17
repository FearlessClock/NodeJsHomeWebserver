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
    $( document ).ready(function() {
        $('#submit').click(function()
        {
            $.post("192.168.1.26/Control",
                
                {
                    'bodyPart': currentBodyPart,
                    'angle': currentAngle
                },
                function(data, status){
                    console.log("Data: " + data + "\nStatus: " + status);
                });
            });
        });
