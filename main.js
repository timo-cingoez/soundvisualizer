const canvas = document.getElementById('canvas');
canvas.width = 500;
canvas.height = 300;
const canvasContext = canvas.getContext('2d');

const audio = document.getElementById('audio');
audio.src = 'sound.mp3';

let audioIntervalId;
let audioAnalyserNode;
let initFinished = false;

const playBtn = document.getElementById('play');
playBtn.addEventListener('click', () => {
    if (initFinished === false) {
        initAudioContextAndNodes();
    }
    audio.play();

    const bufferLength = audioAnalyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (canvas.width / 2) / bufferLength;
    let left;

    function animate() {
        left = 0;
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        audioAnalyserNode.getByteFrequencyData(dataArray);
        drawBars(bufferLength, left, barWidth, dataArray);
        requestAnimationFrame(animate);
    }

    initFinished = true;
    animate();
});

const stopBtn = document.getElementById('stop');
stopBtn.addEventListener('click', function () {
    audio.pause();
    clearInterval(audioIntervalId);
})

const audioInput = document.getElementById('audio-input');
const currentAudio = document.getElementById('currentAudio');
audioInput.addEventListener('change', function () {
    const files = this.files;
    if (files[0]) {
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
    }
    currentAudio.textContent = files[0].name;
});

function initAudioContextAndNodes() {
    clearInterval(audioIntervalId);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioSourceNode = audioContext.createMediaElementSource(audio);
    audioAnalyserNode = audioContext.createAnalyser();
    audioSourceNode.connect(audioAnalyserNode);
    audioAnalyserNode.connect(audioContext.destination);
    audioAnalyserNode.fftSize = 256;
}

function drawBars(bufferLength, left, width, data) {
    for (let i = 0; i < bufferLength; i++) {
        const height = data[i];
        const red = i * (height / 20);
        const green = i / 2;
        const blue = height / 2 + 25;
        canvasContext.fillStyle = `rgb(${red},${green},${blue})`;
        canvasContext.fillRect(canvas.width / 2 - left, canvas.height - height, width, height);
        left += width;
    }
    for (let i = 0; i < bufferLength; i++) {
        const height = data[i];
        const red = i * (height / 20);
        const green = i / 2;
        const blue = height / 2 + 25;
        canvasContext.fillStyle = `rgb(${red},${green},${blue})`;
        canvasContext.fillRect(left, canvas.height - height, width, height);
        left += width;
    }
}