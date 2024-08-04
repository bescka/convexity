export class BasicMenuButton {
  constructor(x, y, width = 100, height = 50, text, linksTo, action, eventManager, sceneManager, cleanupFunction = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.linksTo = linksTo;
    this.action = action;
    this.isHovered = false;
    this.eventManager = eventManager;
    this.sceneManager = sceneManager;
    this.handleMousemoveBound = this.handleMousemove.bind(this);
    this.handleClickBound = this.handleClick.bind(this);
    this.cleanupFunction = cleanupFunction;
  }

  draw(ctx) {
    ctx.fillStyle = this.isHovered ? '#000' : '#FFF';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Border
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.font = '20px Arial';
    ctx.fillStyle = this.isHovered ? '#FFF' : '#000';
    ctx.fillText(this.text, this.x + this.width / 2 - ctx.measureText(this.text).width / 2, this.y + this.height / 2 + 8);
  }

  handleMousemove(event, rect) {
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.isHovered = mouseX > this.x && mouseX < this.x + this.width &&
                     mouseY > this.y && mouseY < this.y + this.height;
  }

  async handleClick(event, rect) {
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (mouseX > this.x && mouseX < this.x + this.width &&
        mouseY > this.y && mouseY < this.y + this.height) {
      this.cleanup();
      if (this.cleanupFunction) {
        console.log('this button has cleanup function')
        this.cleanupFunction();
      }

      try {
        console.log("running sceneManager")
        await this.sceneManager.switchTo(this.linksTo, this.action);
      } catch (error) {
        console.error('Error loading module:', error);
      }
    }
  }

  addEventListeners(canvas) {
    this.eventManager.addEventListener(canvas, 'click', this.handleClickBound);
    this.eventManager.addEventListener(canvas, 'mousemove', this.handleMousemoveBound);
  }

  removeEventListeners() {
    this.eventManager.removeEventListeners();
  }

  cleanup() {
    this.removeEventListeners();
  }
}
