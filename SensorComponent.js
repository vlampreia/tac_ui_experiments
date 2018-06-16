define(function(require) {
  var Component = require('Component');

  return class SensorComponent extends Component {
    constructor() {
      super();

      this.range = 0;
      this.noise_floor = 0;
      this.spread = 0;
      this.resolution = 0;

      this.log = [];
      this.max_sig = 0;
      this.signal = [];
    }

    set_spread(angle) {
      this.spread = angle;
    }

    set_spread_deg(angle) {
      this.spread = angle * (Math.PI/180);
    }

    inc_spread(angle) {
      this.spread += angle * (Math.PI/180);
    }

    set_range(range) {
      this.range = range;
    }

    set_noise_floor(level) {
      this.noise_floor = level;
    }

    set_resolution(resolution) {
      this.resolution = resolution;
    }
  }

});
