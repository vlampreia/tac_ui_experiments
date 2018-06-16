define(function() {
  return class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    normalize() {
      var len = this.getMagnitude();
      return this.normalize_m(len);
    }

    normalize_m(magnitude) {
      if (magnitude == 0) return this;
      return new Vector(this.x / magnitude, this.y/magnitude);
    }

    getMagnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    sub_v(vector) {
      return new Vector(this.x - vector.x, this.y - vector.y);
    }

    add_v(vector) {
      return new Vector(this.x + vector.x, this.y + vector.y);
    }

    multiply_v(vector) {
      return this.mul_v(vector);
    }

    mul_v(vector) {
      return new Vector(this.x * vector.x, this.y * vector.y);
    }

    div_v(vector) {
      return new Vector(this.x / vector.x, this.y / vector.y);
    }

    sub_f(value) {
      return new Vector(this.x - value, this.y - value);
    }

    add_f(value) {
      return new Vector(this.x + value, this.y + value);
    }

    mul_f(value) {
      return new Vector(this.x * value, this.y * value);
    }

    div_f(value) {
      return new Vector(this.x / value, this.y / value);
    }

    dot(vector) {
      return this.x * vector.x + this.y * vector.y;
    }

    cross(vector) {
      return this.x * vector.y - this.y * vector.x;
    }

    rotate(theta) {
      var sina = Math.sin(theta);
      var cosa = Math.cos(theta);

      var xp = cosa * this.x - sina * this.y;
      var yp = sina * this.x + cosa * this.y;

      return new Vector(xp, yp);
    }

    copy() {
      return new Vector(this.x, this.y);
    }
  }
});
