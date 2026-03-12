---
layout: page
title: "WebGL & Canvas Advanced Challenges"
difficulty: Hard
category: "Coding Problems"
tags: [webgl, canvas, graphics, performance, 3d-rendering, particle-systems]
---

# WebGL & Canvas Advanced Challenges

## Overview
Advanced visual programming challenges using Canvas 2D and WebGL, commonly asked at companies like Google, Meta, and Apple for frontend positions requiring graphics knowledge.

---

## Challenge 1: Interactive Particle System

### Problem Statement
Create a particle system that responds to mouse interaction with realistic physics simulation.

### Requirements
- 500+ particles with different behaviors
- Mouse attraction/repulsion forces
- Collision detection between particles
- Performance optimization (60 FPS)
- Configurable particle properties

### Solution

{% raw %}
```typescript
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  mass: number;
  life: number;
  maxLife: number;
}

class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: 0, y: 0, isDown: false };
  private animationFrame: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupEventListeners();
    this.initParticles();
    this.animate();
  }

  private initParticles(): void {
    for (let i = 0; i < 500; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        mass: Math.random() * 5 + 1,
        life: 1,
        maxLife: Math.random() * 300 + 200
      });
    }
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mousedown', () => {
      this.mouse.isDown = true;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });
  }

  private updateParticles(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = this.mouse.isDown ? 0.5 : -0.3;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        particle.vx += normalizedDx * force / particle.mass;
        particle.vy += normalizedDy * force / particle.mass;
      }

      // Physics update
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Boundary collision
      if (particle.x < particle.radius || particle.x > this.canvas.width - particle.radius) {
        particle.vx *= -0.8;
        particle.x = Math.max(particle.radius, Math.min(this.canvas.width - particle.radius, particle.x));
      }
      
      if (particle.y < particle.radius || particle.y > this.canvas.height - particle.radius) {
        particle.vy *= -0.8;
        particle.y = Math.max(particle.radius, Math.min(this.canvas.height - particle.radius, particle.y));
      }

      // Friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Life cycle
      particle.life--;
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        this.spawnParticle();
      }
    }
  }

  private spawnParticle(): void {
    this.particles.push({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      mass: Math.random() * 5 + 1,
      life: 1,
      maxLife: Math.random() * 300 + 200
    });
  }

  private render(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const particle of this.particles) {
      const alpha = particle.life / particle.maxLife;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.globalAlpha = 1;
  }

  private animate = (): void => {
    this.updateParticles();
    this.render();
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  public destroy(): void {
    cancelAnimationFrame(this.animationFrame);
  }
}

// Usage
const canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleSystem = new ParticleSystem(canvas);
```
{% endraw %}

---

## Challenge 2: Real-time Data Visualization

### Problem Statement
Create a real-time chart that can handle 10,000+ data points with smooth animations and interactive features.

### Requirements
- Line chart with multiple series
- Real-time data streaming
- Zoom and pan functionality
- Crosshair with data labels
- Performance optimization

### Solution

```typescript
interface DataPoint {
  timestamp: number;
  value: number;
  series: string;
}

interface ChartSeries {
  name: string;
  color: string;
  data: DataPoint[];
}

class RealTimeChart {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private series: ChartSeries[] = [];
  private viewport = { x: 0, y: 0, width: 0, height: 0, scale: 1 };
  private mouse = { x: 0, y: 0, isDown: false, startX: 0, startY: 0 };
  private crosshair = { x: 0, y: 0, visible: false };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.viewport.width = canvas.width;
    this.viewport.height = canvas.height;
    this.setupEventListeners();
    this.animate();
  }

  public addSeries(name: string, color: string): void {
    this.series.push({ name, color, data: [] });
  }

  public addDataPoint(seriesName: string, value: number): void {
    const series = this.series.find(s => s.name === seriesName);
    if (series) {
      const timestamp = Date.now();
      series.data.push({ timestamp, value, series: seriesName });
      
      // Keep only last 10000 points for performance
      if (series.data.length > 10000) {
        series.data.shift();
      }
      
      this.updateViewport();
    }
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      
      if (this.mouse.isDown) {
        const deltaX = this.mouse.x - this.mouse.startX;
        const deltaY = this.mouse.y - this.mouse.startY;
        this.viewport.x -= deltaX / this.viewport.scale;
        this.viewport.y -= deltaY / this.viewport.scale;
        this.mouse.startX = this.mouse.x;
        this.mouse.startY = this.mouse.y;
      } else {
        this.updateCrosshair();
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      this.mouse.startX = this.mouse.x;
      this.mouse.startY = this.mouse.y;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      this.viewport.scale *= zoomFactor;
      this.viewport.scale = Math.max(0.1, Math.min(10, this.viewport.scale));
    });

    this.canvas.addEventListener('mouseenter', () => {
      this.crosshair.visible = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.crosshair.visible = false;
    });
  }

  private updateViewport(): void {
    if (this.series.length === 0) return;
    
    let minTime = Infinity, maxTime = -Infinity;
    let minValue = Infinity, maxValue = -Infinity;
    
    for (const series of this.series) {
      for (const point of series.data) {
        minTime = Math.min(minTime, point.timestamp);
        maxTime = Math.max(maxTime, point.timestamp);
        minValue = Math.min(minValue, point.value);
        maxValue = Math.max(maxValue, point.value);
      }
    }
    
    // Auto-follow latest data
    const timeRange = maxTime - minTime;
    this.viewport.x = maxTime - timeRange * 0.8;
    this.viewport.width = timeRange;
    this.viewport.y = minValue;
    this.viewport.height = maxValue - minValue;
  }

  private worldToScreen(x: number, y: number): { x: number, y: number } {
    return {
      x: ((x - this.viewport.x) / this.viewport.width) * this.canvas.width * this.viewport.scale,
      y: this.canvas.height - ((y - this.viewport.y) / this.viewport.height) * this.canvas.height * this.viewport.scale
    };
  }

  private screenToWorld(x: number, y: number): { x: number, y: number } {
    return {
      x: this.viewport.x + (x / (this.canvas.width * this.viewport.scale)) * this.viewport.width,
      y: this.viewport.y + ((this.canvas.height - y) / (this.canvas.height * this.viewport.scale)) * this.viewport.height
    };
  }

  private updateCrosshair(): void {
    this.crosshair.x = this.mouse.x;
    this.crosshair.y = this.mouse.y;
  }

  private render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.drawGrid();

    // Draw series
    for (const series of this.series) {
      this.drawSeries(series);
    }

    // Draw crosshair and labels
    if (this.crosshair.visible) {
      this.drawCrosshair();
    }
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    
    const gridSpacing = 50;
    
    // Vertical lines
    for (let x = 0; x < this.canvas.width; x += gridSpacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < this.canvas.height; y += gridSpacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private drawSeries(series: ChartSeries): void {
    if (series.data.length < 2) return;

    this.ctx.strokeStyle = series.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    let isFirst = true;
    for (const point of series.data) {
      const screen = this.worldToScreen(point.timestamp, point.value);
      
      if (isFirst) {
        this.ctx.moveTo(screen.x, screen.y);
        isFirst = false;
      } else {
        this.ctx.lineTo(screen.x, screen.y);
      }
    }
    
    this.ctx.stroke();
  }

  private drawCrosshair(): void {
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    
    // Vertical line
    this.ctx.beginPath();
    this.ctx.moveTo(this.crosshair.x, 0);
    this.ctx.lineTo(this.crosshair.x, this.canvas.height);
    this.ctx.stroke();
    
    // Horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.crosshair.y);
    this.ctx.lineTo(this.canvas.width, this.crosshair.y);
    this.ctx.stroke();
    
    this.ctx.setLineDash([]);
    
    // Draw data labels
    const worldPos = this.screenToWorld(this.crosshair.x, this.crosshair.y);
    this.drawDataLabels(worldPos.x, worldPos.y);
  }

  private drawDataLabels(timestamp: number, value: number): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(this.crosshair.x + 10, this.crosshair.y - 40, 200, 60);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '12px Arial';
    this.ctx.fillText(`Time: ${new Date(timestamp).toLocaleTimeString()}`, this.crosshair.x + 15, this.crosshair.y - 20);
    this.ctx.fillText(`Value: ${value.toFixed(2)}`, this.crosshair.x + 15, this.crosshair.y - 5);
  }

  private animate = (): void => {
    this.render();
    requestAnimationFrame(this.animate);
  };
}

// Usage
const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
canvas.width = 800;
canvas.height = 400;

const chart = new RealTimeChart(canvas);
chart.addSeries('CPU Usage', '#ff6b6b');
chart.addSeries('Memory Usage', '#4ecdc4');

// Simulate real-time data
setInterval(() => {
  chart.addDataPoint('CPU Usage', Math.random() * 100);
  chart.addDataPoint('Memory Usage', Math.random() * 100);
}, 100);
```

---

## Challenge 3: 3D Model Viewer with WebGL

### Problem Statement
Create a 3D model viewer that can load and display OBJ files with lighting, materials, and camera controls.

### Requirements
- Load and parse OBJ files
- Perspective camera with orbit controls
- Phong lighting model
- Texture mapping support
- Smooth performance (60 FPS)

### Solution

```typescript
interface Vertex {
  position: [number, number, number];
  normal: [number, number, number];
  texCoord: [number, number];
}

interface Mesh {
  vertices: Vertex[];
  indices: number[];
  texture?: WebGLTexture;
}

class Model3DViewer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private shaderProgram: WebGLProgram;
  private mesh: Mesh | null = null;
  private camera = {
    position: [0, 0, 5],
    target: [0, 0, 0],
    up: [0, 1, 0],
    fov: 45,
    aspect: 1,
    near: 0.1,
    far: 100
  };
  private mouse = { x: 0, y: 0, isDown: false, lastX: 0, lastY: 0 };
  private rotation = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl')!;
    
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }

    this.camera.aspect = canvas.width / canvas.height;
    this.initShaders();
    this.setupEventListeners();
    this.render();
  }

  private initShaders(): void {
    const vertexShaderSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec2 aTexCoord;
      
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      uniform mat4 uNormalMatrix;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vTexCoord;
      
      void main() {
        vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);
        vPosition = worldPosition.xyz;
        vNormal = (uNormalMatrix * vec4(aNormal, 0.0)).xyz;
        vTexCoord = aTexCoord;
        
        gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec3 uLightPosition;
      uniform vec3 uLightColor;
      uniform vec3 uViewPosition;
      uniform sampler2D uTexture;
      uniform bool uHasTexture;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vTexCoord;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uLightPosition - vPosition);
        vec3 viewDir = normalize(uViewPosition - vPosition);
        vec3 reflectDir = reflect(-lightDir, normal);
        
        // Ambient
        vec3 ambient = 0.1 * uLightColor;
        
        // Diffuse
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = diff * uLightColor;
        
        // Specular
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
        vec3 specular = spec * uLightColor;
        
        vec3 color;
        if (uHasTexture) {
          color = texture2D(uTexture, vTexCoord).rgb;
        } else {
          color = vec3(0.7, 0.7, 0.7);
        }
        
        vec3 result = (ambient + diffuse + specular) * color;
        gl_FragColor = vec4(result, 1.0);
      }
    `;

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    this.shaderProgram = this.gl.createProgram()!;
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    this.gl.linkProgram(this.shaderProgram);
    
    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error('Shader program failed to link');
    }
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(`Shader compilation error: ${this.gl.getShaderInfoLog(shader)}`);
    }
    
    return shader;
  }

  public async loadOBJ(url: string): Promise<void> {
    const response = await fetch(url);
    const text = await response.text();
    this.mesh = this.parseOBJ(text);
    this.createBuffers();
  }

  private parseOBJ(text: string): Mesh {
    const lines = text.split('\n');
    const positions: [number, number, number][] = [];
    const normals: [number, number, number][] = [];
    const texCoords: [number, number][] = [];
    const vertices: Vertex[] = [];
    const indices: number[] = [];
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      
      switch (parts[0]) {
        case 'v':
          positions.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
          break;
        case 'vn':
          normals.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
          break;
        case 'vt':
          texCoords.push([parseFloat(parts[1]), parseFloat(parts[2])]);
          break;
        case 'f':
          this.parseFace(parts.slice(1), positions, normals, texCoords, vertices, indices);
          break;
      }
    }
    
    return { vertices, indices };
  }

  private parseFace(
    faceData: string[],
    positions: [number, number, number][],
    normals: [number, number, number][],
    texCoords: [number, number][],
    vertices: Vertex[],
    indices: number[]
  ): void {
    const faceVertices: number[] = [];
    
    for (const vertexData of faceData) {
      const [posIndex, texIndex, normalIndex] = vertexData.split('/').map(x => parseInt(x) - 1);
      
      const vertex: Vertex = {
        position: positions[posIndex] || [0, 0, 0],
        normal: normals[normalIndex] || [0, 1, 0],
        texCoord: texCoords[texIndex] || [0, 0]
      };
      
      vertices.push(vertex);
      faceVertices.push(vertices.length - 1);
    }
    
    // Triangulate face (assuming convex)
    for (let i = 1; i < faceVertices.length - 1; i++) {
      indices.push(faceVertices[0], faceVertices[i], faceVertices[i + 1]);
    }
  }

  private createBuffers(): void {
    if (!this.mesh) return;

    const vertexData: number[] = [];
    for (const vertex of this.mesh.vertices) {
      vertexData.push(...vertex.position, ...vertex.normal, ...vertex.texCoord);
    }

    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexData), this.gl.STATIC_DRAW);

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), this.gl.STATIC_DRAW);
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      this.mouse.lastX = e.clientX;
      this.mouse.lastY = e.clientY;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.mouse.isDown) {
        const deltaX = e.clientX - this.mouse.lastX;
        const deltaY = e.clientY - this.mouse.lastY;
        
        this.rotation.y += deltaX * 0.01;
        this.rotation.x += deltaY * 0.01;
        
        this.mouse.lastX = e.clientX;
        this.mouse.lastY = e.clientY;
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.position[2] += e.deltaY * 0.01;
      this.camera.position[2] = Math.max(0.5, Math.min(20, this.camera.position[2]));
    });
  }

  private render = (): void => {
    if (!this.mesh) {
      requestAnimationFrame(this.render);
      return;
    }

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

    this.gl.useProgram(this.shaderProgram);

    // Set up matrices
    const modelMatrix = this.createRotationMatrix(this.rotation.x, this.rotation.y);
    const viewMatrix = this.createViewMatrix();
    const projectionMatrix = this.createProjectionMatrix();
    const normalMatrix = this.createNormalMatrix(modelMatrix);

    // Set uniforms
    this.setMatrix4Uniform('uModelMatrix', modelMatrix);
    this.setMatrix4Uniform('uViewMatrix', viewMatrix);
    this.setMatrix4Uniform('uProjectionMatrix', projectionMatrix);
    this.setMatrix4Uniform('uNormalMatrix', normalMatrix);
    this.setVector3Uniform('uLightPosition', [2, 2, 2]);
    this.setVector3Uniform('uLightColor', [1, 1, 1]);
    this.setVector3Uniform('uViewPosition', this.camera.position);

    // Set up vertex attributes
    this.setupVertexAttributes();

    // Draw
    this.gl.drawElements(this.gl.TRIANGLES, this.mesh.indices.length, this.gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(this.render);
  };

  private createRotationMatrix(x: number, y: number): Float32Array {
    const cosX = Math.cos(x), sinX = Math.sin(x);
    const cosY = Math.cos(y), sinY = Math.sin(y);
    
    return new Float32Array([
      cosY, sinX * sinY, cosX * sinY, 0,
      0, cosX, -sinX, 0,
      -sinY, sinX * cosY, cosX * cosY, 0,
      0, 0, 0, 1
    ]);
  }

  private createViewMatrix(): Float32Array {
    // Simple lookAt implementation
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, -this.camera.position[2],
      0, 0, 0, 1
    ]);
  }

  private createProjectionMatrix(): Float32Array {
    const f = 1.0 / Math.tan(this.camera.fov * Math.PI / 360);
    const rangeInv = 1 / (this.camera.near - this.camera.far);
    
    return new Float32Array([
      f / this.camera.aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (this.camera.near + this.camera.far) * rangeInv, -1,
      0, 0, this.camera.near * this.camera.far * rangeInv * 2, 0
    ]);
  }

  private createNormalMatrix(modelMatrix: Float32Array): Float32Array {
    // Simplified normal matrix (assuming uniform scaling)
    return modelMatrix;
  }

  private setMatrix4Uniform(name: string, matrix: Float32Array): void {
    const location = this.gl.getUniformLocation(this.shaderProgram, name);
    this.gl.uniformMatrix4fv(location, false, matrix);
  }

  private setVector3Uniform(name: string, vector: number[]): void {
    const location = this.gl.getUniformLocation(this.shaderProgram, name);
    this.gl.uniform3fv(location, vector);
  }

  private setupVertexAttributes(): void {
    const stride = 8 * 4; // 8 floats per vertex
    
    const positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'aPosition');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, stride, 0);
    
    const normalLocation = this.gl.getAttribLocation(this.shaderProgram, 'aNormal');
    this.gl.enableVertexAttribArray(normalLocation);
    this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, stride, 3 * 4);
    
    const texCoordLocation = this.gl.getAttribLocation(this.shaderProgram, 'aTexCoord');
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, stride, 6 * 4);
  }
}

// Usage
const canvas = document.getElementById('modelCanvas') as HTMLCanvasElement;
canvas.width = 800;
canvas.height = 600;

const viewer = new Model3DViewer(canvas);
viewer.loadOBJ('/models/teapot.obj');
```

### CSS Styling

```css
.webgl-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #1a1a1a;
  color: white;
}

.canvas-wrapper {
  position: relative;
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.controls {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.control-button {
  padding: 8px 16px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.control-button:hover {
  background: #555;
}

.info-panel {
  margin-top: 20px;
  padding: 15px;
  background: #2a2a2a;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
}
```

## Interview Follow-up Questions

1. **Performance Optimization**: How would you optimize these examples for mobile devices?
2. **Memory Management**: How do you prevent memory leaks in Canvas/WebGL applications?
3. **Error Handling**: What error handling strategies would you implement?
4. **Testing**: How would you unit test WebGL components?
5. **Accessibility**: How would you make these visualizations accessible?

## Time Complexity Analysis

- **Particle System**: O(n) for n particles per frame
- **Real-time Chart**: O(m) for m data points rendering
- **3D Model**: O(v) for v vertices per frame

These challenges test advanced graphics programming skills essential for roles at companies building complex visual interfaces.
