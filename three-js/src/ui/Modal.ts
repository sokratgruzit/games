export function Modal(message: string, type: "error" | "success" = "success") {
    let modal = document.getElementById("message-modal");
    
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "message-modal";
        modal.style.position = "fixed";
        modal.style.top = "20px";
        modal.style.right = "20px";
        modal.style.padding = "12px 18px";
        modal.style.borderRadius = "8px";
        modal.style.fontFamily = "sans-serif";
        modal.style.fontSize = "14px";
        modal.style.zIndex = "9999";
        modal.style.transition = "opacity 0.3s ease";
        document.body.appendChild(modal);
    }

    modal.textContent = message;
    modal.style.backgroundColor = type === "error" ? "#ff4d4f" : "#4caf50";
    modal.style.color = "#fff";
    modal.style.opacity = "1";

    clearTimeout((modal as any)._timeout);

    (modal as any)._timeout = setTimeout(() => {
        modal!.style.opacity = "0";
        setTimeout(() => modal!.remove(), 300);
    }, 5000);
}
