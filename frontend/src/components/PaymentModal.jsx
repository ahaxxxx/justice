export default function PaymentModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="payment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
      >
        <button className="modal-close" type="button" onClick={onClose}>
          关闭
        </button>
        <div className="payment-modal__icon">🐱</div>
        <h2 id="payment-title">本次仲裁需要消耗 1 次判决机会</h2>
        <p>当前为 MVP mock 支付。点击确认后会在本机保存 payment=true。</p>
        <button className="primary-button" type="button" onClick={onConfirm}>
          我已付款
        </button>
      </section>
    </div>
  );
}

