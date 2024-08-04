export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.currentScreen = null;
    this.isRunning = false;
  }

  async switchTo(modulePath, screenFunctionName) {
    if (this.currentScreen && this.currentScreen.cleanup) {
      console.log("scene-manager: running cleanup!")
      this.currentScreen.cleanup();
    }

    try {
      const module = await import(modulePath);
      if (typeof module[screenFunctionName] === 'function') {
        this.currentScreen = module[screenFunctionName](this.context, this);
        this.isRunning = true;
        this.animate();
      } else {
        console.error(`Function "${screenFunctionName}" not found in module.`);
      }
    } catch (error) {
      console.error(`Failed to load module: ${modulePath}`, error);
    }
  }

  animate() {
    if (!this.isRunning) return;

    if (this.currentScreen && this.currentScreen.animate) {
      this.currentScreen.animate();
    }

    requestAnimationFrame(() => this.animate());
  }

  stop() {
    this.isRunning = false;
    if (this.currentScreen && this.currentScreen.cleanup) {
      this.currentScreen.cleanup();
    }
  }
}
