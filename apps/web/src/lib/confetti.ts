export function triggerConfetti() {
  if (typeof window === "undefined") return;

  const count = 50;
  const defaults = {
    origin: { y: 0.7 },
  };

  const colors = ["#f59e0b", "#3b82f6", "#10b981", "#ec4899", "#8b5cf6", "#ef4444"];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.floor(Math.random() * 8) + 6;
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 300;
    const startY = window.innerHeight * 0.7;

    el.style.position = "fixed";
    el.style.zIndex = "9999";
    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size * (Math.random() > 0.5 ? 1 : 0.6)}px`;
    el.style.backgroundColor = color;
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    el.style.pointerEvents = "none";
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.style.transition = "all 1s cubic-bezier(0.25, 1, 0.5, 1)";

    document.body.appendChild(el);

    // Animate burst
    requestAnimationFrame(() => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 200 + 100;
      const destX = startX + Math.cos(angle) * velocity;
      const destY = startY + Math.sin(angle) * velocity - 100;

      el.style.transform = `translate(${destX - startX}px, ${destY - startY}px) scale(0) rotate(${Math.random() * 720}deg)`;
      el.style.opacity = "0";
    });

    setTimeout(() => {
      el.remove();
    }, 1100);
  }
}
