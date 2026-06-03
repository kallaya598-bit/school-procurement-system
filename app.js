const form = document.getElementById("procurementForm");
const tbody = document.querySelector("#itemsTable tbody");
const totalText = document.getElementById("totalText");
const statusEl = document.getElementById("status");
const statusDot = document.getElementById("statusDot");
const fileResult = document.getElementById("fileResult");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");
const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

let lastDocxFile = null;

function fillDate() {
  const now = new Date();
  form.day.value = now.getDate();
  form.year.value = now.getFullYear() + 543;
  months.forEach(month => {
    const option = document.createElement("option");
    option.textContent = month;
    option.value = month;
    form.month.appendChild(option);
  });
  form.month.value = months[now.getMonth()];
}

function addItem(item = {}) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="item-name" value="${escapeHtml(item.name || "")}" placeholder="ชื่อรายการ"></td>
    <td><input class="item-qty" type="number" min="0" step="0.01" value="${item.quantity || ""}" style="width:80px;text-align:right"></td>
    <td><input class="item-price" type="number" min="0" step="0.01" value="${item.unitPrice || ""}" style="width:100px;text-align:right"></td>
    <td class="td-amount" data-amount="0">0.00</td>
    <td><input class="item-note" value="${escapeHtml(item.note || "")}" style="width:90px"></td>
    <td><button type="button" class="btn-del" title="ลบ">×</button></td>
  `;
  tr.querySelector(".btn-del").addEventListener("click", () => { tr.remove(); calculateTotal(); });
  tr.querySelectorAll("input").forEach(input => input.addEventListener("input", calculateTotal));
  tbody.appendChild(tr);
  calculateTotal();
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}

function getItems() {
  return [...tbody.querySelectorAll("tr")].map(row => ({
    name: row.querySelector(".item-name").value.trim(),
    quantity: row.querySelector(".item-qty").value,
    unitPrice: row.querySelector(".item-price").value,
    note: row.querySelector(".item-note").value.trim(),
  })).filter(item => item.name || item.quantity || item.unitPrice || item.note);
}

function getPayload() {
  const data = Object.fromEntries(new FormData(form).entries());
  data.items = getItems();
  return data;
}

function loadPayload(data) {
  Object.entries(data || {}).forEach(([key, value]) => {
    if (key !== "items" && form.elements[key]) form.elements[key].value = value;
  });
  tbody.innerHTML = "";
  (data.items || [{}]).forEach(addItem);
  calculateTotal();
}

function calculateTotal() {
  let total = 0;
  tbody.querySelectorAll("tr").forEach(row => {
    const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
    const price = parseFloat(row.querySelector(".item-price").value) || 0;
    const amount = qty * price;
    total += amount;
    const td = row.querySelector(".td-amount");
    if (td) td.textContent = amount.toLocaleString("th-TH", {minimumFractionDigits:2, maximumFractionDigits:2});
  });
  totalText.textContent = total.toLocaleString("th-TH", {minimumFractionDigits:2, maximumFractionDigits:2});
}

function setStatus(msg, type="normal") {
  statusEl.textContent = msg;
  statusDot.style.background = type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#f4c430";
}

function showLoading(msg="กำลังสร้างไฟล์...") {
  loadingText.textContent = msg;
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

function showFileResult(filename, fileUrl, pdfUrl=null) {
  lastDocxFile = fileUrl;
  let pdfBtn = "";
  if (pdfUrl) {
    pdfBtn = `<a class="btn-download btn-dl-pdf" href="${pdfUrl}" download>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      ดาวน์โหลด PDF
    </a>`;
  }
  fileResult.innerHTML = `
    <div class="file-card">
      <div class="file-card-name">📄 ${filename}</div>
      <div class="file-dl-btns">
        <a class="btn-download btn-dl-word" href="${fileUrl}" download>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ดาวน์โหลด Word
        </a>
        ${pdfBtn}
      </div>
    </div>
  `;
}

async function generateFile(type = "word") {
  if (!form.reportValidity()) return;
  const items = getItems();
  if (!items.length || !items.some(i => i.name)) {
    setStatus("กรุณาเพิ่มรายการพัสดุอย่างน้อย 1 รายการ", "error");
    return;
  }

  const endpoint = type === "pdf" ? "/generate-pdf" : "/generate";
  const loadMsg = type === "pdf" ? "กำลังสร้างไฟล์ PDF..." : "กำลังสร้างไฟล์ Word...";
  showLoading(loadMsg);
  setStatus(loadMsg);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getPayload()),
    });

    if (!response.ok) throw new Error("Server error");

    const result = await response.json();

    if (type === "pdf") {
      showFileResult(result.filename, result.docxFile || "#", result.file);
      setStatus(`สร้างไฟล์ PDF แล้ว: ${result.filename}`, "success");
    } else {
      showFileResult(result.filename, result.file);
      setStatus(`สร้างไฟล์ Word แล้ว: ${result.filename}`, "success");
    }

    localStorage.setItem("procurementDraft", JSON.stringify(getPayload()));
  } catch (e) {
    setStatus("สร้างไฟล์ไม่สำเร็จ กรุณาลองใหม่", "error");
    fileResult.innerHTML = `<div class="file-empty" style="color:#dc2626">เกิดข้อผิดพลาด กรุณาลองใหม่</div>`;
  } finally {
    hideLoading();
  }
}

document.getElementById("addItemBtn").addEventListener("click", () => addItem());
document.getElementById("generateBtn").addEventListener("click", () => generateFile("word"));
document.getElementById("generatePdfBtn").addEventListener("click", () => generateFile("pdf"));
document.getElementById("saveDraftBtn").addEventListener("click", () => {
  localStorage.setItem("procurementDraft", JSON.stringify(getPayload()));
  setStatus("บันทึกข้อมูลไว้ในเครื่องแล้ว ✓", "success");
});
document.getElementById("loadDraftBtn").addEventListener("click", () => {
  const draft = localStorage.getItem("procurementDraft");
  if (draft) { loadPayload(JSON.parse(draft)); setStatus("เรียกข้อมูลล่าสุดแล้ว ✓", "success"); }
  else setStatus("ยังไม่มีข้อมูลที่บันทึกไว้", "error");
});
document.getElementById("clearBtn").addEventListener("click", () => {
  if (!confirm("ล้างข้อมูลทั้งหมดหรือไม่?")) return;
  form.reset();
  tbody.innerHTML = "";
  fillDate();
  addItem();
  fileResult.innerHTML = `<div class="file-empty">ยังไม่มีไฟล์ที่สร้าง</div>`;
  setStatus("ล้างฟอร์มแล้ว");
});

fillDate();
addItem();

