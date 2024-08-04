import { AnimationManager } from '../cls/animation-manager.js';
import { EventManager } from '../cls/event-manager.js';
import { GameManager } from '../cls/game-manager.js';
import { PositionMarker } from '../cls/position-marker.js';
import { PauseMenu } from '../cls/pause-menu.js';
import { LevelComplete } from '../cls/level-complete.js';

const level = 7 //single number no padding

export function drawLevel(ctx, sceneManager) {
  const levelDots = [
    { x: 150, y: 100 },
    { x: 280, y: 140 },
    { x: 50, y: 290 },
    { x: 170, y: 390 },
    { x: 90, y: 500 },
    { x: 260, y: 550 },
    { x: 330, y: 300 },
    { x: 350, y: 450 }, 
    { x: 450, y: 550 }, 
    { x: 570, y: 60 },
    { x: 510, y: 220 },
    { x: 750, y: 150 },
    { x: 680, y: 500 },
  ];

  const levelWalls = [
    { x: 350, y: 0, width: 150, height: 150 },
    { x: 80, y: 250, width: 175, height: 80 },
    { x: 500, y: 350, width: 70, height: 250 },
    { x: 650, y: 250, width: 150, height: 80 },
  ];

  const eventManager = new EventManager();
  const animationManager = new AnimationManager();
  const pauseMenu = new PauseMenu(ctx, level, eventManager, sceneManager, cleanup);
  const levelCompleteScreen = new LevelComplete(ctx, level, eventManager, sceneManager, cleanup);
  const gameManager = new GameManager(
    ctx, 
    levelDots,
    levelWalls, 
    pauseMenu,
    level, 
    eventManager,
    sceneManager,
    levelCompleteScreen
  );

  const positionMarker = new PositionMarker(eventManager, sceneManager);
  
  function handleMousemove(event) {
    gameManager.handleMousemove(event);
  }

  function handleClick(event) {
    gameManager.handleClick(event);
  }

  function handleContextMenu(event) {
    gameManager.handleContextMenu(event);
  }

  function handleEscape(event) {
    gameManager.handleEscape(event);
  }

  function animate() {
    gameManager.animate();
    // if (!pauseMenu.isActive) {
    //   positionMarker.draw(ctx);
    // }
  }

  function cleanup() {
    animationManager.stopAnimation();
    eventManager.removeEventListeners();
    window.removeEventListener('keydown', handleEscape);
  };

  animationManager.startAnimation(animate);

  window.removeEventListener('keydown', handleEscape);
  eventManager.addEventListener(ctx.canvas, 'mousemove', handleMousemove);
  eventManager.addEventListener(ctx.canvas, 'click', handleClick);
  eventManager.addEventListener(ctx.canvas, 'contextmenu', handleContextMenu);
  window.addEventListener('keydown', handleEscape);

  return cleanup 
}
