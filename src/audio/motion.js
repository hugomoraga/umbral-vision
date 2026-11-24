/**
 * AudioMotion — estado físico compartido por los efectos.
 *
 * Traduce señales musicales (kick trigger, body, midFlow) en un impulso con
 * spring-damper y una fase de flujo continua. Evita que las bandas muevan la
 * geometría frame a frame (jitter).
 */

function num(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

export class AudioMotion {
  constructor() {
    this.kickPos = 0;
    this.kickVel = 0;
    this.flowPhase = 0;
  }

  /**
   * @param {number} dt
   * @param {object} audio features
   * @param {object} map audio map
   * @param {string} effectKey
   */
  update(dt, audio, map, effectKey, amount = 1) {
    const gains = map.effects?.[effectKey] || {};
    const kickGain = num(gains.kick, 1);
    const midGain = num(gains.mid, 1);
    const kick = map.kick || {};

    if (amount > 0 && audio?.kickTrigger) {
      this.kickVel += num(audio.kickStrength, 1) * num(kick.depth, 0.7) * kickGain * 6.0 * amount;
    }

    const spring = num(kick.spring, 18);
    const damping = num(kick.damping, 4.5);
    this.kickVel += (-spring * this.kickPos - damping * this.kickVel) * dt;
    this.kickPos += this.kickVel * dt;
    this.kickPos = Math.max(-1.2, Math.min(1.2, this.kickPos));

    const midFlow = num(audio?.midFlow, 0) * midGain * amount;
    this.flowPhase += dt * (0.18 + midFlow * num(map.midFlow?.waveSpeed, 0.8) * 1.6);
    return this;
  }
}
