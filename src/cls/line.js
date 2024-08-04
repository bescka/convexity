export class Line {
  constructor(dot1, dot2, isHovered = false) {
    this.dot1 = dot1;
    this.dot2 = dot2;
    this.isHovered = isHovered;
    this.color = '#CCC'; 
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.dot1.x, this.dot1.y);
    ctx.lineTo(this.dot2.x, this.dot2.y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();

    if (this.isHovered) {
      const angle = Math.atan2(this.dot2.y - this.dot1.y, this.dot2.x - this.dot1.x);
      const offset = 15;

      const xOffset = offset * Math.sin(angle);
      const yOffset = offset * Math.cos(angle);

      const rectPoints = [
        { x: this.dot1.x + xOffset, y: this.dot1.y - yOffset },
        { x: this.dot1.x - xOffset, y: this.dot1.y + yOffset },
        { x: this.dot2.x - xOffset, y: this.dot2.y + yOffset },
        { x: this.dot2.x + xOffset, y: this.dot2.y - yOffset },
      ];

      ctx.beginPath();
      ctx.moveTo(rectPoints[0].x, rectPoints[0].y);
      for (let i = 1; i < rectPoints.length; i++) {
        ctx.lineTo(rectPoints[i].x, rectPoints[i].y);
      }
      ctx.closePath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
  }

  handleHover(event, rect) {
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const distanceToLine = this.distanceFromPointToLine(mouseX, mouseY, this.dot1.x, this.dot1.y, this.dot2.x, this.dot2.y);
    this.isHovered = distanceToLine < 10;
  }
  
  setLine(dot2) {
    this.dot2 = dot2;
    this.dot1.addConnection(dot2);
    dot2.addConnection(this.dot1);
  }

  distanceFromPointToLine(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
