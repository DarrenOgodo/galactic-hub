function applyMainColorShadow() {
    const image = document.getElementById('image');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match the image
    canvas.width = image.width;
    canvas.height = image.height;
  
    // Draw the image on the canvas
    context.drawImage(image, 0, 0, image.width, image.height);
    
    // Get pixel data from the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
  
    // Calculate the main color (simplified approach)
    let r = 0, g = 0, b = 0, count = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i];
      g += pixels[i + 1];
      b += pixels[i + 2];
      count++;
    }
    
    // Average the colors
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);
    
    const mainColor = `rgb(${r}, ${g}, ${b})`;
  
    // Apply shadow to image container
    const container = document.getElementById('image-container');
    container.style.boxShadow = `0px 0px 20px 10px ${mainColor}`;
  }
  