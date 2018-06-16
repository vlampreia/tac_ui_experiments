define(function(require) {
  var System = require('System');

  var Sensor = require('SensorComponent');
      Transform = require('TransformComponent');
      PlanetInfo = require('PlanetInfoComponent');
      ShipInfo = require('ShipInfoComponent');
      Player = require('PlayerComponent');


  function line_intersects_circle(p1, p2, pc, pr) {
    var p1_p2 = p2.sub_v(p1);
    var pc_p1 = p1.sub_v(pc);

    var a = p1_p2.dot(p1_p2);
    var b = 2 * pc_p1.dot(p1_p2);
    var c = pc_p1.dot(pc_p1) - pr * pr;

    var disc = b*b - 4*a*c;

    if (disc < 0) return false;

    disc = Math.sqrt(disc);

    var t1 = (-b - disc) / (2*a);
    var t2 = (-b + disc) / (2*a);

    if (t1 >= 0 && t1  <= 1) {
      //entry
      return true;
    }

    if (t2 >= 0 && t2 <= 1) {
      //exit
      return true;
    }

    return false;
  }


  return class SensorSystem extends System {
    constructor() {
      super([Transform, Sensor]);

      this.ship_entities = [];
    }

    setup() {
      this.ship_entities = this._ecs.get_entity_manager()
                                    .get_entities_with_components([
                                        ShipInfo
                                    ]);

      this.planets = this._ecs.get_entity_manager()
                              .get_entities_with_components([
                                  PlanetInfo,
                                  Transform
                              ]);
      return true;
    }

    teardown() {

    }

    process_entity(entity) {
      var transf = entity.get_component(Transform);
      var spos = transf.get_position();
      var s = entity.get_component(Sensor);

      s.log.length = 0;
      s.max_sig = s.noise_floor;

      var obstacles = [];
      for (var i=0; i<this.planets.length; ++i) {
        var pos = this.planets[i].get_component(Transform).get_position();
        var dist = pos.sub_v(spos).getMagnitude();
        if (dist > s.range) continue;
        obstacles.push(this.planets[i]);
      }

      for (var i=0; i<this.ship_entities.length; ++i) {
        var e = this.ship_entities[i];
        if (e.has_component(Player)) continue;

        var pos = e.get_component(Transform).get_position();
        var spos_pos = pos.sub_v(spos);
        var dist = spos_pos.getMagnitude();

        if (dist > s.range) continue;

        var intersects = false;
        for (var pi=0; pi<this.planets.length; ++pi) {
          var ppos = this.planets[pi].get_component(Transform).get_position();
          var r = this.planets[pi].get_component(PlanetInfo).radius;
          if (line_intersects_circle(spos, pos, ppos, r)) {
            intersects = true;
            break;
          }
        }
        if (intersects) continue;

        pos = pos.sub_v(spos);
        var angle = Math.atan2(
          transf.get_orientation_v().cross(pos),
          transf.get_orientation_v().dot(pos)
        );

        if (Math.abs(angle) > s.spread) continue;

        var size = e.get_component(ShipInfo).type;
        if (size == ShipType.SMALL) size = 20;
        if (size == ShipType.MEDIUM) size = 50;
        if (size == ShipType.LARGE) size = 100;
        var signal = (size / s.resolution) / dist * s.spread*1000;

        if (!isFinite(signal)) continue;
        s.max_sig = Math.max(s.max_sig, signal);
        s.log.push([e, angle, signal, dist]);
      }

      s.log.sort(function(a, b) { return a[1] - b[1]; });

      this.noisify(s);
    }

    noisify(sensor) {
      let values = [];
      let _x = 0;
      let idx = 0;

      for (var i=0; i<sensor.log.length; ++i) {
        let si = sensor.log[i][0].get_component(ShipInfoComponent);
        let angle = sensor.log[i][1];
        let sig = sensor.log[i][2];
        let w = (0.01*sig)/(sensor.spread*2/sensor.resolution);
        let sig_x = (sensor.spread+angle)/(2*sensor.spread);

        while (_x >= (sig_x - w)) {
          --idx;
          _x -= 0.001;
        }

        while (_x < (sig_x - w)) {
          let sig_v = sensor.noise_floor/2 + sensor.noise_floor*Math.random();
          values[idx] = Math.max(sig_v, (values[idx] || 0));
          _x += 0.001;
          ++idx;
        }

        while (_x < sig_x) {
          let sig_v = sig - (((sig_x-_x)));
          sig_v += (sensor.noise_floor/2 + sensor.noise_floor*Math.random()) - sig_v/2;
          values[idx] = Math.max(sig_v, (values[idx] || 0));
          _x += 0.001;
          ++idx;
        }

        while (_x < (sig_x + w)) {
          let sig_v = sig - ((_x-(sig_x)));
          sig_v += (sensor.noise_floor/2 + sensor.noise_floor*Math.random()) - sig_v/2;
          values[idx] = Math.max(sig_v, (values[idx] || 0));
          _x += 0.001;
          ++idx;
        }
      }

      while (_x < 1.0) {
        values[idx] = (sensor.noise_floor/2 + sensor.noise_floor*Math.random());
        _x += 0.001;
        ++idx;
      }

      sensor.signal = values;
    }
  }

});
