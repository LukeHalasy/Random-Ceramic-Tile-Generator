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
  ctx.fill();

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 7;
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
    imageData.data[pixelPos + 3] = 150;
  }
};

function drawRandomCenterPolar(widthRatio, fill) {
  const functionTypes = ["negsincos", "sincos", "symsincos", "cossin"];
  const functionType = functionTypes[Math.floor(Math.random() * functionTypes.length)]
  const angleOfRotation = randomIntFromInterval(0, 360);

  const precision = 10; // 1 decimal
  const upperLimit = 5;
  const lowerLimit = -5;
  const a = Math.floor(Math.random() * (upperLimit * precision - lowerLimit * precision) + lowerLimit * precision) / (1*precision);

  
  console.log("functionType", functionType);
  console.log("a", a);
  console.log("r", widthRatio);

  const fn = (t) => {
    if (functionType == "sincos") {
      return widthRatio * Math.sin(a * Math.cos(t));
    } else if (functionType == "negsincos") {
      return -1 * widthRatio * Math.sin(a * Math.cos(t));
    } else if (functionType == "symsincos") {
      return widthRatio * Math.sin(a * Math.cos(t)) * Math.sin(a * Math.cos(t));
    } else {
      // cossin
      return widthRatio * Math.cos(a * Math.sin(t));
    }
  }
  
  ctx.moveTo(cx, cy);
  ctx.beginPath();
  Array.from(Array(500).keys()).forEach(idx => {
    const period = (functionType == "cossin" || functionType == "symsincos") ? 2 * Math.PI : Math.PI;
    console.log(period);
    const t = ((idx)/499 * period);
    const r = w * 0.5 * fn(t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    ctx.lineTo(x, y);
  });

  
  if (fill) {
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 12;
  } else {
    ctx.lineWidth = 7;
  }

  ctx.strokeStyle = '#000';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.closePath();
};

function drawRandomEdgePattern() {
  console.log("edge");
  // tan2 = tan(2t) + c
  // negtan2 = -tan(2t) + c
  // tan1 = tan(1t) + c
  // negtan1 = -tan(1t) + c, from -1 to 1
  const functionTypes = ["tan2", "tan2", "tan1", "negtan1"];
  const functionType = functionTypes[Math.floor(Math.random() * functionTypes.length)]

  const precision = 10; // 1 decimal
  const upperLimit = 1.5;
  const lowerLimit = -1.5;
  const c = Math.floor(Math.random() * (upperLimit * precision - lowerLimit * precision) + lowerLimit * precision) / (1*precision);

  

  console.log("functionType", functionType);
  console.log("c", c);
  
  const fn = (t) => {
    if (functionType == "tan2") {
      return Math.tan(2 * t) + c
    } else if (functionType == "negtan2") {
      return (-1 * Math.tan(2 * t)) + c
    } else if (functionType == "tan1") {
      return Math.tan(t) + c
    } else {
      // negtan1
      return (-1 * Math.tan(t)) + c
    }
  }
    
  ctx.moveTo(cx, cy);
  ctx.beginPath();

  Array.from(Array(500).keys()).forEach(idx => {
    const period = 2 * Math.PI;
    const t = ((idx)/499 * period);
    const r = w * 0.5 * fn(t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    ctx.lineTo(x, y);
  });

  //ctx.fillStyle = 'white';
  // ctx.fill();

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 7;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.closePath();
}

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

  ctx.globalCompositeOperation = "destination-over";
  drawRandomCenterPolar(0.5, fill=true);

  //fillWhitespaceRandomly(colorPalette);
  drawRandomCenterPolar(1.2, fill=true);
  drawRandomEdgePattern();

  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, w * 2, h * 2);
  ctx.closePath();

  fillWhitespaceRandomly(colorPalette);
}


var img = document.createElement( "img" );
// img.src = "https://homedepot.scene7.com/is/image/homedepotcanada/p_1001101843.jpg?wid=1000&hei=1000&op_sharpen=1";
img.src = "js/Textures/Marble4.jpg";

img.onload = function() {
  drawTile();
  //ctx.restore();
  ctx.resetTransform();
  //ctx.globalCompositeOperation = "dest-over";
  ctx.drawImage( img, 0, 0, canvas.width, canvas.height );
}
