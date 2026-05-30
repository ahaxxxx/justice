import { useState } from "react";

export default function PaymentModal({ isOpen, onClose, onConfirm }) {
  const fallbackPaymentQrUrl = `${import.meta.env.BASE_URL}payment-qr.svg`;
  const configuredPaymentQrUrl =
    import.meta.env.VITE_PAYMENT_QR_URL || `${import.meta.env.BASE_URL}payment-qr.png`;
  const [paymentQrUrl, setPaymentQrUrl] = useState(configuredPaymentQrUrl);

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
        <p>请扫码完成付款。付款后点击下方按钮，猫猫法官才会开始生成判决。</p>
        <div className="payment-qr-card">
          <img
            src={paymentQrUrl}
            alt="Justice Cat 收款码"
            onError={() => setPaymentQrUrl(fallbackPaymentQrUrl)}
          />
        </div>
        <p className="payment-modal__hint">
          当前版本为人工确认付款，后续可接入微信支付或支付宝回调自动核验。
        </p>
        <button className="primary-button" type="button" onClick={onConfirm}>
          我已付款，开始仲裁
        </button>
      </section>
    </div>
  );
}
