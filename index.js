const btn = document.getElementById("btn");

btn.addEventListener("touchstart", () => {
    btn.classList.add("pressed");
}, { passive: true });

btn.addEventListener("touchend", () => {
    btn.classList.remove("pressed");
    clicked();
});

function clicked() {
    document.getElementById("out").textContent =
    "Button funktioniert 🎉";
}

// Service Worker registrieren
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}