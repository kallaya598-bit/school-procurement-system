const form = document.getElementById("procurementForm");
const tbody = document.querySelector("#itemsTable tbody");
const totalText = document.getElementById("totalText");
const statusText = document.getElementById("status");
const downloadLink = document.getElementById("downloadLink");
const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

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
    <td><input class="item-name" value="${escapeHtml(item.name || "")}" placeholder="เช่น กระดาษ A4 80 แกรม"></td>
    <td><input class="item-qty" type="number" min="0" step="0.01" value="${item.quantity || ""}"></td>
    <td><input class="item-price" type="number" min="0" step="0.01" value="${item.unitPrice || ""}"></td>
    <td><input class="item-note" value="${escapeHtml(item.note || "")}"></td>
    <td><button type="button" class="icon danger" title="ลบรายการ">×</button></td>
  `;
  tr.querySelector(".danger").addEventListener("click", () => {
    tr.remove();
    calculateTotal();
  });
  tr.querySelectorAll("input").forEach(input => input.addEventListener("input", calculateTotal));
  tbody.appendChild(tr);
  calculateTotal();
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch]));
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
  const total = getItems().reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0);
  totalText.textContent = total.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function generateDocx() {
  if (!form.reportValidity()) return;
  const items = getItems();
  if (!items.length || !items.some(item => item.name)) {
    statusText.textContent = "กรุณาเพิ่มรายการพัสดุอย่างน้อย 1 รายการ";
    return;
  }
  statusText.textContent = "กำลังสร้างไฟล์ Word...";
  downloadLink.hidden = true;
  const response = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(getPayload()),
  });
  if (!response.ok) {
    statusText.textContent = "สร้างไฟล์ไม่สำเร็จ กรุณาตรวจสอบข้อมูลแล้วลองใหม่";
    return;
  }
  const result = await response.json();
  statusText.textContent = `สร้างไฟล์แล้ว: ${result.filename}`;
  downloadLink.href = result.file;
  downloadLink.hidden = false;
  localStorage.setItem("procurementDraft", JSON.stringify(getPayload()));
}

document.getElementById("addItemBtn").addEventListener("click", () => addItem());
document.getElementById("generateBtn").addEventListener("click", generateDocx);
document.getElementById("saveDraftBtn").addEventListener("click", () => {
  localStorage.setItem("procurementDraft", JSON.stringify(getPayload()));
  statusText.textContent = "บันทึกข้อมูลไว้ในเครื่องนี้แล้ว";
});
document.getElementById("loadDraftBtn").addEventListener("click", () => {
  const draft = localStorage.getItem("procurementDraft");
  if (draft) loadPayload(JSON.parse(draft));
  statusText.textContent = draft ? "เรียกข้อมูลล่าสุดแล้ว" : "ยังไม่มีข้อมูลที่บันทึกไว้";
});
document.getElementById("clearBtn").addEventListener("click", () => {
  form.reset();
  tbody.innerHTML = "";
  fillDate();
  addItem();
  statusText.textContent = "ล้างฟอร์มแล้ว";
  downloadLink.hidden = true;
});

fillDate();
addItem();
