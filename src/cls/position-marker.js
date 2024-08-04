export class PositionMarker {
  constructor(eventManager, sceneManager) {
    this.eventManager = eventManager;
    this.sceneManager = sceneManager;
    this.mouseX = 0;
    this.mouseY = 0;
    this.handleMousemoveBound = this.handleMousemove.bind(this);

    this.eventManager.addEventListener(this.sceneManager.canvas, 'mousemove', this.handleMousemoveBound);
  }

  draw(ctx) {
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    let text = `(${this.mouseX}, ${this.mouseY})`;
    let textWidth = ctx.measureText(text).width;
    let textHeight = 16; 
    let textX = ctx.canvas.width - textWidth - 10;
    let textY = ctx.canvas.height - textHeight + 10;
    ctx.fillText(text, textX, textY);
  }

  handleMousemove(event, rect) {
    this.mouseX = Math.round(event.clientX - rect.left);
    this.mouseY = Math.round(event.clientY - rect.top);
  }
}
