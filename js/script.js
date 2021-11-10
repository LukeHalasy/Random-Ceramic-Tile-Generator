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
ctx.globalCompositeOperation='destination-over';
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

  ctx.fillStyle = 'white';
  ctx.lineWidth = 5;
  ctx.fill();

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.stroke();
};

function fillWhitespaceRandomly(colorPalette) {
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(imageData);
  
  const oldImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  )

  let pixelStack = [];
  let newPos, x, y, reachLeft, reachRight;
  
  for(let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i] > 10) {
    	x = (i / 4) % canvas.width;
		  y = Math.floor((i / 4) / canvas.width);
        
      pixelStack.push([x, y]);

      let color = colorPalette[Math.floor(Math.random()*colorPalette.length)]
      floodFill(color);
    };
  }
  
  function floodFill(color) {
  	newPos = pixelStack.pop();
    x = newPos[0];
    y = newPos[1];
    //get current pixel position
    pixelPos = (y * canvas.width + x) * 4;
    // Go up as long as the color matches and are inside the canvas
    while (y >= 0 && matchWhite(pixelPos)) {
      y--;
      pixelPos -= canvas.width * 4;
    }

    //Don't overextend
    pixelPos += canvas.width * 4;
    y++;
    reachLeft = false;
    reachRight = false;

    // Go down as long as the color matches and in inside the canvas
    while (y < canvas.height && matchWhite(pixelPos)) {
      colorPixel(pixelPos, color);
      if (x > 0) {
        if (matchWhite(pixelPos - 4)) {
          if (!reachLeft) {
            //Add pixel to stack
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }
      if (x < canvas.width - 1) {
        if (matchWhite(pixelPos + 4)) {
          if (!reachRight) {
            //Add pixel to stack
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }
      y++;
      pixelPos += canvas.width * 4;
    }

    //recursive until no more pixels to change
    if (pixelStack.length) {
      floodFill(color);
    }
  }

  //render floodFill result
  ctx.putImageData(imageData, 0, 0);

  //helpers
  function matchWhite(pixelPos) {
    let r = oldImageData.data[pixelPos];
    
    let g = imageData.data[pixelPos + 1];
    let b = imageData.data[pixelPos + 2];
    let a = imageData.data[pixelPos + 3];
    
    return r > 10;
  }

  function colorPixel(pixelPos, color) {
  	oldImageData.data[pixelPos] = 0;
  
    imageData.data[pixelPos] = color[0];
    imageData.data[pixelPos + 1] = color[1];
    imageData.data[pixelPos + 2] = color[2];
    imageData.data[pixelPos + 3] = 255;
  }
};

function drawTile() {
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
  }

  var scheme = new ColorScheme;
  scheme.from_hue(randomIntFromInterval(1, 360))
        .scheme('tetrade')
   
  let colorPalette = scheme.colors().map((color) => {
    return hexToRgb(color);
  }).slice(0, 3);


  drawRandomPolar();
  fillWhitespaceRandomly(colorPalette);
  drawRandomPolar();
  fillWhitespaceRandomly(colorPalette);
}

drawTile();
