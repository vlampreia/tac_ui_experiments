define(function() {
  class ShipType {
    constructor(name) {
      this.name = name;
    }

    toString() {
      return this.name;
    }
  }

  ShipType.SMALL = new ShipType('SMALL');
  ShipType.MEDIUM = new ShipType('MEDIUM');
  ShipType.LARGE = new ShipType('LARGE');

  return ShipType;
});
