export default function VerdictForm({ form, isLoading, onChange, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <label className="field">
        <span>A方观点</span>
        <textarea
          value={form.sideA}
          onChange={(event) => onChange("sideA", event.target.value)}
          placeholder="例如：我只是想让对方早点回消息，不是要控制 TA。"
          rows={5}
        />
      </label>

      <label className="field">
        <span>B方观点</span>
        <textarea
          value={form.sideB}
          onChange={(event) => onChange("sideB", event.target.value)}
          placeholder="例如：我不是不在乎，只是工作时真的没办法一直看手机。"
          rows={5}
        />
      </label>

      <label className="field">
        <span>事件背景 <small>可选</small></span>
        <textarea
          value={form.background}
          onChange={(event) => onChange("background", event.target.value)}
          placeholder="例如：昨天晚上因为聚会迟到吵起来了。"
          rows={4}
        />
      </label>

      <button className="primary-button" type="submit" disabled={isLoading}>
        {isLoading ? "仲裁中..." : "开始仲裁"}
      </button>
    </form>
  );
}

