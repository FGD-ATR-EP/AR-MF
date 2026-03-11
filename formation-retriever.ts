const FormationBook = {
      emergence: {
        archetype: 'emergence',
        forceBias: 0.95,
        coherenceStart: 0.08,
        coherenceTarget: 0.82,
        flowBias: 0.85,
        noiseBias: 0.9,
        rhythm: 0.22,
        phrase: 'born from diffuse light'
      },
      stabilization: {
        archetype: 'stabilization',
        forceBias: 0.75,
        coherenceStart: 0.22,
        coherenceTarget: 0.90,
        flowBias: 0.3,
        noiseBias: 0.32,
        rhythm: 0.08,
        phrase: 'settle into equilibrium'
      },
      dissolution: {
        archetype: 'dissolution',
        forceBias: 0.42,
        coherenceStart: 0.45,
        coherenceTarget: 0.18,
        flowBias: 1.1,
        noiseBias: 1.0,
        rhythm: 0.3,
        phrase: 'release structure into drift'
      },
      reasoning: {
        archetype: 'reasoning',
        forceBias: 0.88,
        coherenceStart: 0.16,
        coherenceTarget: 0.86,
        flowBias: 0.75,
        noiseBias: 0.42,
        rhythm: 0.14,
        phrase: 'spiral inward then ascend'
      },
      fracture: {
        archetype: 'fracture',
        forceBias: 0.62,
        coherenceStart: 0.52,
        coherenceTarget: 0.33,
        flowBias: 0.95,
        noiseBias: 1.15,
        rhythm: 0.4,
        phrase: 'hold tension then split'
      },
      bloom: {
        archetype: 'bloom',
        forceBias: 0.80,
        coherenceStart: 0.12,
        coherenceTarget: 0.78,
        flowBias: 0.68,
        noiseBias: 0.55,
        rhythm: 0.20,
        phrase: 'expand radially with grace'
      }
};

export function FormationRetriever(lcl: any): any {
      const key = lcl.motion?.archetype || 'emergence';
      return FormationBook[key] || FormationBook.emergence;
}

export function mergeFormationWithLCL(lcl: any, formation: any): any {
      const merged = structuredClone(lcl);
      merged.retrieved_formation = formation;
      merged.motion.coherence_target = lcl.motion.coherence_target ?? formation.coherenceTarget;
      merged.motion.rhythm_hz = lcl.motion.rhythm_hz ?? formation.rhythm;
      merged.runtime_bias = {
        forceBias: formation.forceBias,
        flowBias: formation.flowBias,
        noiseBias: formation.noiseBias,
        coherenceStart: formation.coherenceStart,
        archetypePhrase: formation.phrase
      };
      return merged;
}
