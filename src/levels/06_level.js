import { AnimationManager } from '../cls/animation-manager.js';
import { EventManager } from '../cls/event-manager.js';
import { GameManager } from '../cls/game-manager.js';
import { PositionMarker } from '../cls/position-marker.js';
import { PauseMenu } from '../cls/pause-menu.js';
import { LevelComplete } from '../cls/level-complete.js';

const level = 6 //single number no padding

export function drawLevel(ctx, sceneManager) {
  const levelDots = [
    { x: 200, y: 100 },
    { x: 200, y: 500 },
    { x: 100, y: 300 },
    { x: 400, y: 100 },
    { x: 400, y: 500 },
    { x: 300, y: 300 },
    { x: 500, y: 300 },
    { x: 600, y: 100 }, 
    { x: 600, y: 500 }, 
    { x: 700, y: 300 },
  ];

  const levelWalls = [
    { x: 225, y: 175, width: 150, height: 50 },
    { x: 425, y: 175, width: 150, height: 50 },
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
