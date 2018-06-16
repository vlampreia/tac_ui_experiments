define(function(require) {
  var Component = require('Component');

  return class ShipInfoComponent extends Component {
    constructor(name, serial, alliance, type) {
      super();
      this.name = name;
      this.serial = serial;
      this.alliance = alliance;
      this.type = type;
      this.velocity = 0;
      this.distance = 0;
    }
  }

});
