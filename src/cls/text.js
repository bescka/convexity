export class TitleText {
  constructor(ctx, text, x = 1, y = 1, fontSize = 60, fontFamily = 'Arial', color = '#FFF', lineWidth = 3) {
    this.ctx = ctx;
    this.text = text;
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.lineWidth = lineWidth;
  }

  draw() {
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeText(this.text, this.x, this.y);
  }

  getTextDimensions() {
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    const metrics = this.ctx.measureText(this.text);
    const width = metrics.width;
    const height = this.fontSize; 
    return { width, height };
  }
}

export class ParaText {
  constructor(ctx, text, fontSize = 20, fontFamily = 'Arial', color = '#FFF') {
    this.ctx = ctx;
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
  }

  draw(x, y) {
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    this.ctx.strokeStyle = this.color;
    this.ctx.fillText(this.text, x, y);
  }

  getTextDimensions() {
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    const metrics = this.ctx.measureText(this.text);
    const width = metrics.width;
    const height = this.fontSize; 
    return { width, height };
  }
}
