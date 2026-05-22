const topButton = document.querySelector("#topButton");
const copyCodeButton = document.querySelector("#copyCodeBtn");
const profileCode = document.querySelector("#profileCode");

window.addEventListener("scroll", () => {
  if (!topButton) return;
  topButton.classList.toggle("is-visible", window.scrollY > 480);
});

topButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

copyCodeButton?.addEventListener("click", async () => {
  if (!profileCode) return;

  const text = profileCode.textContent.trim();

  if (!text || text.includes("여기에")) {
    copyCodeButton.textContent = "코드 입력 필요";
    setTimeout(() => {
      copyCodeButton.textContent = "코드 복사";
    }, 1400);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyCodeButton.textContent = "복사 완료!";
  } catch (error) {
    copyCodeButton.textContent = "직접 복사";
  }

  setTimeout(() => {
    copyCodeButton.textContent = "코드 복사";
  }, 1400);
});
