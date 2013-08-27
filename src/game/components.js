function Position(x, y, r) {
  this.x = x || 0;
  this.y = y || 0;
  this.r = r || 0;
}

Position.d = function(r) {
  var rabs = Math.abs(r);
  if (r == 180 || rabs == 135) {
    return 'n';
  } else if (!r || rabs == 45) {
    return 's';
  }

  return r > 0 ? 'e' : 'w';
};

function Motion(dx, dy, dr) {
  this.dx = dx || 0;
  this.dy = dy || 0;
  this.dr = dr || 0;
}

function Display(gfx) {
  this.gfx = gfx;
}