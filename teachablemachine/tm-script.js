// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "/funmath/teachablemachine/model/";
const requiredProbability = 0.85;
const min_matches = 8

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    //{'facingMode' : 'environment'} use rear camera
    await webcam.setup({'facingMode' : 'environment'}); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    var webcamContainer=document.getElementById("webcam-container");
    webcamContainer.innerHTML='';
    webcamContainer.appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}
var match = 0;

var times = [new Date().getTime()];
// run the webcam image through the image model
async function predict() {

    times.push(new Date().getTime());
    var fps = times.length / ((times[times.length - 1] - times[0]) / 1000);
    if (times.length > 5) {
        times.shift();
    }
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].className == 'clit') {
            if (prediction[i].probability > requiredProbability) {
                match++;
            } else {
                match=0;
            }
            document.getElementById('debug').innerHTML =
            "Hit >"+requiredProbability+":" + match
            + " Probability: " + prediction[i].probability.toFixed(2)
            + " FPS: " + fps.toFixed(2);
            document.getElementById("probability").style.width = (prediction[i].probability * 100).toFixed(0) + "%";
        }
    }
    if (match >= min_matches) {
        webcam.stop();
        alert("bzzzzzz ...");
    }
}