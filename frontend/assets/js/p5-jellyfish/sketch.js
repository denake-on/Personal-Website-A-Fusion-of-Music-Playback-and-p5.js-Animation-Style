// p5.js Jellyfish background animation (converted from Processing)
// Multiple jellyfish with randomized params drifting across the screen
(function () {
  'use strict';

  // Config
  const CONFIG = {
    minJellyfish: 4,
    maxJellyfish: 7,
    // Rendering density: number of points per jellyfish each frame
    baseSamples: 4200,
    // Trail opacity for the fading background (0-255)
    trailAlpha: 28,
    // Global stroke base color (blue-ish)
    baseStroke: { r: 135, g: 206, b: 235, a: 200},
  };

  let jellyfishes = [];
  let canvas;

  class Jellyfish {
    constructor(p, options) {
      this.p = p;
      this.t = p.random(0, Math.PI * 2);
      this.center = p.createVector(
        options.cx ?? p.width / 2,
        options.cy ?? p.height / 2
      );
      // scale controls apparent size
      this.scale = options.scale ?? p.random(1.1, 1.8);
      this.samples = Math.floor((options.samples ?? CONFIG.baseSamples) * this.scale);
      this.stroke = options.stroke ?? { ...CONFIG.baseStroke };
      // randomized drift velocity (direction varies per jellyfish)
      const speed = p.random(0.55, 1.2) * this.scale;
      const dir = p5.Vector.fromAngle(p.random(0, Math.PI * 2), speed);
      this.velocity = dir;
      // small sinusoidal wobble
      this.wobbleMag = p.random(8, 22) * this.scale;
      this.wobbleFreq = p.random(0.002, 0.006);
      // individual time increment
      this.dt = p.PI / p.random(8, 14);
      // no color variance to keep pure white
      const shift = 0;
      this.stroke.r = p.constrain(this.stroke.r + shift, 0, 255);
      this.stroke.g = p.constrain(this.stroke.g + shift * 0.5, 0, 255);
      this.stroke.b = p.constrain(this.stroke.b + shift, 0, 255);
      // bounds padding for wrap
      this.boundsPad = 120;
    }

    update() {
      const p = this.p;
      this.t += this.dt;
      // drift + wobble
      const wobble = p5.Vector.fromAngle(
        Math.sin(this.t * this.wobbleFreq) * Math.PI * 2,
        this.wobbleMag * 0.02
      );
      this.center.add(this.velocity).add(wobble);
      this.wrapAround();
    }

    wrapAround() {
      const p = this.p;
      const pad = this.boundsPad;
      // 2D wrap-around on all sides for varied directions
      if (this.center.x < -pad) this.center.x = p.width + pad;
      if (this.center.x > p.width + pad) this.center.x = -pad;
      if (this.center.y < -pad) this.center.y = p.height + pad;
      if (this.center.y > p.height + pad) this.center.y = -pad;
    }

    draw() {
      const p = this.p;
      p.stroke(this.stroke.r, this.stroke.g, this.stroke.b, this.stroke.a);
      p.strokeWeight(0.8 * this.scale);
      p.noFill();

      // Render using the provided Processing parametric function,
      // adapted to p5 and centered at this.center
      for (let i = this.samples; i > 0; i--) {
        const x = i % 200;
        const y = i / 43.0;
        const k = 5 * Math.cos(x / 14.0) * Math.cos(y / 30.0);
        const e = y / 8.0 - 13;
        const d = (sq(mag(k, e)) / 59.0 + 4);
        const c = d / 2.0 + e / 99.0 - this.t / 18.0;
        const q = 60 - 3 * Math.sin(Math.atan2(k, e) * e) + k * (3 + (4 / d) * Math.sin(d * d - this.t * 2));
        const px = (q * Math.sin(c)) * this.scale + this.center.x;
        const py = ((q + d * 9) * Math.cos(c)) * this.scale + this.center.y;
        p.point(px, py);
      }
    }
  }

  function initSwarm(p) {
    jellyfishes.length = 0;
    const count = Math.floor(p.random(CONFIG.minJellyfish, CONFIG.maxJellyfish + 1));
    for (let i = 0; i < count; i++) {
      const jf = new Jellyfish(p, {
        // start at random on-screen position
        cx: p.random(0, p.width),
        cy: p.random(p.height * 0.2, p.height * 0.8),
        scale: p.random(1.1, 1.8),
        samples: CONFIG.baseSamples * p.constrain(p.width * p.height / (1280 * 720), 0.6, 1.6),
      });
      jellyfishes.push(jf);
    }
  }

  function sketch(p) {
    p.setup = function () {
      const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas = cnv;
      // as fixed background
      cnv.addClass('bg-canvas');
      p.background(0);
      p.noFill();
      p.stroke(CONFIG.baseStroke.r, CONFIG.baseStroke.g, CONFIG.baseStroke.b, CONFIG.baseStroke.a);
      p.strokeWeight(1.2);
      initSwarm(p);
    };

    p.draw = function () {
      // clear every frame (no trail)
      p.background(0);

      // update and render all jellyfish
      for (let i = 0; i < jellyfishes.length; i++) {
        jellyfishes[i].update();
        jellyfishes[i].draw();
      }
    };

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      // keep trails smooth after resize
      p.background(0);
      // reinit to distribute nicely in new viewport
      initSwarm(p);
    };
  }

  // Helpers mirroring Processing functions
  function sq(v) { return v * v; }
  function mag(x, y) { return Math.sqrt(x * x + y * y); }

  // Boot
  new p5(sketch);
})();


