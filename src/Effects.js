/**
 * Effects - Efectos visuales psicodélicos para Umbral Vision
 * KISS: Cada efecto es una función que retorna un objeto con método draw
 */

import { getInputValue, glitchNoise, distortionWave, meltEffect, fractalNoise } from './Utils.js';
import { getAudioState } from './AudioReactive.js';

/**
 * Factory de efectos visuales
 */
export const Effects = {
  /**
   * Efecto Tunnel - Túnel de elipses concéntricas
   */
  tunnel: (sketch) => {
    let angle = 0;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        const ellipseCount = getInputValue('ellipseCount', 100, parseInt);
        const ellipseSpacing = getInputValue('ellipseSpacing', 10);
        const baseAngleIncrement = getInputValue('angleIncrement', 0.05);
        const baseEllipseSizeFactor = getInputValue('ellipseSizeFactor', 1);

        let angleIncrement = baseAngleIncrement;
        let ellipseSizeFactor = baseEllipseSizeFactor;
        let strokeWeight = 1;
        
        if (audioEnabled && audioLevel > 0.01) {
          angleIncrement = baseAngleIncrement * (1 + audioLevel * 3);
          ellipseSizeFactor = baseEllipseSizeFactor * (1 + audioLevel * 2);
          strokeWeight = 1 + audioLevel * 4;
        }
        
        sketch.strokeWeight(strokeWeight);
        sketch.colorMode(sketch.HSB, 360, 100, 100);
        
        // Paleta oscura y luminosa - inspirada en Alex Gray/Dune
        const baseHue = 200; // Azul/cian oscuro
        const hueShift = audioLevel * 30;
        const saturation = 40 + audioLevel * 30; // Más sutil
        const brightness = 30 + audioLevel * 40; // Oscuro pero luminoso
        
        sketch.stroke((baseHue + hueShift) % 360, saturation, brightness);

        sketch.background(0, 8); // Más oscuro, menos trazo
        sketch.translate(sketch.width / 2, sketch.height / 2);
        
        for (let i = 0; i < ellipseCount; i++) {
          const r = i * ellipseSpacing;
          const a = angle + i * 0.1;
          let size = r * ellipseSizeFactor;
          
          if (audioEnabled && audioLevel > 0.01) {
            const waveEffect = Math.sin(a + angle * 2) * audioLevel * 30;
            size += waveEffect;
          }
          
          sketch.ellipse(r * Math.cos(a), r * Math.sin(a), size, size);
        }
        angle += angleIncrement;
      }
    };
  },

  /**
   * Efecto Spiral - Espiral psicodélico con colores cambiantes
   */
  spiral: (sketch) => {
    let t = 0;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        sketch.background(0, 5);
        sketch.translate(sketch.width / 2, sketch.height / 2);
        
        const segments = 300;
        const maxRadius = Math.min(sketch.width, sketch.height) * 0.45;
        const audioBoost = audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 1.5 : 1;
        
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 12 + t * audioBoost;
          const radius = (i / segments) * maxRadius;
          const size = 2 + Math.sin(angle * 3 + t) * 1.5;
          
          // Paleta oscura tipo Giger - tonos metálicos y orgánicos
          const hue = (220 + angle * 20 + t * 15) % 360; // Azules/verdes oscuros
          const sat = 25 + (audioLevel * 25); // Más sutil
          const bright = 20 + (audioLevel * 35); // Oscuro pero visible
          
          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(1 + audioLevel * 2);
          sketch.noFill();
          sketch.ellipse(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            size,
            size
          );
        }
        
        t += 0.02 * audioBoost;
      }
    };
  },

  /**
   * Efecto Mandala - Mandala rotativo con múltiples capas
   */
  mandala: (sketch) => {
    let rotation = 0;

    // ponytail: constantes pre-computadas (no cambian entre frames).
    // LITE reduce ~50% elementos: 6 layers × ~14 pétalos vs 12 × ~24.
    const LAYERS_FULL = 12;
    const LAYERS_LITE = 6;
    const SIDES = 6;
    const TWO_PI = Math.PI * 2;
    const TWO_PI_OVER_SIX = TWO_PI / SIDES;
    const hexCos = new Float32Array(SIDES);
    const hexSin = new Float32Array(SIDES);
    for (let j = 0; j < SIDES; j++) {
      hexCos[j] = Math.cos(TWO_PI_OVER_SIX * j);
      hexSin[j] = Math.sin(TWO_PI_OVER_SIX * j);
    }

    return {
      draw: (config) => {
        const isLite = !!(config && config.isLite);
        const LAYERS = isLite ? LAYERS_LITE : LAYERS_FULL;

        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        sketch.background(0, 8);

        // Wrap el translate al centro en push/pop (fix drift).
        sketch.push();
        sketch.translate(sketch.width / 2, sketch.height / 2);

        const audioBoost = audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 1.2 : 1;
        rotation += 0.008 * audioBoost;

        const petalCounts = new Array(LAYERS);
        for (let l = 0; l < LAYERS; l++) petalCounts[l] = 8 + l * 3;

        for (let layer = 0; layer < LAYERS; layer++) {
          const layerRotation = rotation * (1 + layer * 0.08);
          const radius = 40 + layer * 35;
          const petals = petalCounts[layer];
          const angleStep = TWO_PI / petals;

          sketch.push();
          sketch.rotate(layerRotation);

          for (let i = 0; i < petals; i++) {
            const angle = angleStep * i;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const x = radius * cos;
            const y = radius * sin;

            const size = 20 + Math.sin(layerRotation * 2 + i) * 10;
            const audioSize = audioLevel * 15;
            const radiusMean = (size + audioSize) / 2;

            const hue = (180 + layer * 15 + i * 10 + rotation * 30) % 360;
            const sat = 30 + audioLevel * 20;
            const bright = 25 + audioLevel * 30;

            sketch.fill(hue, sat, bright);
            sketch.stroke(hue, sat + 10, bright + 10);
            sketch.strokeWeight(0.5);

            sketch.push();
            sketch.translate(x, y);
            sketch.rotate(angle);

            sketch.beginShape();
            for (let j = 0; j < SIDES; j++) {
              sketch.vertex(radiusMean * hexCos[j], radiusMean * hexSin[j]);
            }
            sketch.endShape(sketch.CLOSE);
            sketch.pop();
          }

          sketch.pop();
        }

        sketch.pop();
      }
    };
  },

  /**
   * Efecto Particles - Partículas reactivas conectadas
   */
  particles: (sketch) => {
    const particles = [];
    let initialized = false;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        
        if (!initialized) {
          const particleCount = 150;
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * sketch.width,
              y: Math.random() * sketch.height,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              size: Math.random() * 5 + 2,
              hue: Math.random() * 360
            });
          }
          initialized = true;
        }
        
        sketch.background(0, 12);
        const audioBoost = audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 2 : 1;
        
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx * audioBoost;
          p.y += p.vy * audioBoost;
          
          if (p.x < 0 || p.x > sketch.width) p.vx *= -1;
          if (p.y < 0 || p.y > sketch.height) p.vy *= -1;
          
          p.x = sketch.constrain(p.x, 0, sketch.width);
          p.y = sketch.constrain(p.y, 0, sketch.height);
          
          const size = p.size * (1 + audioLevel * 1.5);
          p.hue = (p.hue + 1.5 * audioBoost) % 360;
          
          // Paleta oscura tipo Giger - orgánica y metálica
          const hue = (200 + p.hue * 0.3) % 360; // Azules/verdes oscuros
          const sat = 20 + audioLevel * 15;
          const bright = 15 + audioLevel * 25;
          
          sketch.fill(hue, sat, bright);
          sketch.noStroke();
          sketch.ellipse(p.x, p.y, size, size);
          
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            const d = sketch.dist(p.x, p.y, other.x, other.y);
            if (d < 80) {
              const alpha = sketch.map(d, 0, 80, 60, 0);
              sketch.stroke(hue, sat, bright, alpha);
              sketch.strokeWeight(0.5);
              sketch.line(p.x, p.y, other.x, other.y);
            }
          }
        }
      }
    };
  },

  /**
   * Efecto Waves - Olas de audio múltiples
   */
  waves: (sketch) => {
    let time = 0;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        sketch.background(0, 6);
        const audioBoost = audioEnabled && audioLevel > 0.01 ? audioLevel : 0.1;
        time += 0.04 * (1 + audioBoost);
        
        const waveCount = 6;
        const centerY = sketch.height / 2;
        
        for (let w = 0; w < waveCount; w++) {
          const waveHeight = 40 + w * 25;
          const frequency = 0.015 + w * 0.008;
          const speed = 0.04 + w * 0.015; // eslint-disable-line no-unused-vars
          
          sketch.beginShape();
          sketch.noFill();
          
          // Paleta tipo Dune - dorados/ocres oscuros y luminosos
          const hue = (35 + w * 8 + time * 5) % 360; // Dorados/ocres
          const sat = 25 + audioLevel * 20;
          const bright = 20 + audioLevel * 35;
          
          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(1.5 + audioLevel * 2);
          
          for (let x = 0; x < sketch.width; x += 4) {
            const y = centerY + 
              Math.sin(x * frequency + time + w) * waveHeight * (1 + audioBoost) +
              Math.cos(x * frequency * 0.7 + time * 1.3) * waveHeight * 0.4 * audioBoost;
            sketch.vertex(x, y);
          }
          
          sketch.endShape();
        }
      }
    };
  },

  /**
   * Efecto Fractal - Árbol fractal psicodélico
   */
  fractal: (sketch) => {
    let angle = 0;

    // ponytail: pre-computar constantes que no cambian entre frames.
    // BRANCHES_ANGLE_STEP es const por branches (no por iteración).
    const BRANCHES_FULL = 6;
    const BRANCHES_LITE = 4;
    const MAX_DEPTH_FULL = 4; // antes era 6 (6^6=46656 nodos = 41M ops/frame)
    const MAX_DEPTH_LITE = 3; // 4^3=64 nodos vs 6^4=1296 (modo lite 3 niveles)
    const TWO_PI = Math.PI * 2;

    return {
      draw: (config) => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        sketch.background(0, 5);

        // Wrap translate al centro en push/pop (fix drift).
        sketch.push();
        sketch.translate(sketch.width / 2, sketch.height / 2);

        const isLite = !!(config && config.isLite);
        const audioBoost = audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 1.5 : 1;
        angle += 0.008 * audioBoost;

        const branches = isLite ? BRANCHES_LITE : BRANCHES_FULL;
        const maxDepth = isLite ? MAX_DEPTH_LITE : MAX_DEPTH_FULL;
        const branchStep = TWO_PI / branches;
        const baseLength = 90;

        // Función interna — captura angle, audioLevel, maxDepth por closure.
        function drawBranch(len, depth, rot) {
          if (depth === 0) return;

          // Paleta oscura tipo Alex Gray - geométrica y luminosa
          const hue = (190 + depth * 12 + angle * 20) % 360;
          const sat = 30 + audioLevel * 15;
          const bright = 20 + audioLevel * 25;

          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(depth * 1.5 + audioLevel * 2);

          sketch.push();
          sketch.rotate(rot);
          sketch.line(0, 0, 0, -len);
          sketch.translate(0, -len);

          for (let i = 0; i < branches; i++) {
            const branchAngle = branchStep * i + angle * 0.4;
            const newLen = len * 0.72 * (1 + audioLevel * 0.25);
            drawBranch(newLen, depth - 1, branchAngle);
          }

          sketch.pop();
        }

        for (let i = 0; i < branches; i++) {
          const startAngle = branchStep * i;
          drawBranch(baseLength * (1 + audioLevel * 0.5), maxDepth, startAngle + angle);
        }

        sketch.pop();
      }
    };
  },

  /**
   * Efecto Matrix - Lluvia de caracteres estilo Matrix
   */
  matrix: (sketch) => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const drops = [];
    let initialized = false;
    const fontSize = 20;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        
        if (!initialized) {
          for (let i = 0; i < 50; i++) {
            drops.push({
              x: Math.random() * sketch.width,
              y: Math.random() * sketch.height,
              speed: Math.random() * 5 + 2,
              length: Math.floor(Math.random() * 20) + 5
            });
          }
          initialized = true;
        }
        
        sketch.background(0, 20);
        sketch.colorMode(sketch.HSB, 360, 100, 100);
        const audioBoost = audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 1.5 : 1;
        
        sketch.textSize(fontSize);
        sketch.textAlign(sketch.CENTER);
        
        for (const drop of drops) {
          drop.y += drop.speed * audioBoost;
          if (drop.y > sketch.height + drop.length * fontSize) {
            drop.y = -drop.length * fontSize;
            drop.x = Math.random() * sketch.width;
          }
          
          for (let i = 0; i < drop.length; i++) {
            const y = drop.y - i * fontSize;
            if (y > 0 && y < sketch.height) {
              const alpha = sketch.map(i, 0, drop.length, 80, 5);
              // Paleta oscura tipo Matrix pero más sutil
              const hue = 140; // Verde oscuro
              const sat = 30 + audioLevel * 20;
              const bright = 15 + audioLevel * 25;
              sketch.fill(hue, sat, bright, alpha);
              const char = chars[Math.floor(Math.random() * chars.length)];
              sketch.text(char, drop.x, y);
            }
          }
        }
      }
    };
  },

  /**
   * Efecto Glitch - Distorsión y desorden tipo LSD
   */
  glitch: (sketch) => {
    let time = 0;
    let glitchIntensity = 0;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        sketch.background(0, 5);
        time += 0.05;
        
        const audioBoost = audioEnabled && audioLevel > 0.01 ? audioLevel : 0.1; // eslint-disable-line no-unused-vars
        glitchIntensity = audioLevel * 30;
        
        // Efecto de scanlines y glitch - tipo Giger biomecánico
        for (let y = 0; y < sketch.height; y += 3) {
          const glitch = glitchNoise(time + y * 0.01, 0.03 + audioLevel * 0.08);
          const offset = glitch * glitchIntensity;
          
          // Paleta oscura tipo Giger
          const hue = (200 + glitch * 20) % 360;
          const sat = 15 + audioLevel * 15;
          const bright = 10 + audioLevel * 20;
          
          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(0.5);
          sketch.line(0 + offset, y, sketch.width + offset, y);
        }
        
        // Ondas de distorsión orgánicas
        for (let i = 0; i < 4; i++) {
          const waveTime = time + i * 0.6;
          const waveY = sketch.height / 2 + Math.sin(waveTime) * 80;
          const distortion = distortionWave(0, waveY, waveTime, 0.15, glitchIntensity * 0.8);
          
          // Tonos metálicos oscuros
          const hue = (210 + i * 15) % 360;
          const sat = 20 + audioLevel * 15;
          const bright = 15 + audioLevel * 25;
          
          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(1.5 + audioLevel * 2);
          sketch.noFill();
          
          sketch.beginShape();
          for (let x = 0; x < sketch.width; x += 4) {
            const y = waveY + distortion + Math.sin(x * 0.015 + waveTime) * 25;
            sketch.vertex(x, y);
          }
          sketch.endShape();
        }
      }
    };
  },

  /**
   * Efecto Melt - Elementos que se derriten
   */
  melt: (sketch) => {
    let time = 0;
    const particles = [];
    let initialized = false;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        
        if (!initialized) {
          for (let i = 0; i < 200; i++) {
            particles.push({
              x: Math.random() * sketch.width,
              y: Math.random() * sketch.height * 0.3,
              vx: (Math.random() - 0.5) * 2,
              vy: Math.random() * 2 + 1,
              size: Math.random() * 8 + 3,
              hue: Math.random() * 360,
              melt: 0
            });
          }
          initialized = true;
        }
        
        sketch.background(0, 20);
        time += 0.02;
        const audioBoost = audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 2 : 1;
        
        for (const p of particles) {
          // Efecto de derretimiento
          const melt = meltEffect(p.y, time, audioLevel + 0.3);
          p.x += p.vx * audioBoost + melt * 0.1;
          p.y += p.vy * audioBoost;
          
          // Resetear cuando sale de pantalla
          if (p.y > sketch.height) {
            p.y = -10;
            p.x = Math.random() * sketch.width;
            p.melt = 0;
          }
          
          // Aplicar derretimiento
          p.melt += 0.05 * audioBoost;
          const size = p.size * (1 - p.melt * 0.1) * (1 + audioLevel);
          p.hue = (p.hue + 2 * audioBoost) % 360;
          
          // Distorsión de glitch
          const glitchIntensity = audioLevel * 20;
          const glitchX = glitchNoise(time + p.x * 0.01, 0.08) * glitchIntensity;
          const glitchY = glitchNoise(time + p.y * 0.01, 0.08) * glitchIntensity * 0.5;
          
          // Paleta oscura orgánica tipo Giger
          const hue = (220 + p.hue * 0.2) % 360;
          const sat = 20 + audioLevel * 12;
          const bright = 15 + audioLevel * 20;
          
          sketch.fill(hue, sat, bright);
          sketch.stroke(hue, sat + 5, bright + 5);
          sketch.strokeWeight(0.3);
          
          // Dibujar con distorsión - forma más orgánica
          sketch.push();
          sketch.translate(p.x + glitchX, p.y + glitchY);
          sketch.rotate(p.melt * 0.4);
          // Forma más orgánica, no perfectamente circular
          const meltDistortion = Math.sin(p.melt * 2) * 0.2;
          sketch.ellipse(0, 0, size * (1 + meltDistortion), size * (1 + p.melt * 0.25));
          sketch.pop();
        }
      }
    };
  },

  /**
   * Efecto Fractal Glitch - Fractales perfectos que se desordenan
   */
  fractalGlitch: (sketch) => {
    let angle = 0;
    let glitchPhase = 0;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        sketch.background(0, 8);
        sketch.translate(sketch.width / 2, sketch.height / 2);
        
        const audioBoost = audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 1.3 : 1;
        angle += 0.008 * audioBoost;
        glitchPhase += 0.04 * (1 + audioLevel);
        
        // Reducir complejidad para mejor rendimiento y menos amontonamiento
        const branches = 5; // Reducido de 6 a 5
        const maxDepth = 4; // Reducido de 6 a 4 (mucho menos recursión)
        const baseLength = 130; // Más largo para mejor espaciado
        const glitchIntensity = audioLevel * 15; // Reducido de 30 a 15
        
        function drawBranch(len, depth, rot, x = 0, y = 0) {
          if (depth === 0 || len < 8) return; // Evitar ramas muy pequeñas
          
          // Aplicar glitch más sutil y menos frecuente
          const shouldGlitch = Math.sin(glitchPhase + depth * 0.3) > 0.8; // Más selectivo
          const glitch = shouldGlitch ? glitchNoise(glitchPhase + depth, 0.15) * glitchIntensity : 0;
          const noise = fractalNoise(x, y, glitchPhase, 0.012) * (shouldGlitch ? 0.4 : 0.1); // Reducido
          
          // Paleta oscura tipo Alex Gray
          const hue = (190 + depth * 12 + angle * 10) % 360;
          const sat = 22 + audioLevel * 10;
          const bright = 16 + audioLevel * 18;
          
          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(depth * 0.7 + audioLevel * 1.0); // Más delgado
          
          sketch.push();
          sketch.translate(x, y);
          sketch.rotate(rot + glitch * 0.03); // Menos rotación
          
          // Línea más limpia con menos distorsión
          const endX = noise * 0.03; // Mucho menos distorsión
          const endY = -len + noise * 0.05;
          sketch.line(0, 0, endX, endY);
          
          sketch.translate(endX, endY);
          
          // Mantener número fijo de ramas para evitar amontonamiento
          const angleStep = Math.PI * 2 / branches;
          
          for (let i = 0; i < branches; i++) {
            const branchAngle = angleStep * i + angle * 0.25 + glitch * 0.01; // Menos variación
            const newLen = len * 0.78; // Mejor espaciado, menos variación
            const newDepth = depth - 1;
            
            if (newDepth > 0 && newLen > 8) {
              drawBranch(newLen, newDepth, branchAngle, 0, 0);
            }
          }
          
          sketch.pop();
        }
        
        // Solo un fractal central, más limpio y rápido
        const glitch = glitchNoise(glitchPhase, 0.1) * glitchIntensity * 0.2;
        drawBranch(baseLength * (1 + audioLevel * 0.3), maxDepth, angle + glitch * 0.02);
      }
    };
  },

  /**
   * Efecto Wave Glitch - Ondas que se distorsionan y desordenan
   */
  waveGlitch: (sketch) => {
    let time = 0;
    const WAVE_COUNT_FULL = 8;
    const WAVE_COUNT_LITE = 4;
    const X_STEP_FULL = 3;
    const X_STEP_LITE = 6;
    const TWO_PI = Math.PI * 2;
    const wavePhases = []; // Fase inicial de cada onda
    const modulationPhases = []; // Fase de modulación para cada onda
    let initialized = false;

    return {
      draw: (config) => {
        const isLite = !!(config && config.isLite);
        const waveCount = isLite ? WAVE_COUNT_LITE : WAVE_COUNT_FULL;
        const xStep = isLite ? X_STEP_LITE : X_STEP_FULL;

        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        sketch.background(0, 15);
        time += 0.08;

        // Inicializar fases individuales para cada onda (lazy, primera vez).
        if (!initialized) {
          for (let w = 0; w < WAVE_COUNT_FULL; w++) {
            wavePhases[w] = Math.random() * TWO_PI;
            modulationPhases[w] = Math.random() * TWO_PI;
          }
          initialized = true;
        }

        const audioBoost = audioEnabled && audioLevel > 0.01 ? audioLevel : 0.1;
        const glitchIntensity = audioLevel * 40;
        const centerY = sketch.height / 2;

        for (let w = 0; w < waveCount; w++) {
          // Velocidad y dirección única para cada onda
          const waveSpeed = (0.15 + w * 0.05) * (w % 2 === 0 ? 1 : -1);
          const baseWaveHeight = 40 + w * 25;
          const frequency = 0.015 + w * 0.008;
          
          // Velocidad de modulación única para cada onda (crece y decrece)
          const modulationSpeed = 0.02 + w * 0.01; // Cada onda modula a diferente velocidad
          modulationPhases[w] += modulationSpeed * (1 + audioLevel * 0.3);
          
          // Modulación de amplitud - hace que la onda crezca y decrezca
          // Usa seno para crear un ciclo suave de crecimiento/decrecimiento
          const modulation = (Math.sin(modulationPhases[w]) + 1) / 2; // Entre 0 y 1
          const minHeight = baseWaveHeight * 0.3; // Altura mínima (30% del base)
          const maxHeight = baseWaveHeight * 1.5; // Altura máxima (150% del base)
          const waveHeight = minHeight + modulation * (maxHeight - minHeight);
          
          // Actualizar fase de la onda - esto hace que la onda se mueva
          wavePhases[w] += waveSpeed * (1 + audioLevel * 0.5);
          
          sketch.beginShape();
          sketch.noFill();
          
          // Paleta oscura tipo Dune - dorados/ocres oscuros
          const hue = (30 + w * 6 + time * 8) % 360;
          const sat = 20 + audioLevel * 15;
          const bright = 18 + audioLevel * 28;
          
          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(1.2 + audioLevel * 1.5);
          
          for (let x = 0; x < sketch.width; x += xStep) {
            // Onda que se mueve horizontalmente con amplitud modulada
            const phase = x * frequency + wavePhases[w] + w * 0.5;
            let y = centerY + 
              Math.sin(phase) * waveHeight * (1 + audioBoost);
            
            // Agregar movimiento vertical sutil
            y += Math.sin(time * 0.3 + w * 0.4) * 10 * audioBoost;
            
            // Aplicar glitch periódico - más sutil
            const glitchX = glitchNoise(time + x * 0.01 + w, 0.06 + audioLevel * 0.04) * glitchIntensity * 0.7;
            const glitchY = glitchNoise(time + x * 0.015 + w * 0.5, 0.08) * glitchIntensity * 0.4;
            
            // Distorsión de onda - más orgánica con movimiento
            const distortion = distortionWave(x, y, time + w, 0.12, glitchIntensity * 0.25);
            
            // Efecto de derretimiento - más sutil
            const melt = meltEffect(y, time + w * 0.25, audioLevel * 0.4) * 0.2;
            
            y += glitchY + distortion + melt;
            const finalX = x + glitchX;
            
            sketch.vertex(finalX, y);
          }
          
          sketch.endShape();
        }
      }
    };
  },

  /**
   * Efecto Sacred Geometry - Mandala geométrico tipo Alex Gray
   */
  sacredGeometry: (sketch) => {
    let rotation = 0;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        sketch.background(0, 4);
        sketch.translate(sketch.width / 2, sketch.height / 2);
        
        const audioBoost = audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 1.2 : 1;
        rotation += 0.006 * audioBoost;
        
        const layers = 10;
        const baseRadius = 60;
        
        for (let layer = 0; layer < layers; layer++) {
          const layerRot = rotation * (1 + layer * 0.05);
          const radius = baseRadius + layer * 30;
          const sides = 6 + layer * 2;
          
          sketch.push();
          sketch.rotate(layerRot);
          
          // Paleta tipo Alex Gray - geométrica y luminosa pero oscura
          const hue = (180 + layer * 8 + rotation * 10) % 360;
          const sat = 25 + audioLevel * 12;
          const bright = 18 + audioLevel * 22;
          
          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(1 + layer * 0.1 + audioLevel * 1.5);
          sketch.noFill();
          
          // Polígono geométrico
          sketch.beginShape();
          for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 / sides) * i;
            const r = radius * (1 + Math.sin(layerRot * 2 + i) * 0.1 * audioLevel);
            sketch.vertex(r * Math.cos(angle), r * Math.sin(angle));
          }
          sketch.endShape(sketch.CLOSE);
          
          sketch.pop();
        }
      }
    };
  },

  /**
   * Efecto Biomech - Formas orgánicas tipo HR Giger
   */
  biomech: (sketch) => {
    let time = 0;
    const structures = [];
    let initialized = false;
    
    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        
        if (!initialized) {
          for (let i = 0; i < 8; i++) {
            structures.push({
              x: (sketch.width / 9) * (i + 1),
              y: sketch.height / 2,
              size: 40 + Math.random() * 30,
              rotation: Math.random() * Math.PI * 2,
              segments: 8 + Math.floor(Math.random() * 6)
            });
          }
          initialized = true;
        }
        
        sketch.background(0, 6);
        time += 0.02;
        const audioBoost = audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 1.3 : 1;
        
        for (const s of structures) {
          s.rotation += 0.003 * audioBoost;
          
          sketch.push();
          sketch.translate(s.x, s.y);
          sketch.rotate(s.rotation);
          
          // Paleta tipo Giger - metálica y orgánica
          const hue = (200 + s.x * 0.1 + time * 5) % 360;
          const sat = 18 + audioLevel * 10;
          const bright = 12 + audioLevel * 18;
          
          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(1.5 + audioLevel * 2);
          sketch.noFill();
          
          // Forma orgánica biomecánica
          sketch.beginShape();
          for (let i = 0; i < s.segments; i++) {
            const angle = (Math.PI * 2 / s.segments) * i;
            const noise = fractalNoise(s.x, s.y, time + i, 0.05) * 0.3;
            const r = s.size * (1 + noise) * (1 + audioLevel * 0.3);
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            sketch.vertex(x, y);
          }
          sketch.endShape(sketch.CLOSE);
          
          // Líneas internas orgánicas
          for (let i = 0; i < 3; i++) {
            const innerSize = s.size * (0.3 + i * 0.2);
            sketch.beginShape();
            for (let j = 0; j < s.segments; j++) {
              const angle = (Math.PI * 2 / s.segments) * j + time * 0.1;
              const noise = fractalNoise(s.x, s.y, time + j, 0.08) * 0.2;
              const r = innerSize * (1 + noise);
              sketch.vertex(r * Math.cos(angle), r * Math.sin(angle));
            }
            sketch.endShape(sketch.CLOSE);
          }
          
          sketch.pop();
        }
      }
    };
  },

  /**
   * Efecto Dune - Ondas de arena y geometría desértica
   */
  dune: (sketch) => {
    let time = 0;

    // ponytail: pre-computar step horizontal y constantes fuera del loop.
    const WAVES_FULL = 4;
    const WAVES_LITE = 2;
    const GEO_SIDES = 6;
    const TWO_PI_OVER_SIX = Math.PI * 2 / GEO_SIDES;
    const geoCos = new Float32Array(GEO_SIDES);
    const geoSin = new Float32Array(GEO_SIDES);
    const innerCos = new Float32Array(GEO_SIDES);
    const innerSin = new Float32Array(GEO_SIDES);
    for (let i = 0; i < GEO_SIDES; i++) {
      geoCos[i] = Math.cos(TWO_PI_OVER_SIX * i);
      geoSin[i] = Math.sin(TWO_PI_OVER_SIX * i);
      innerCos[i] = Math.cos(TWO_PI_OVER_SIX * i + Math.PI / 6);
      innerSin[i] = Math.sin(TWO_PI_OVER_SIX * i + Math.PI / 6);
    }

    return {
      draw: (config) => {
        const isLite = !!(config && config.isLite);
        const WAVES = isLite ? WAVES_LITE : WAVES_FULL;

        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        sketch.background(0, 5);
        time += 0.03;

        const audioBoost = audioEnabled && audioLevel > 0.01 ? audioLevel : 0.1;
        const centerY = sketch.height * 0.6;
        // Step horizontal más grueso en lite mode → menos vértices.
        const xStep = isLite ? 4 : 2;

        // Ondas de arena
        for (let w = 0; w < WAVES; w++) {
          const waveHeight = 30 + w * 20;
          const frequency = 0.01 + w * 0.005;
          const speed = 0.03 + w * 0.01;

          sketch.beginShape();
          sketch.noFill();

          // Paleta tipo Dune - dorados/ocres oscuros
          const hue = (25 + w * 3 + time * 2) % 360;
          const sat = 20 + audioLevel * 15;
          const bright = 15 + audioLevel * 25;

          sketch.stroke(hue, sat, bright);
          sketch.strokeWeight(2 + audioLevel * 2);

          for (let x = 0; x < sketch.width; x += xStep) {
            const y = centerY +
              Math.sin(x * frequency + time * speed + w) * waveHeight * (1 + audioBoost) +
              Math.cos(x * frequency * 0.6 + time * 1.2) * waveHeight * 0.3 * audioBoost;
            sketch.vertex(x, y);
          }
          sketch.endShape();
        }

        // Geometría tipo Dune - formas minimalistas.
        // Wrap translate al centro en push/pop (fix drift).
        sketch.push();
        sketch.translate(sketch.width / 2, sketch.height * 0.3);
        const geoSize = 80 + audioLevel * 40;
        const geoRotation = time * 0.02;

        sketch.push();
        sketch.rotate(geoRotation);

        const geoHue = (30 + time * 3) % 360;
        const geoSat = 15 + audioLevel * 10;
        const geoBright = 20 + audioLevel * 20;

        sketch.stroke(geoHue, geoSat, geoBright);
        sketch.strokeWeight(1.5 + audioLevel * 1.5);
        sketch.noFill();

        // Forma geométrica simple tipo Dune
        for (let i = 0; i < GEO_SIDES; i++) {
          const x1 = geoSize * geoCos[i];
          const y1 = geoSize * geoSin[i];
          const x2 = geoSize * 0.6 * innerCos[i];
          const y2 = geoSize * 0.6 * innerSin[i];
          sketch.line(x1, y1, x2, y2);
        }

        sketch.pop();
        sketch.pop(); // cierra el translate(width/2, height*0.3)
      }
    };
  },

  /**
   * Efecto Yin Yang — símbolo ☯ que gira con velocidad creciente (tope suave)
   */
  yinYang: (sketch) => {
    let rotation = 0;
    let angularSpeed = 0.03;

    return {
      draw: () => {
        const { enabled: audioEnabled, level: audioLevel } = getAudioState();
        const audioBoost =
          audioEnabled && audioLevel > 0.01 ? 1 + audioLevel * 0.6 : 1;

        sketch.colorMode(sketch.RGB);
        sketch.background(150, 150, 150);
        sketch.colorMode(sketch.HSB, 360, 100, 100);
        sketch.translate(sketch.width / 2, sketch.height / 2);
        sketch.rotate(rotation);

        const d = Math.min(sketch.width, sketch.height) * 0.62;
        const r = d / 2;

        sketch.noStroke();
        // Blanco base
        sketch.fill(0, 0, 100);
        sketch.circle(0, 0, d);
        // Mitad izquierda negra
        sketch.fill(0, 0, 0);
        sketch.arc(0, 0, d, d, sketch.HALF_PI, sketch.PI + sketch.HALF_PI, sketch.PIE);
        // Cabeza blanca (arriba)
        sketch.fill(0, 0, 100);
        sketch.circle(0, -r / 2, r);
        // Cabeza negra (abajo)
        sketch.fill(0, 0, 0);
        sketch.circle(0, r / 2, r);
        // Punto negro en blanco
        sketch.fill(0, 0, 0);
        sketch.circle(0, -r / 2, r / 4);
        // Punto blanco en negro
        sketch.fill(0, 0, 100);
        sketch.circle(0, r / 2, r / 4);

        // Aceleración angular (~3× respecto a la versión base; tope también ×3)
        const accel = 0.00033 * audioBoost;
        angularSpeed += accel;
        const maxSpeed = 0.84 * audioBoost;
        if (angularSpeed > maxSpeed) angularSpeed = maxSpeed;
        rotation += angularSpeed * audioBoost;
      }
    };
  }
};

// Log para verificar que todos los efectos estén cargados
console.log('Umbral Vision - Efectos cargados:', Object.keys(Effects));
