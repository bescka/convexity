export class AnimationManager {
  constructor() {
    this.animationFrameId = null;
  }

  startAnimation(callback) {
    this.stopAnimation();
    const animate = () => {
      callback();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate); 
  }

  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
