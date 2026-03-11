 function compileGlyphField(lcl) {
      memCtx.clearRect(0, 0, W, H);
      const text = lcl.content?.text || 'AETHERIUM';
      const fontSize = Math.min(W / Math.max(text.length, 4) * 1.3, 160);
      memCtx.font = `800 ${fontSize}px JetBrains Mono`;
      memCtx.textAlign = 'center';
      memCtx.textBaseline = 'middle';
      memCtx.fillStyle = '#FFFFFF';
      memCtx.fillText(text, CX, CY);
      extractGlyphTargets(lcl.optics.palette[0]);
    }

    function extractGlyphTargets(hexColor) {
      const color = hexToLinear(hexColor);
      const img = memCtx.getImageData(0, 0, W, H).data;
      const step = Math.max(1, Math.floor(W / 160));
      const pts = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const idx = (y * W + x) * 4;
          if (img[idx + 3] > 120) {
            pts.push({ x, y, color });
          }
        }
      }
      targetField = pts.slice(0, lastLCL?.constraints?.max_targets || pts.length);
    }

    function compileSceneField(lcl) {
      memCtx.clearRect(0, 0, W, H);
      const grad = memCtx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#080c1a');
      grad.addColorStop(0.5, '#9d174d');
      grad.addColorStop(1, '#f59e0b');
      memCtx.fillStyle = grad;
      memCtx.fillRect(0, 0, W, H);

      memCtx.beginPath();
      memCtx.arc(CX, CY + 40, Math.min(W, H) * 0.12, 0, Math.PI * 2);
      memCtx.fillStyle = '#fef08a';
      memCtx.fill();

      memCtx.beginPath();
      memCtx.moveTo(CX - 420, H);
      memCtx.lineTo(CX - 120, CY + 70);
      memCtx.lineTo(CX + 40, CY + 140);
      memCtx.lineTo(CX + 250, CY + 90);
      memCtx.lineTo(CX + 520, H);
      memCtx.fillStyle = '#1e1b4b';
      memCtx.fill();

      extractRadianceTargets();
    }

    function getLum(img, idx) {
      return 0.2126 * img[idx] + 0.7152 * img[idx + 1] + 0.0722 * img[idx + 2];
    }

    function edgeStrength(img, x, y) {
      const i = (y * W + x) * 4;
      const ir = (y * W + Math.min(x + 1, W - 1)) * 4;
      const id = (Math.min(y + 1, H - 1) * W + x) * 4;
      const c = getLum(img, i);
      const r = getLum(img, ir);
      const d = getLum(img, id);
      return (Math.abs(c - r) + Math.abs(c - d)) / 255;
    }

    function extractRadianceTargets() {
      const img = memCtx.getImageData(0, 0, W, H).data;
      const pts = [];
      const step = Math.max(1, Math.floor(W / 170));
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const idx = (y * W + x) * 4;
          const r = img[idx], g = img[idx + 1], b = img[idx + 2];
          const lum = getLum(img, idx) / 255;
          const edge = edgeStrength(img, x, y);
          const weight = Math.min(1, lum * 0.7 + edge * 2.5);
          if (Math.random() < weight) {
            pts.push({
              x, y,
              color: [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)]
            });
          }
        }
      }
      targetField = pts.slice(0, lastLCL?.constraints?.max_targets || pts.length);
    }

    function compileShapeField(lcl) {
      const pts = [];
      const family = lcl.morphology.family;
      const density = clamp(lcl.morphology.density, 0.1, 1.0);
      const count = Math.floor((lcl.constraints.max_targets || 12000) * density);
      const scale = Math.min(W, H) * clamp(lcl.morphology.scale, 0.12, 0.55);
      const palette = (lcl.optics.palette || ['#FFFFFF']).map(hexToLinear);
      const symmetry = Math.max(1, lcl.morphology.symmetry || 1);

      for (let i = 0; i < count; i++) {
        const t = i / count;
        const a = t * Math.PI * 2 * symmetry;
        let x = CX;
        let y = CY;

        if (family === 'sphere') {
          const r = scale * Math.sqrt(Math.random());
          const ang = Math.random() * Math.PI * 2;
          x = CX + Math.cos(ang) * r;
          y = CY + Math.sin(ang) * r;
        }

        if (family === 'spiral_vortex') {
          const theta = t * Math.PI * 18;
          const r = 8 + t * scale;
          x = CX + Math.cos(theta) * r;
          y = CY + Math.sin(theta) * r * 0.55 - t * scale * 0.28;
        }

        if (family === 'flower_shell') {
          const petals = symmetry;
          const theta = t * Math.PI * 2;
          const r = scale * (0.35 + 0.35 * Math.sin(petals * theta));
          x = CX + Math.cos(theta) * r;
          y = CY + Math.sin(theta) * r;
        }

        if (family === 'wave_ribbon') {
          const u = t * 2 - 1;
          x = CX + u * scale * 1.1;
          y = CY + Math.sin(u * Math.PI * symmetry) * scale * 0.32;
        }

        if (family === 'fracture_ring') {
          const theta = t * Math.PI * 2;
          const shard = (Math.floor(theta / (Math.PI / 5)) % 2 === 0) ? 1.0 : 0.72;
          const r = scale * (0.55 + Math.random() * 0.12) * shard;
          x = CX + Math.cos(theta) * r + (Math.random() - 0.5) * 10;
          y = CY + Math.sin(theta) * r + (Math.random() - 0.5) * 10;
        }

        const c0 = palette[i % palette.length];
        const c1 = palette[(i + 1) % palette.length];
        const mix = (Math.sin(t * Math.PI * 2) + 1) * 0.5;
        const color = [
          lerp(c0[0], c1[0], mix),
          lerp(c0[1], c1[1], mix),
          lerp(c0[2], c1[2], mix)
        ];

        pts.push({ x, y, color });
      }

      targetField = pts;
    }
