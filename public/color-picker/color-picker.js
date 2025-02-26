export function applyMainColorShadow(image){
  // create canvas for colour extraction
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  // draw image on temp canvas 
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  // get individual pixel data 
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // calculate main colour 
  let r=0, g=0, b=0, count=0;

  for(let i=0; i<pixels.length; i+=4){
    r += pixels[i];
    g += pixels[i+1];
    b += pixels[i+2];
    count++;
  }

  r = Math.floor(r/count);
  g = Math.floor(g/count);
  b = Math.floor(b/count);

  const mainColor = `rgb(${r},${g},${b})`;

  image.style.boxShadow = `0px 0px 20px 2px ${mainColor}`;
}