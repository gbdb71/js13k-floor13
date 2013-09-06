function BoundsRenderingSystem(layer) {
  IteratingSystem.call(this, Position, Bounds);
  this.l = layer;
}

__extend(BoundsRenderingSystem, IteratingSystem, {
  a: function onEntityAdded(entity) {
    var bounds = entity.g(Bounds);
    this.l.add(bounds.gfx = new Graphics(function(ctx, color) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0,255,0,.4)';
      ctx.strokeRect(0.5, 0.5, bounds.w - 1, bounds.h - 1);
      ctx.closePath();
    }));
  },
  r: function onEntityRemoved(entity) {
    this.l.remove(entity.g(Bounds).gfx);
  },
  ue: function updateEntity(entity) {
    var position = entity.g(Position);
    var bounds = entity.g(Bounds);

    bounds.gfx.x = (position.x | 0) - (bounds.w / 2 | 0);
    bounds.gfx.y = (position.y | 0) - (bounds.h / 2 | 0);
  }
});
