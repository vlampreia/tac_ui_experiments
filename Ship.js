define(function(require) {
  var Vector = require('Vector');
      Projectile = require('Projectile');

  return class Ship {
    constructor(name, serial, alliance, sclass, position) {
      this.pos = position;
      this.prev_pos = this.pos.copy();
      this.name = name;
      this.serial = serial;
      this.alliance = alliance;
      this.sclass = sclass;
      this.trajectory = new Vector(0,0);
      this.acceleration = new Vector(0,0);
      this.impulse = 0;
      this.max_acceleration = 0;
      this.direction_vector = new Vector(0,0);
      this.velocity = 0;
      this.forward_vec = new Vector(0,1);
      this.right_vec = new Vector(1,0);
      this.width = 0;
      this.length = 0;
      this.centre = new Vector(0,0);
      this.hardpoints = [];
      this.hardpoint_turn = 0;
      this.targeting = [];
    }


    setTrajectory(x, y) {
      this.trajectory.x = x;
      this.trajectory.y = y;
    }


    setImpulse(impulse) {
      impulse = Math.min(Math.max(-1.0, impulse), 1.0);
      this.setAcceleration(this.direction_vector, impulse);
    }


    update(t, dt) {
      for (var i=0; i<this.hardpoints.length; ++i) {
        this.hardpoints[i].update(t, dt);
      }

      var velvec = this.pos.sub_v(this.prev_pos);
      this.velocity = Math.sqrt(
        Math.pow(velvec.x, 2) +
        Math.pow(velvec.y, 2)
      ) * 1000 / dt;

      var old = this.pos.copy();
      this.pos = this.pos.add_v(velvec).add_v(this.acceleration.div_f(dt));
      this.prev_pos = old;
    }


    setAcceleration(direction_vec, impulse=1.0) {
      impulse = Math.min(Math.max(-1.0, impulse), 1.0);
      this.direction_vector = direction_vec.normalize();

      this.acceleration = this.direction_vector
                              .mul_f(this.impulse * impulse);
    }


    fire(pos, projectiles) {
      var hp = this.hardpoints[this.hardpoint_turn];
      var p = new Projectile(
        this.pos.sub_v(this.centre).add_v(hp),
        pos
      );

      p.acceleration = new Vector(5,5).mul_f(this.impulse);
      projectiles.push(p);

      this.hardpoint_turn = (this.hardpoint_turn + 1) % this.hardpoints.length;
    }
  }
});
