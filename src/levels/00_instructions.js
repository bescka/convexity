import { BasicDot } from '../cls/dot.js';
import { BasicMenuButton } from '../cls/button.js';
import { ParaText, TitleText } from '../cls/text.js';
import { AnimationManager } from '../cls/animation-manager.js';
import { EventManager } from '../cls/event-manager.js';

const instructionsDotCoords = [
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

const buttonWidth = 200;
const buttonHeight = 50;

export function drawInstructions(ctx, sceneManager) {
  const canvas = ctx.canvas;
  const eventManager = new EventManager();
  const animationManager = new AnimationManager();
  
  const instructionsButtons = [
    {
      x: canvas.width / 2 - buttonWidth / 2,
      y: canvas.height - 100,
      text: 'BACK',
      linksTo: '../levels/00_level_select.js',
      action: 'drawLevelSelectScreen',
    }
  ];

  const buttons = instructionsButtons.map(button =>
    new BasicMenuButton(button.x, button.y, buttonWidth, buttonHeight, button.text, button.linksTo, button.action, eventManager, sceneManager)
  );

  const dots = instructionsDotCoords.map(dot => new BasicDot(dot.x, dot.y));
  const title = new TitleText(ctx, 'INSTRUCTIONS');
  const titleWidth = title.getTextDimensions().width;
  title.y = 100;
  title.x = (canvas.width - titleWidth) / 2;
  
  const paragraphs = [
    'A convex shape made up of straight lines is one where every corner points outwards.',
    'Connect dots to create 2D convex shapes. Use all of the dots to complete the level.',
    'Each dot can only be used in one shape. Lines from different shapes can cross over ',
    'each other. Lines cannot directly cross solid blocks.',
    'Left click to select a dot and draw to the next.', 
    'Hovering near a dot will make it selectable within a perimeter. Left click to set the line.',
    'Right click to remove the line under cursor. Right click whilst hovering over a line to',
    'remove it. [Esc] will bring up the menu.',
    // 'Points are awarded based on total surface area of your solution.',
  ];

  const paraTexts = paragraphs.map(text => new ParaText(ctx, text));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dots.forEach(dot => dot.draw(ctx));
    title.draw();

    const startingY = 150;
    const lineHeight = 40;
    paraTexts.forEach((para, index) => {
      const y = startingY + index * lineHeight;
      para.draw(20, y);
    });

    buttons.forEach(button => button.draw(ctx));
  }

  animationManager.startAnimation(animate);

  buttons.forEach(button => button.addEventListeners(canvas));

  return () => {
    animationManager.stopAnimation();
    buttons.forEach(button => button.cleanup());
  };
}
