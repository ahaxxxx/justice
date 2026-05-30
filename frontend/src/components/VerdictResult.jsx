function clampPercent(value) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numberValue)));
}

export default function VerdictResult({ verdict, onReset }) {
  const responsibilityA = clampPercent(verdict.responsibilityA);
  const responsibilityB = clampPercent(verdict.responsibilityB);
  const relationshipScore = clampPercent(verdict.relationshipScore);

  return (
    <section className="result-card" aria-label="仲裁结果">
      <div className="result-card__header">
        <span className="hero-badge">判决已生成</span>
        <h2>猫猫法官敲槌了</h2>
      </div>

      <article className="verdict-section">
        <h3>① 核心矛盾分析</h3>
        <p>{verdict.rootCause}</p>
      </article>

      <article className="verdict-section">
        <h3>② 责任占比</h3>
        <div className="responsibility-row">
          <div className="responsibility-row__label">
            <span>A方</span>
            <strong>{responsibilityA}%</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill progress-fill--a"
              style={{ width: `${responsibilityA}%` }}
            />
          </div>
        </div>

        <div className="responsibility-row">
          <div className="responsibility-row__label">
            <span>B方</span>
            <strong>{responsibilityB}%</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill progress-fill--b"
              style={{ width: `${responsibilityB}%` }}
            />
          </div>
        </div>
      </article>

      <article className="verdict-section verdict-section--paper">
        <h3>③ 猫猫法官判决书</h3>
        <p>{verdict.verdict}</p>
      </article>

      <article className="verdict-section">
        <h3>④ 和好任务</h3>
        <p>{verdict.reconciliationTask}</p>
      </article>

      <article className="verdict-section score-section">
        <h3>⑤ 感情温度值</h3>
        <div className="score-meter" aria-label={`感情温度值 ${relationshipScore}`}>
          <div className="score-meter__number">{relationshipScore}</div>
          <div className="score-meter__track">
            <div
              className="score-meter__fill"
              style={{ width: `${relationshipScore}%` }}
            />
          </div>
          <span>0 - 100</span>
        </div>
      </article>

      <button className="secondary-button" type="button" onClick={onReset}>
        返回修改
      </button>
    </section>
  );
}

