import { SingleDot } from "../cls/dot.js";
import { Cluster } from "../cls/cluster.js";
import { WallRect } from "../cls/wall.js";
import { Line } from "../cls/line.js";

export class GameManager {
  constructor(ctx, dotCoords, walls, pauseMenu, level, eventManager, sceneManager, levelCompleteScreen, cleanupFunction) {
    this.ctx = ctx;
    this.dots = dotCoords.map((dot) => new SingleDot(dot.x, dot.y));
    this.lines = [];
    this.clusters = [];
    this.activeDot = null;
    this.currentLine = null;
    this.walls = walls.map((wall) => new WallRect(wall.x, wall.y, wall.width, wall.height));
    this.pauseMenu = pauseMenu;
    this.level = level;
    this.levelCompleteScreen = levelCompleteScreen;
    this.eventManager = eventManager;
    this.sceneManager = sceneManager;
    this.cleanupFunction = cleanupFunction;
  }

  findCluster(dot) {
    for (const cluster of this.clusters) {
      if (cluster.dots.has(dot)) {
        return cluster;
      }
    }
    return null;
  }

  mergeClusters(cluster1, cluster2) {
    if (cluster1 === cluster2) return;
    for (const dot of cluster2.dots) {
      cluster1.addDot(dot);
    }
    this.clusters.splice(this.clusters.indexOf(cluster2), 1);
  }

  async addLine(dot1, dot2) {
    let cluster1 = this.findCluster(dot1);
    let cluster2 = this.findCluster(dot2);

    if (!cluster1 && !cluster2) {
      const newCluster = new Cluster();
      // console.log("new cluster created!");
      newCluster.addConnection(dot1, dot2);
      this.clusters.push(newCluster);
      await this.detectShapes([newCluster]);
    } else if (cluster1 && !cluster2) {
      cluster1.addConnection(dot1, dot2);
      // console.log("added to cluster 1!");
      await this.detectShapes([cluster1]);
    } else if (!cluster1 && cluster2) {
      cluster2.addConnection(dot1, dot2);
      // console.log("added to cluster 2!");
      await this.detectShapes([cluster2]);
    } else {
      cluster1.addConnection(dot1, dot2);
      this.mergeClusters(cluster1, cluster2);
      // console.log("merged clusters!");
      await this.detectShapes([cluster1]);
    }
  }

  async removeLine(dot1, dot2) {
    const cluster = this.findCluster(dot1);
    if (cluster) {
      const newClusters = cluster.removeConnection(dot1, dot2);
      this.clusters = this.clusters.filter((c) => c !== cluster);
      this.clusters.push(...newClusters);
      await this.detectShapes(newClusters);
      // console.log(`split into ${newClusters.length} clusters`);
    }
    this.resetDotAndLineColors(cluster); 
  }

  async detectShapes(clusters) {
    for (const cluster of clusters) {
      const shape = cluster.detectShapes();
      if (cluster.hasCompletedShape()) {
        // console.log("Shape completed!", shape);
        if (cluster.isShapeConvex()) {
          console.log("The shape is convex.");
          await this.highlightShape(shape, true);
          if (this.isLevelComplete()) {
            // console.log('islevelcomplete is true')
            this.levelCompleteScreen.isActive = true
          }
        } else {
          console.log("The shape is not convex.");
          await this.highlightShape(shape, false);
        }
      }
    }
  }

  isLevelComplete() {
    const allDots = new Set(this.dots);
    const clusteredDots = new Set();

    for (const cluster of this.clusters) {
      for (const dot of cluster.dots) {
        clusteredDots.add(dot);
      }
      if (!cluster.hasCompletedShape() || !cluster.isShapeConvex()) {
        return false;
      }
    }
    return allDots.size === clusteredDots.size;
  }

  // showLevelCompleteScreen() {
  //   // this.pauseMenu.isActive = false;     
  //   this.levelCompleteScreen.isActive = true
  //   // this.levelCompleteScreen = new LevelComplete(
  //   //   this.ctx, this.level, this.eventManager, this.sceneManager, this.cleanupFunction
  //   // );
  // }

  highlightShape(shape, isConvex) {
    return new Promise((resolve) => {
      const flashColor = isConvex ? "#ccffcc" : "#ff7f7f";
      const finalColor = isConvex ? "#888" : "#ccc";
      setTimeout(() => {
      this.setShapeColor(shape, flashColor);
      }, 10); // hacky solution - implement force refresh with requestAnimationFrame or use an async operation (probably on new Line in the handleClick function)
      setTimeout(() => {
        this.setShapeColor(shape, finalColor);
        resolve();
      }, 350);
    });
  }
  // function delay(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  setShapeColor(shape, color) {
    // console.log("Setting shape color:", color);

    shape.forEach((dot) => {
      dot.color = color;
    });

    for (let i = 0; i < shape.length; i++) {
      const dot1 = shape[i];
      const dot2 = shape[(i + 1) % shape.length];
      // console.log("Checking line between:", dot1, dot2);

      this.lines.forEach(line => {
        if ((line.dot1 === dot1 && line.dot2 === dot2) || (line.dot1 === dot2 && line.dot2 === dot1)) {
          line.color = color;
          // console.log("Line color set between:", dot1, dot2);
        }
      });
    }

    this.animate();
  }

  resetDotAndLineColors(cluster = null) {
    if (cluster) {
      cluster.dots.forEach(dot => {
          dot.color = '#ccc';
      });

      this.lines.forEach(line => {
          if (cluster.dots.has(line.dot1) && cluster.dots.has(line.dot2)) {
              line.color = '#ccc';
          }
      });
    }
  }
  
  handleMousemove(event) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let isHoveringDot = false;

    this.dots.forEach((dot) => {
      dot.handleHover(event, rect, this.activeDot, this.walls);
      if (dot.isHovered) {
        isHoveringDot = true;
      }
    });

    this.lines.forEach((line) => {
      if (!this.currentLine && !isHoveringDot) {
        line.handleHover(event, rect);
      } else {
        line.isHovered = false;
      }
    });

    if (this.currentLine) {
      this.currentLine.dot2 = { x: mouseX, y: mouseY };
    }
  }

  handleClick(event) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const cursorPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    if (event.button === 0) {// Left click
      for (const dot of this.dots) {
        if (dot.handleClick(event, rect, this.activeDot, this.walls)) {
          // console.log("Dot click handleClick true!");
          if (this.activeDot) {
            // console.log("There was an active dot!");
            if (
              this.activeDot !== dot &&
              this.activeDot.canConnect() &&
              dot.canConnect()
            ) {
              // console.log("This dot can connect!");
              // console.log("the Dot you are connecting to has", dot.connections.length, " connections");
              
              if (this.currentLine) {
                this.currentLine.setLine(dot);
                this.addLine(this.activeDot, dot);
                this.lines.push(new Line(this.activeDot, dot));
                const cluster = this.findCluster(dot);
                if (cluster && cluster.hasCompletedShape()) {
                  this.currentLine = null;
                  this.activeDot = null;
                  return;
                }
                this.currentLine = new Line(dot, cursorPos);
              } else {
                this.currentLine = new Line(this.activeDot, dot);
                this.addLine(this.activeDot, dot);
              }
              this.activeDot.isSelected = false;
              this.activeDot = dot;
            }
          } else {
            this.activeDot = dot;
            this.currentLine = new Line(dot, cursorPos);
          }
          return;
        }
      }
    }
  }

  handleContextMenu(event) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const cursorPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    event.preventDefault();

    if (this.currentLine) {
      this.currentLine = null;
      if (this.activeDot) {
        this.activeDot.isSelected = false;
        this.activeDot = null;
      }
    } else {
      this.lines = this.lines.filter((line) => {
        line.handleHover(event, rect);
        if (line.isHovered) {
          this.removeLine(line.dot1, line.dot2);
        }
        return !line.isHovered;
      });
    }
  }
  
  handleEscape(event) {
    // if (this.levelComplete) {
    //   this.levelComplete = false;
    // } else {
    if (event.key === 'Escape'){
      this.pauseMenu.isActive = !this.pauseMenu.isActive;
    }
    // if (this.pauseMenu.isActive) {
    //   this.pauseMenu.addEventListeners(this.ctx.canvas);
    // } else {
    //   this.pauseMenu.removeEventListeners();
    // }
  }
  
  animate() {

    if (!this.pauseMenu.isActive) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.walls.forEach((wall) => wall.draw(this.ctx));
      this.dots.forEach((dot) => dot.draw(this.ctx));
      this.lines.forEach((line) => line.draw(this.ctx));
      if (this.currentLine) {
        this.currentLine.draw(this.ctx);
      }
    } else {
      this.pauseMenu.draw();
    }

    if (this.levelCompleteScreen.isActive) {
      this.levelCompleteScreen.draw();
    }
  }
}
