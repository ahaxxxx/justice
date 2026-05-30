const PAYMENT_KEY = "payment";

export function hasMockPayment() {
  return window.localStorage.getItem(PAYMENT_KEY) === "true";
}

export function saveMockPayment() {
  window.localStorage.setItem(PAYMENT_KEY, "true");
}
