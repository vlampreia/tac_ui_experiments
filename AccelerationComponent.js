define(function(require) {
  var Component = require('Component');

  return class AccelerationComponent extends Component {
    constructor() {
      super();
      this._acceleration = new Vector(0,0);
    }

    get_vector() {
      return this.get_acceleration();
    }

    get_acceleration() {
      return this._acceleration;
    }

    set_acceleration(acceleration) {
      this._acceleration = acceleration;
    }
  }

});
