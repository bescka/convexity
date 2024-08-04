import { AnimationManager } from '../cls/animation-manager.js';
import { EventManager } from '../cls/event-manager.js';
import { GameManager } from '../cls/game-manager.js';
import { PositionMarker } from '../cls/position-marker.js';
import { PauseMenu } from '../cls/pause-menu.js';
import { LevelComplete } from '../cls/level-complete.js';

const level = 2 //single number no padding

export function drawLevel(ctx, sceneManager) {
  const levelDots = [
    { x: 150, y: 100 },
    { x: 650, y: 100 },
    { x: 400, y: 225 },
    { x: 325, y: 375 },
    { x: 475, y: 375 },
    { x: 150, y: 500 },
    { x: 650, y: 500 },
  ];

  const levelWalls = [
    { x: 250, y: 130, width: 300, height: 50 },
    // { x: 200, y: 130, width: 50, height: 330 },
    { x: 250, y: 420, width: 300, height: 50 },
    // { x: 550, y: 130, width: 50, height: 330 },
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
