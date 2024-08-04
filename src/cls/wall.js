export class WallRect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = '#ccc';
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  intersectsLine(dot0, dot1) {
    const { x: r0_x, y: r0_y, width, height } = this;
    const r1_x = r0_x + width;
    const r1_y = r0_y + height;

    const lineIntersects = (d0_x, d0_y, d1_x, d1_y, r0_x, r0_y, r1_x, r1_y) => {
      // console.log(`checking intersection between line (${d0_x},${d0_y}) to (${d1_x}, ${d1_y}) and line (${r0_x},${r0_y}) to (${r1_x}, ${r1_y})`);
      const denominator = (d1_x - d0_x) * (r0_y - r1_y) - (d1_y - d0_y) * (r0_x - r1_x);
      if (denominator === 0) {
        // console.log('Lines are parallel');
        return false;       
      }

      const lambda = (-(r1_y - r0_y) * (r0_x - d0_x) + (r1_x - r0_x) * (r0_y - d0_y)) / denominator;
      const mu = (-(d1_y - d0_y) * (r0_x - d0_x) + (d1_x - d0_x) * (r0_y - d0_y)) / denominator;

      // console.log(`lambda: ${lambda}, mu: ${mu}`);
      
      if (lambda >= 0 && lambda <= 1 && mu >= 0 && mu <= 1) {
        // console.log('Intersection detected');
        return true;
      }

      // console.log('No intersection');
      return false;
    };

    return (
      lineIntersects(dot0.x, dot0.y, dot1.x, dot1.y, r0_x, r0_y, r1_x, r0_y) ||  // Top
      lineIntersects(dot0.x, dot0.y, dot1.x, dot1.y, r0_x, r1_y, r1_x, r1_y) ||  // Bottom
      lineIntersects(dot0.x, dot0.y, dot1.x, dot1.y, r0_x, r0_y, r0_x, r1_y) ||  // Left
      lineIntersects(dot0.x, dot0.y, dot1.x, dot1.y, r1_x, r0_y, r1_x, r1_y)  // Right
    );
  }
}
