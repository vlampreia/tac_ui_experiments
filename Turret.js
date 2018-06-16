define(function(require) {
  var Vector = require('Vector');

  return class Turret {
    constructor(ship, pos, projectiles) {
      this.ship = ship;
      this.pos = pos;
      this.projectiles = projectiles;

      if (new.target == Turret) {
        throw new TypeError('Attempting to construct abstract class');
      }
      if (this.fire === undefined) {
        throw new TypeError('this.fire() not implemented');
      }
      if (this.update === undefined) {
        throw new TypeError('this.update() not defined');
      }
    }

    get_world_pos() {
      return this.ship.pos.sub_v(this.ship.centre).add_v(this.pos);
    }
  }

});
