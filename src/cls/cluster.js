export class Cluster {
  constructor() {
    this.dots = new Set();
    this.completedShape = false;
    this.isConvex = false;
    this.shape = null;
  }

  addDot(dot) {
    this.dots.add(dot);
  }

  removeDot(dot) {
    this.dots.delete(dot);
  }

  addConnection(dot1, dot2) {
    this.addDot(dot1);
    this.addDot(dot2);
    dot1.addConnection(dot2);
    dot2.addConnection(dot1);
  }

  removeConnection(dot1, dot2) {
    dot1.removeConnection(dot2);
    dot2.removeConnection(dot1);
    if (dot1.connections.size === 0) this.removeDot(dot1);
    if (dot2.connections.size === 0) this.removeDot(dot2);

    return this.splitClusters();
  }

  splitClusters() {
    const visited = new Set();
    const clusters = [];

    const dfs = (dot, cluster) => {
      if (visited.has(dot)) return;
      visited.add(dot);
      cluster.addDot(dot);

      for (const neighbor of dot.connections) {
        dfs(neighbor, cluster);
      }
    };

    for (const dot of this.dots) {
      if (!visited.has(dot)) {
        const newCluster = new Cluster();
        dfs(dot, newCluster);
        clusters.push(newCluster);
      }
    }

    // this.dots.clear();
    // clusters.forEach(cluster => {
    //   cluster.dots.forEach(dot => this.dots.add(dot));
    // });
    //
    return clusters;
  }

  detectShapes() {
    const visited = new Set();
    this.completedShape = false;

    const dfs = (dot, startDot, path) => {
      if (visited.has(dot)) {
        if (dot === startDot && path.length >= 3) {
          return path;
        }
        return null;
      }

      visited.add(dot);
      path.push(dot);

      for (const neighbor of dot.connections) {
        const result = dfs(neighbor, startDot, path.slice());
        if (result) {
          return result;
        }
      }

      visited.delete(dot);
      return null;
    };

    for (const dot of this.dots) {
      const shape = dfs(dot, dot, []);
      if (shape) {
        this.completedShape = true;
        this.shape = shape;
        this.isConvex = this.checkConvexity();
        return shape;
      }
    }

    return null;
  }

  checkConvexity() {
    if (!this.shape || this.shape.length < 3) return false;

    const crossProduct = (p1, p2, p3) => {
      const dx1 = p2.x - p1.x;
      const dy1 = p2.y - p1.y;
      const dx2 = p3.x - p2.x;
      const dy2 = p3.y - p2.y;
      return dx1 * dy2 - dy1 * dx2;
    };

    const n = this.shape.length; // Number of vertices in the detected shape
    let sign = 0;

    for (let i = 0; i < n; i++) {
      const p1 = this.shape[i];
      const p2 = this.shape[(i + 1) % n];
      const p3 = this.shape[(i + 2) % n];

      const cross = crossProduct(p1, p2, p3);
      if (cross !== 0) {
        if (sign === 0) {
          sign = Math.sign(cross);
        } else if (sign !== Math.sign(cross)) {
          return false;
        }
      }
    }

    return true;
  }

  hasCompletedShape() {
    return this.completedShape;
  }

  isShapeConvex() {
    // console.log('this shape is:', this.shape)
    return this.isConvex;
  }
}
