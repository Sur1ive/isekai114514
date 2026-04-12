import * as bootstrap from "bootstrap";

const CONTAINER_ID = "shared-toast-container";

function getToastContainer(): HTMLElement {
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    container.style.zIndex = "11000";
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(
  header: string,
  body: string,
  options?: {
    headerClass?: string;
    delay?: number;
  },
): void {
  const container = getToastContainer();
  const headerClass = options?.headerClass ?? "";
  const delay = options?.delay ?? 5000;
  const useWhiteClose = headerClass.includes("text-white");

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header ${headerClass}">
        <strong class="me-auto">${header}</strong>
        <button type="button" class="btn-close${useWhiteClose ? " btn-close-white" : ""}" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">${body}</div>
    </div>
  `;

  const toastEl = wrapper.querySelector(".toast")!;
  container.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, { autohide: true, delay });
  toast.show();

  toastEl.addEventListener("hidden.bs.toast", () => {
    toastEl.remove();
  });
}
