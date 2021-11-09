const canvas = document.getElementById('tileCanvas');
const ctx = canvas.getContext('2d');
const w = 300; const h = 300;
const cx = w; const cy = h;
canvas.width = w * 2;
canvas.height = h * 2;
canvas.style.width = w + 'px';
canvas.style.height = h + 'px';

ctx.clearRect(0, 0, w * 2, h * 2);
ctx.moveTo(cx, cy);
ctx.beginPath();

const fn = t =>
  1 - Math.cos(t) * Math.sin(3 * t);

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomEvenNumber(min, max) {
  let randomNumber = randomIntFromInterval(min, max);
  while (randomNumber % 2 != 0) {
    randomNumber = randomIntFromInterval(min, max);
  }

  return randomNumber;
}
function drawRandomPolar() {
  // One to do is r = sin(a * t) where a is even, and 0 < t < 2pi, flower
  // Another is r= b * sin (a * t) + c, where you just let a is even, and b and c are allowed to run wild, but you need to check that it doesn't just cover up the whole tile
  // BOTH OF THE ABOVE, but just with tan work
  const functionTypes = ["sin", "cos"];
  const functionType = functionTypes[Math.floor(Math.random() * functionTypes.length)]

  let a = randomEvenNumber(-12, 12);
  let b = randomIntFromInterval(-10, 10) / 10;
  let c = randomIntFromInterval(-100, 100) / 100;

  console.log("functionType", functionType);
  console.log("a", a);
  console.log("b", b);
  console.log("c", c);

  const fn = (t) => {
    switch(functionType) {
      case "sin":
        return b * Math.sin(a * t) + c;
        break;
      case "cos":
        return b * Math.cos(a * t) + c;
        break;
    }
  }
    
  Array.from(Array(500).keys()).forEach(idx => {
    const t = (idx)/499 * 2 * Math.PI;
    const r = w * 0.5 * fn(t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    ctx.lineTo(x, y);
  }); 

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.stroke();
};

function getPixelData() {
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(imageData);
};

drawRandomPolar();
getPixelData();


