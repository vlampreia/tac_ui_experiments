define(['Vector'], function(Vector) {
  return class Projectile {
    constructor(pos, target) {
      this.pos = pos;
      this.prev_pos = this.pos;

      this.impulse = 50;

      this.acceleration = target.sub_v(this.pos)
                                .normalize()
                                .mul_f(this.impulse);

      this.target = target;

      this.alive = true;
    }

    update(t, dt) {
      var old = this.pos.copy();
      this.pos = this.pos.add_v(this.pos.sub_v(this.prev_pos))
                         .add_v(this.acceleration.div_f(dt));
      this.prev_pos = old;

      this.acceleration = this.target.sub_v(this.pos)
                                     .normalize()
                                     .mul_f(this.impulse);
    }

    draw(ctx) {
      ctx.fillRect(this.pos.x, this.pos.y, 3, 3);
    }
  }
});
