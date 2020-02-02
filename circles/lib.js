function addCircle() {
    var speed = document.getElementById("speed").value;
    var direction;
    if (document.getElementById("right").checked) {
        direction="R";
    } else {
        direction="L";
    }

    console.log("speed " + speed);
    console.log("direction " + direction);

    newCircle = {
        id: circleId++,
        speed: speed,
        direction: direction
    }
    circles.push(newCircle);

    location.hash="#" + serialize();
    draw(0, false)
    listCircles();
}

function removeCircle(id) {
    console.log("removing circle " + id);

    for( var i = 0; i < circles.length; i++){
        if ( circles[i].id == id) {
            circles.splice(i, 1);
        }
    }
    location.hash="#" + serialize();
    draw(0, false)
    listCircles();
}

function toggleHighRes() {
    if (!highresEnabled) {
        enableHighRes();
    } else {
        disableHighRes();
    }
    location.hash="#" + serialize();
}

function circle(ctx, r, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}

function calculate(fi, r, outerCenterX, outerCenterY, speed, direction) {
    innerR = r/rDevision;
    if (direction == "R") {
        fi = -fi;
    }
    var res = {
        r:innerR,
        x:Math.sin(speed * fi/180 * Math.PI) * (innerR) + outerCenterX,
        y:Math.cos(speed * fi/180 * Math.PI) * (innerR) + outerCenterY
    }
    return res;
}

var timer;
function draw(fi, repeat) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    circle(ctx, r, centerX, centerY);

    c = {
        r:r,
        x:centerX,
        y:centerY
    }

    circles.forEach(function(item) {
        c=calculate(fi, c.r, c.x, c.y, item.speed, item.direction);
        circle(ctx, c.r, c.x, c.y);
    })

    var point = {
        posX:c.x,
        posY:c.y
    }
    centers.push(point);
    centers.forEach(function(item){ctx.fillRect(item.posX,item.posY,lineThickness,lineThickness);});

    if (repeat) {
        if (fi < 360) {
            timer = setTimeout(function() {draw(fi+dFi, true);}, 5);
        }
    } else {
        clearTimeout(timer);
        centers = [];
        draw(0, true);
    }
}

function serialize() {
    var string="";
    circles.forEach(function(item) {
        string = string + ";c=" + item.speed + ":" + item.direction
    });
    if (highresEnabled) {
        string = string + ";res=H";
    }
    return string;
}

function deserialize(string) {
    console.log("Deserializing: " + string);
    var list = "";
    string.split(";").forEach(function(item) {
        if (item) {
            kv = item.split("=");
            if (kv[0] == "c") {
                cDef = kv[1].split(":");
                circleDef = {
                    id: circleId++,
                    speed: cDef[0],
                    direction: cDef[1]
                }
                circles.push(circleDef)
            } else if (kv[0] == "res") {
                if (kv[1]=="H") {
                    enableHighRes();
                }
            }
        }
    })
}

function listCircles() {
    var list = "";
    circles.forEach(function(item) {
        list = list + "speed: " + item.speed + " direction: " + item.direction;
        list = list + " <span onclick=\"javascript:removeCircle('" + item.id + "')\" style=\"cursor:pointer\"> :remove:</span> ";
        list = list + " <br />";
    })
    document.getElementById("circles").innerHTML=list;
}

function enableHighRes() {
    highresEnabled=true;
    dFi=0.02;
    lineThickness = 3;
    document.getElementById("highres").checked="checked";
}

function disableHighRes() {
    highresEnabled=false;
    dFi=0.1;
    lineThickness = 3;
    document.getElementById("highres").checked="";
}

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = '#ff0000';

var centerX = canvas.width / 2;
var centerY = canvas.height / 2;

var r = centerY;
var rDevision=2;

var highresEnabled=false;
var dFi=0.1;
var lineThickness = 3;

var centers = [];
var circles = [];

var circleId=1;

deserialize(location.hash.substring(1, location.hash.length));

//fill some demo data, if nothing is specified
if (circles.length == 0) {
    newCircle = {
        id: circleId++,
        speed: Math.floor(Math.random() * 3) + 1,
        direction: "L"
    }
    circles.push(newCircle);

    newCircle = {
        id: circleId++,
        speed: Math.floor(Math.random() * 10) + 3,
        direction: "R"
    }
    circles.push(newCircle);
}
listCircles();

if (circles.length > 0) {
    draw(0, true);
}


