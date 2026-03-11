
export async function mockLocalLightModel(text: string): Promise<any> {
      const lower = text.toLowerCase();

      let family = 'sphere';
      let archetype = 'stabilization';
      let flow_mode = 'calm_drift';
      let palette = ['#8B5CF6', '#FFFFFF'];
      let color_mode = 'palette';
      let render_mode = 'shape_field';
      let coherence_target = 0.82;
      let turbulence = 0.22;
      let symmetry = 1;
      let density = 0.76;
      let scale = 0.35;
      let textContent = null;

      if (/เกลียว|vortex|spiral|หมุน|คิด/.test(text)) {
        family = 'spiral_vortex';
        archetype = 'reasoning';
        flow_mode = 'upward_spiral';
        palette = ['#FFD166', '#7C3AED'];
        coherence_target = 0.86;
        turbulence = 0.18;
        scale = 0.42;
      }

      if (/ทรงกลม|sphere|สมดุล|สงบ|หายใจ/.test(text)) {
        family = 'sphere';
        archetype = 'stabilization';
        flow_mode = 'orbit';
        palette = ['#00E5FF', '#FFFFFF'];
        coherence_target = 0.90;
        turbulence = 0.12;
        scale = 0.30;
      }

      if (/ดอก|flower|บาน|กลีบ/.test(text)) {
        family = 'flower_shell';
        archetype = 'bloom';
        flow_mode = 'radial';
        palette = ['#F472B6', '#FDE68A'];
        coherence_target = 0.78;
        turbulence = 0.20;
        symmetry = 6;
        scale = 0.34;
      }

      if (/คลื่น|ริบบอน|ribbon|wave/.test(text)) {
        family = 'wave_ribbon';
        archetype = 'emergence';
        flow_mode = 'ribbon';
        palette = ['#22D3EE', '#818CF8'];
        coherence_target = 0.72;
        turbulence = 0.34;
        density = 0.68;
      }

      if (/แตก|fracture|crack|ร้าว/.test(text)) {
        family = 'fracture_ring';
        archetype = 'fracture';
        flow_mode = 'fracture_out';
        palette = ['#DC2626', '#F59E0B'];
        coherence_target = 0.38;
        turbulence = 0.72;
        density = 0.72;
      }

      if (/ตัวอักษร|ข้อความ|glyph|text/.test(text)) {
        family = 'glyph';
        archetype = 'stabilization';
        flow_mode = 'calm_drift';
        palette = ['#00E5FF', '#FFFFFF'];
        render_mode = 'glyph_field';
        color_mode = 'monochrome';
        textContent = extractQuotedText(text) || 'AETHERIUM';
        coherence_target = 0.92;
        turbulence = 0.08;
      }

      if (/ฉาก|sunset|ภูเขา|ท้องฟ้า|scene|landscape/.test(text)) {
        family = 'radiance_scene';
        archetype = 'emergence';
        flow_mode = 'calm_drift';
        palette = ['#9D174D', '#F59E0B'];
        render_mode = 'radiance_proxy';
        color_mode = 'source_radiance';
        coherence_target = 0.76;
        turbulence = 0.20;
      }

      return {
        version: '3.0',
        intent: render_mode === 'glyph_field' ? 'create_glyph' : (render_mode === 'radiance_proxy' ? 'create_scene' : 'create_light_form'),
        morphology: {
          family,
          symmetry,
          density,
          scale,
          edge_softness: /คม|sharp/.test(text) ? 0.18 : 0.45
        },
        motion: {
          archetype,
          flow_mode,
          coherence_target,
          turbulence,
          rhythm_hz: /ช้า|สงบ|gentle/.test(text) ? 0.08 : 0.2,
          attack_ms: /เร็ว|ทันที|fast/.test(text) ? 250 : 700,
          settle_ms: /เร็ว|ทันที|fast/.test(text) ? 400 : 1200
        },
        optics: {
          palette,
          luminance_boost: /เรือง|สว่าง|glow/.test(text) ? 1.65 : 1.25,
          glow_alpha: /บาง|ละเอียด/.test(text) ? 0.42 : 0.62,
          trail_alpha: /ฟุ้ง|เบลอ|dream/.test(text) ? 0.14 : 0.26,
          color_mode
        },
        content: {
          text: textContent,
          scene_recipe: render_mode === 'radiance_proxy' ? { type: 'sunset_mountain' } : null
        },
        constraints: {
          max_targets: 14000,
          max_photons: 7000,
          max_energy: 1.6
        },
        source_text: text
      };
}

function extractQuotedText(text: string): string | null {
    const m = text.match(/["“”'']([^"“”'']+)["“”'']/);
    return m ? m[1] : null;
}
