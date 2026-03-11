function perceptualFeedbackLoop() {
      if (targetField.length === 0) {
        Kernel.readability = 0;
        Kernel.coverage = 0;
        Kernel.stability = 0;
        return;
      }

      Kernel.state = 'FEEDBACK';

      const sample = Math.min(photons.length, 2000);
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      let cx = 0, cy = 0, speedSum = 0;

      for (let i = 0; i < sample; i++) {
        const p = photons[i];
        cx += p.pos.x;
        cy += p.pos.y;
        speedSum += Math.hypot(p.vel.x, p.vel.y);
        if (p.pos.x < minX) minX = p.pos.x;
        if (p.pos.x > maxX) maxX = p.pos.x;
        if (p.pos.y < minY) minY = p.pos.y;
        if (p.pos.y > maxY) maxY = p.pos.y;
      }

      cx /= sample;
      cy /= sample;
      const bboxArea = Math.max(1, (maxX - minX) * (maxY - minY));
      const coverage = clamp(bboxArea / (W * H), 0, 1);
      const stability = 1 / (1 + speedSum / sample);
      const targetCoverage = lastLCL?.morphology.family === 'glyph' ? 0.12 : 0.18;
      const readability = clamp(1 - Math.abs(coverage - targetCoverage) / Math.max(targetCoverage, 0.05), 0, 1);

      Kernel.coverage = coverage;
      Kernel.stability = stability;
      Kernel.readability = readability;

      const targetCoh = Kernel.coherenceTarget;
      if (readability < 0.45) {
        Kernel.coherence = clamp(Kernel.coherence + 0.02, 0.05, targetCoh + 0.12);
        Kernel.noiseMax = clamp(Kernel.noiseMax - 0.08, 0.35, 6.5);
      } else if (stability > 0.82 && Kernel.coherence > targetCoh) {
        Kernel.coherence = lerp(Kernel.coherence, targetCoh, 0.08);
      } else {
        Kernel.coherence = lerp(Kernel.coherence, targetCoh, 0.03);
      }

      if (Kernel.lastCentroid) {
        const drift = Math.hypot(cx - Kernel.lastCentroid.x, cy - Kernel.lastCentroid.y);
        if (drift > Math.min(W, H) * 0.05) {
          Kernel.flowMag = clamp(Kernel.flowMag * 0.96, 0.12, 1.2);
        }
      }
      Kernel.lastCentroid = { x: cx, y: cy };

      if (Kernel.state === 'FEEDBACK' && Kernel.readability > 0.68 && Kernel.stability > 0.55) {
        Kernel.state = 'RESONATE';
      } else {
        Kernel.state = 'FORMING';
      }
    }