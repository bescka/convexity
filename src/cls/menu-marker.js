export class MenuMarker {
  constructor() {
  }
  draw(ctx) {
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    let text = `Menu [Esc]`;
    let textX = 10;
    let textY = 22;
    ctx.fillText(text, textX, textY);
  }
}
