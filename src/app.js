import { SceneManager } from './cls/scene-manager.js';

function initializeConvexity() {
  const canvas = document.getElementById('convexityCanvas');
  if (!canvas) {
    console.error("Canvas element with id 'convexityCanvas' not found.");
    return;
  }

  const sceneManager = new SceneManager(canvas);

  sceneManager.switchTo('../levels/00_convexity_welcome.js','drawWelcomeScreen');

}

document.addEventListener('DOMContentLoaded', initializeConvexity);
