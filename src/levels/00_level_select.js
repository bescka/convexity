import { BasicDot } from '../cls/dot.js';
import { BasicMenuButton } from '../cls/button.js';
import { TitleText } from '../cls/text.js';
import { AnimationManager } from '../cls/animation-manager.js';
import { EventManager } from '../cls/event-manager.js';

export function drawLevelSelectScreen(ctx, sceneManager) {
  const canvas = ctx.canvas;

  const levelSelectDotCoords = [
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

  const levels = 7; // # levels
  const title = new TitleText(ctx, 'SELECT LEVEL', canvas.width / 2 - 200, 100);

  const eventManager = new EventManager();
  const animationManager = new AnimationManager();

  function cleanup() {
    animationManager.stopAnimation();
    eventManager.removeEventListeners();
  };

  const buttons = createDynamicButtons(ctx, eventManager, sceneManager, levels, cleanup);

  const dots = levelSelectDotCoords.map(dot => new BasicDot(dot.x, dot.y));
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    title.draw();
    dots.forEach(dot => dot.draw(ctx));
    buttons.forEach(button => button.draw(ctx));
  }

  animationManager.startAnimation(animate);

  buttons.forEach(button => button.addEventListeners(canvas));

  
  return cleanup
  // return () => {
  //   animationManager.stopAnimation();
  //   buttons.forEach(button => button.cleanup());
  // };
}

function createDynamicButtons(ctx, eventManager, sceneManager, levels, cleanupFunction) {
  const buttonWidth = 100;
  const buttonHeight = 50;
  const buttons = [];
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const cols = Math.floor(canvasWidth / (buttonWidth + 20));
  const rows = Math.ceil(levels / cols);
  const startX = (canvasWidth - (cols * buttonWidth + (cols - 1) * 10)) / 2;
  const startY = 220;
  
  buttons.push(new BasicMenuButton(
    canvasWidth/2 - 180/2, 140, 
    180, buttonHeight, 
    'INSTRUCTIONS', '../levels/00_instructions.js', 
    'drawInstructions', 
    eventManager, 
    sceneManager, 
    cleanupFunction
  ));

  for (let i = 0; i < levels; i++) {
    const x = startX + (i % cols) * (buttonWidth + 10);
    const y = startY + Math.floor(i / cols) * (buttonHeight + 10);
    buttons.push(new BasicMenuButton(
      x, y, buttonWidth, buttonHeight, 
      `LEVEL ${i + 1}`,
      // `../levels/00_loading.js`, // to implement level loading logic
      `../levels/${String(i + 1).padStart(2, '0')}_level.js`,
      'drawLevel',
      eventManager,
      sceneManager
    ));
  }
  return buttons;
}
