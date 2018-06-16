define(function(require) {

  return class Component {
    constructor() {
      if (new.target == Component) {
        throw new TypeError();
      }
    }


    static get_type() {
      return this.name;
    }

    get_type() {
      return this.constructor.name;
    }
  }

});
