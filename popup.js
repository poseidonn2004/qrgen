let selectedQrBaseUrl = document.querySelector(".account-card.active")?.dataset.account;

const amountInput = document.getElementById("amount");
const qrImg = document.getElementById("qr-img");
const copyBtn = document.getElementById("copy-qr");

/* ===============================
   FORMAT SỐ TIỀN
================================ */
amountInput.addEventListener("input", () => {
    let raw = amountInput.value.replace(/\D/g, "");
    if (!raw) {
        amountInput.value = "";
        return;
    }
    amountInput.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

/* ===============================
   CHỌN TÀI KHOẢN
================================ */
document.querySelectorAll(".account-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".account-card")
            .forEach(c => c.classList.remove("active"));

        card.classList.add("active");

        // 👉 LẤY URL QR GỐC TRỰC TIẾP
        selectedQrBaseUrl = card.dataset.account;
    });
});

/* ===============================
   TẠO QR
================================ */
document.getElementById("generate").addEventListener("click", () => {
    const amount = Number(amountInput.value.replace(/\./g, ""));
    const content = document.getElementById("content").value.trim();

    if (!amount || amount <= 0) {
        alert("Vui lòng nhập số tiền hợp lệ");
        return;
    }

    if (!selectedQrBaseUrl) {
        alert("Vui lòng chọn tài khoản");
        return;
    }

    const qrUrl =
        selectedQrBaseUrl +
        "?amount=" + amount +
        "&addInfo=" + encodeURIComponent(content);

    qrImg.src = qrUrl;
    qrImg.style.display = "block";
    copyBtn.disabled = false;
});

/* ===============================
   COPY QR IMAGE
================================ */
copyBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(qrImg.src);
        const blob = await response.blob();

        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
        ]);

        copyBtn.textContent = "✅ Đã copy";
        setTimeout(() => {
            copyBtn.textContent = "📋 Copy QR";
        }, 1500);

    } catch (err) {
        alert("Không copy được QR (trình duyệt chặn)");
        console.error(err);
    }
});
