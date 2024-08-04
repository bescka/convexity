import { BasicDot } from '../cls/dot.js';
import { BasicMenuButton } from '../cls/button.js';
import { TitleText } from '../cls/text.js';
import { AnimationManager } from '../cls/animation-manager.js';
import { EventManager } from '../cls/event-manager.js';

export function drawWelcomeScreen(ctx, sceneManager) {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const welcomeDots = [
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

  const buttonWidth = 100;
  const buttonHeight = 50;

  const welcomeButtons = [
    {
      x: canvas.width / 2 - buttonWidth / 2,
      y: canvas.height / 2,
      text: 'PLAY',
      linksTo: '../levels/00_level_select.js',
      action: 'drawLevelSelectScreen',
    }
  ];

  const eventManager = new EventManager();
  const animationManager = new AnimationManager();

  const buttons = welcomeButtons.map(button => 
    new BasicMenuButton(button.x, button.y, buttonWidth, buttonHeight, button.text, button.linksTo, button.action, eventManager, sceneManager)
  );

  const dots = welcomeDots.map(dot => new BasicDot(dot.x, dot.y));
  const title = new TitleText(ctx, 'CONVEXITY', canvas.width / 2 - 160, canvas.height / 2 - 50);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dots.forEach(dot => dot.draw(ctx));
    title.draw();
    buttons.forEach(button => button.draw(ctx));
  }

  animationManager.startAnimation(animate);

  buttons.forEach(button => button.addEventListeners(canvas));

  return () => {
    animationManager.stopAnimation();
    buttons.forEach(button => button.cleanup());
  };
}
