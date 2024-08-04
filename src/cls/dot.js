export class BasicDot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.color = '#ccc';
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export class SingleDot {
  constructor(x, y) {
    this.x = x; 
    this.y = y; 
    this.radius = 5; 
    this.color = '#ccc';
    this.hoverRadius = 35;
    this.isHovered = false;
    this.isSelected = false;
    this.connections = [];
  }

  draw(ctx) {
    ctx.beginPath(); 
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    if (this.isHovered) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.hoverRadius, 0, Math.PI*2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.color;
      ctx.stroke();
      ctx.closePath();
    }
  }

  handleHover(event, rect, activeDot, walls) {
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const distance = Math.sqrt((mouseX - this.x)**2 + (mouseY - this.y)**2);
    if (this.canConnect() && distance <= this.hoverRadius) {
      if (activeDot && this !== activeDot) {
        for (const wall of walls) {
          if (wall.intersectsLine(activeDot, this)) {
            console.log('wall intersects line!')
            this.isHovered = false;
            return;
          }
        }
      }
      console.log('no walls!')
      this.isHovered = true;
    } else {
      this.isHovered = false;
    }
  }

  handleClick(event, rect, activeDot, walls) {
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const distance = Math.sqrt((mouseX - this.x)**2 + (mouseY - this.y)**2);
    if (this.canConnect() && distance <= this.hoverRadius) {
      if (activeDot) {
        for (const wall of walls) {
          if (wall.intersectsLine(activeDot, this)) {
            return false;
          }
        }
      }
      this.isSelected = !this.isSelected; // Toggle state
      return true;
    }
    return false;
  }

  addConnection(dot) {
    if (this.connections.length < 2 && !this.connections.includes(dot)) {
      this.connections.push(dot);
      dot.connections.push(this);
    }
  }

  removeConnection(dot) {
    this.connections = this.connections.filter(conn => conn !== dot);
    dot.connections = dot.connections.filter(conn => conn !== this);
  }

  canConnect() {
    if (this.connections) {
      return this.connections.length < 2;
    } else {
      return false;
    }
  }
}
