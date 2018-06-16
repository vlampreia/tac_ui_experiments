define(function() {
  class Alliance {
    constructor(name) {
      this.name = name;
    }
  }

  Alliance.GOOD_GUYS = new Alliance('GOOD_GUYS');
  Alliance.BAD_GUYS = new Alliance('BAD_GUYS');
  Alliance.UNKNOWN = new Alliance('UNKNOWN');
  Alliance.NEUTRAL = new Alliance('NEUTRAL');

  return Alliance
});
