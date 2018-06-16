define(function(require) {

  var Vector = require('Vector');

  return class TableElement {
    constructor(pos) {
      this.pos = pos;
      this.columns = [];
      this.data = [];
      this.width = 0;
    }

    add_column(header, width) {
      var x = this.pos.x;

      if (this.columns.length > 0) {
        var prev = this.columns[this.columns.length-1];
        x = prev.x + prev.width;
      }

      this.columns.push({header: header, x:x, width: width});
      this.width += width;
    }

    add_entry(data, fg, bg) {
      this.data.push({columns: data, fg:fg, bg:bg});
    }

    set_entry(i, data) {
      this.data[i] = data;
    }

    clear_entries() {
      this.data.length = 0;
    }

    draw(ctx) {
      ctx.save();

      ctx.fillStyle = 'rgb(240, 240, 240)';

      for (var c=0; c<this.columns.length; ++c) {
        ctx.fillText(this.columns[c].header, this.columns[c].x + 3, this.pos.y);
      }

      ctx.strokeStyle = 'rgb(240, 240, 240)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y+5.5);
      ctx.lineTo(this.pos.x + this.width, this.pos.y+5.5);
      ctx.stroke();

      for (var i=0; i<this.data.length; ++i) {
        ctx.fillStyle = this.data[i].bg;
        ctx.fillRect(this.pos.x, y+4, this.width, 14);
        ctx.fillStyle = this.data[i].fg;

        for (var c=0; c<this.columns.length; ++c) {
          var x = this.columns[c].x + 3;
          var y = this.pos.y + 20 + 15*i;

          ctx.fillText(this.data[i].columns[c], x, y);
        }
      }

      ctx.restore();
    }
  }
});
