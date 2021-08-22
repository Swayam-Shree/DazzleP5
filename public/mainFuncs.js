function makeVector(from, to){
    return to.copy().sub(from);
} 
function anglesOf(vector){
    let r = vector.mag();
    let theta = acos(-vector.y/r);
    let phi = acos(vector.z/(r * sin(theta)));
    return {theta, phi} ;
}
function wordWrap(text, n){
  let t = "";
  for (let i = 0; i < text.length; ++i){
      if (i > 0 && i % n == 0){
          t += "\n";
      }
      t += text[i];
  }
  return t;
}
function distSq(a, b, c, x, y, z){
    return y == undefined ? ((a - c) * (a - c)) + ((b - x) * (b - x)) : ((a - x) * (a - x)) + ((b - y) * (b - y)) + ((c - z) * (c - z));
}
function pointWithinScreen(v){
  return v.x > -width/2 && v.x < width/2 && v.y > -height/2 && v.y < height/2;
}
function translatePoint(absPointX, absPointY, centerX, centerY, theta) {
    absPointX -= centerX;
    absPointY -= centerY;
    let c = cos(theta);
    let s = sin(theta);
    return [(absPointX * c) + (absPointY * s), (-absPointX * s) + (absPointY * c)];
}