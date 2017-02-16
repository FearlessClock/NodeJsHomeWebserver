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
function sendPost()
{
	// $.post("/accel", {_id:1, x:aX, y:aY, z:aZ}, function(data, status){
            // console.log("Data = " + data + " Status = " + status);
        // });
    var xhr = new XMLHttpRequest();
    xhr.open('post', '192.168.1.29/Control');
    xhr.setRequestHeader('Content-type', 'form-data');
    xhr.send('bodyPart=' + currentBodyPart + '&angle=' + currentAngle);
}