export function getAppElement(): HTMLElement {
  const el = document.getElementById("app");
  if (!el) {
    throw new Error("无法找到挂载点 #app");
  }
  return el;
}
