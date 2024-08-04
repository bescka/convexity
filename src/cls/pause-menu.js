import { BasicMenuButton } from './button.js';
import { TitleText } from '../cls/text.js';
import { BasicDot } from './dot.js';

export class PauseMenu {
  constructor(ctx, level, eventManager, sceneManager, cleanupFunction) {
    this.ctx = ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    this.eventManager = eventManager;
    this.sceneManager = sceneManager;
    this.isActive = false;
    this.buttons = [];
    this.level = level;
    this.dots = [];
    this.cleanupFunction = cleanupFunction;
    this.title = new TitleText(
      this.ctx, 'MENU', 
      this.ctx.canvas.width/2 - 85, this.ctx.canvas.height/2 - 100)
    this.initButtons();
  }

  initButtons() {
    const centerX = this.ctx.canvas.width / 2;
    const centerY = this.ctx.canvas.height / 2;

    this.buttons.push(new BasicMenuButton(
      centerX - 50, centerY - 25, 100, 50, 'Reset', 
      `../levels/${String(this.level).padStart(2, '0')}_level.js`, 'drawLevel', this.eventManager, this.sceneManager, this.cleanupFunction
    ));

    this.buttons.push(new BasicMenuButton(
      centerX - 50, centerY + 50, 100, 50, 'Home', 
      '../levels/00_convexity_welcome.js', 'drawWelcomeScreen', this.eventManager, this.sceneManager, this.cleanupFunction
    ));
  }

  draw() {
    const pauseMenuDots = [
      { x: 50, y: 70 },
      { x: 100, y: 300 },
      { x: 200, y: 100 },
      { x: 600, y: 400 },
      { x: 400, y: 70 },
      { x: 520, y: 790 },
      { x: 700, y: 70 },
      { x: 600, y: 550 },
      { x: 100, y: 450 },
      { x: 300, y: 520 },
      { x: 660, y: 220 },
    ];
    
    pauseMenuDots.forEach(dot => this.dots.push(new BasicDot(dot.x, dot.y)));
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.buttons.forEach(button => button.draw(this.ctx));
    this.dots.forEach(dot => dot.draw(this.ctx));
    this.title.draw();
    this.buttons.forEach(button => button.addEventListeners(this.ctx.canvas));
  }

  // handleMousemove(event) {
  //   const rect = this.ctx.canvas.getBoundingClientRect();
  //   this.buttons.forEach(button => button.handleMousemove(event, rect));
  // }
  //
  // handleClick(event) {
  //   const rect = this.ctx.canvas.getBoundingClientRect();
  //   this.buttons.forEach(button => button.handleClick(event, rect));
  // }
  //
  // addEventListeners(canvas) {
  //   this.eventManager.addEventListener(canvas, 'mousemove', this.handleMousemove.bind(this));
  //   this.eventManager.addEventListener(canvas, 'click', this.handleClick.bind(this));
  // }
  //
  // removeEventListeners() {
  //   this.eventManager.removeEventListeners();
  // }
}
