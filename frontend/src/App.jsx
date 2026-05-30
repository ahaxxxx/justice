import { useState } from "react";
import PaymentModal from "./components/PaymentModal.jsx";
import VerdictForm from "./components/VerdictForm.jsx";
import VerdictResult from "./components/VerdictResult.jsx";
import { createVerdict } from "./lib/api.js";
import { hasMockPayment, saveMockPayment } from "./lib/storage.js";

const initialForm = {
  sideA: "",
  sideB: "",
  background: "",
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [verdict, setVerdict] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!form.sideA.trim() || !form.sideB.trim()) {
      return "请先填写 A 方和 B 方观点，猫猫法官需要听完双方发言。";
    }

    return "";
  }

  async function submitVerdict() {
    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError("");
    setIsLoading(true);
    setVerdict(null);

    try {
      const result = await createVerdict({
        sideA: form.sideA.trim(),
        sideB: form.sideB.trim(),
        background: form.background.trim(),
      });

      setVerdict(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (requestError) {
      setError(requestError.message || "猫猫法官打了个喷嚏，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  }

  function handleStart() {
    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (!hasMockPayment()) {
      setError("");
      setIsPaymentOpen(true);
      return;
    }

    submitVerdict();
  }

  function handlePaymentConfirm() {
    saveMockPayment();
    setIsPaymentOpen(false);
    submitVerdict();
  }

  function handleReset() {
    setVerdict(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-badge">Justice Cat MVP</div>
        <h1>AI 吵架仲裁官 ⚖️🐱</h1>
        <p>
          输入双方争论内容，
          <br />
          让 AI 猫猫法官进行仲裁。
        </p>
      </section>

      <section className="workspace-grid">
        <VerdictForm
          form={form}
          isLoading={isLoading}
          onChange={updateField}
          onSubmit={handleStart}
        />

        <aside className="side-card" aria-label="产品说明">
          <span className="side-card__eyebrow">温柔提醒</span>
          <h2>猫猫法庭不是审判你们的人生。</h2>
          <p>
            它会帮你们拆开误会、分配责任，并给一个能执行的小任务。
            结果会尽量好笑，但不会刻薄。
          </p>
        </aside>
      </section>

      {error ? <div className="notice notice--error">{error}</div> : null}

      {isLoading ? (
        <div className="loading-card" role="status" aria-live="polite">
          <div className="loading-card__spinner" />
          <p>猫猫法官正在整理胡须、翻阅案卷...</p>
        </div>
      ) : null}

      {verdict ? <VerdictResult verdict={verdict} onReset={handleReset} /> : null}

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handlePaymentConfirm}
      />
    </main>
  );
}

