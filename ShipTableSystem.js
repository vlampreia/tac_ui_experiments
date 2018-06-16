define(function(require) {
  var System = require('System');

  var Transform = require('TransformComponent');
      Sensor = require('SensorComponent');
      Info = require('ShipInfoComponent');
      Targeting = require('TargetingComponent');

  var TableElement = require('TableElement');

  const AU_TO_M = 149597870700;

  function trunc_decimal(number, dec) {
    return Math.round(number*dec)/dec;
  }

  return class ShipTableSystem extends System {
    constructor(table) {
      super([Sensor, Transform]);

      this.table = table;
      this.player_ship = null;
    }

    set_player_ship(ship) {
      this.player_ship = ship;
      this.targeter = this.player_ship.get_component(Targeting);
      this.player_alliance = this.player_ship.get_component(Info).alliance;
    }

    setup() {
      this.table.clear_entries();
      return true;
    }

    process_entity(entity) {
      var log = entity.get_component(Sensor).log;

      for (var i=0; i<log.length; ++i) {
        let e = log[i][0];
        var info = log[i][0].get_component(Info);

        var dist = log[i][3];
        if (dist > AU_TO_M) {
          dist = trunc_decimal(dist/AU_TO_M, 1000) + ' AU'
        } else {
          dist = trunc_decimal(dist/1000, 100) + ' km'
        }

        var azm = trunc_decimal(log[i][1], 1000);
        if (azm >= 0) {
          azm = ' ' + azm;
        }

        let fg_col = 'rgba(200, 200, 200, 1.0)';
        let bg_col = 'rgba(0, 0, 0, 0.5)';

        if (info.alliance === this.player_alliance) {
          fg_col = 'rgb(100, 255, 0)';
        } else if (info.alliance === Alliance.UNKNOWN) {
          fg_col = 'rgb(255, 255, 0)';
        } else if (info.alliance === Alliance.NEUTRAL) {
          fg_col = 'rgb(255, 255, 255)';
        } else {
          fg_col = 'rgb(220, 50, 20)';
        }

        if (this.targeter.is_targeted(e)) {
          bg_col = 'rgba(255, 255, 0, 0.4)';
          //fg_col = 'rgba(0, 0, 0, 1.0)';
        }

        this.table.add_entry([
            info.name,
            info.serial,
            info.type.toString(),
            Math.ceil(info.velocity),
            dist,
            azm,
            Math.round(log[i][2]*1000)/1000
          ],
          fg_col, bg_col
        );
      }

    }
  }

});
