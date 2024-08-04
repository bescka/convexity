import { BasicMenuButton } from './button.js';
import { TitleText } from '../cls/text.js';


export class LevelComplete {
  constructor(ctx, level, eventManager, sceneManager, cleanupFunction) {
    this.ctx = ctx; 
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    this.eventManager = eventManager; 
    this.sceneManager = sceneManager; 
    this.isActive = null;
    this.buttons = [];
    this.level = level;
    this.cleanupFunction = cleanupFunction;
    this.title = new TitleText (
      this.ctx, 'LEVEL COMPLETE', 
      this.ctx.canvas.width/2-250, this.ctx.canvas.height/2 - 100)
    this.initButtons(); // aha call as method not property in the contstructor
  }

  initButtons() {
    const centerX = this.ctx.canvas.width / 2;
    const centerY = this.ctx.canvas.height / 2;
    
    this.buttons.push(new BasicMenuButton(
      centerX - 50, centerY - 25, 100, 50, 'Next Level', 
      `../levels/${String(this.level + 1).padStart(2, '0')}_level.js`, 'drawLevel', this.eventManager, this.sceneManager, this.cleanupFunction
    ));

    this.buttons.push(new BasicMenuButton(
      centerX - 50, centerY + 50, 100, 50, 'Home', 
      '../levels/00_convexity_welcome.js', 'drawWelcomeScreen', this.eventManager, this.sceneManager, this.cleanupFunction
    ));
  }

  draw() {
    // console.log("calling level complete draw")
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.buttons.forEach(button => button.draw(this.ctx));
    this.title.draw();
    this.buttons.forEach(button => button.addEventListeners(this.ctx.canvas));
  }
}
