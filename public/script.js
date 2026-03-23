
const API = "http://localhost:5000/api/leads";

const leadForm = document.getElementById("leadForm");
const leadTable = document.getElementById("leadTable");
const searchInput = document.getElementById("search");

const totalLeadsEl = document.getElementById("totalLeads");
const newLeadsEl = document.getElementById("newLeads");
const contactedLeadsEl = document.getElementById("contactedLeads");
const convertedLeadsEl = document.getElementById("convertedLeads");

let leads = [];
let currentLeadId = null;

const statusModal = document.getElementById("statusModal");
const modalStatus = document.getElementById("modalStatus");
const saveStatusBtn = document.getElementById("saveStatusBtn");

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";
}

window.onload = () => { showTab("dashboard"); loadLeads(); };

async function loadLeads() {
  const res = await fetch(API);
  leads = await res.json();
  displayLeads(leads);
  updateDashboard(leads);
}

function displayLeads(list) {
  leadTable.innerHTML = "";
  list.forEach(lead => {
    const statusColor = lead.status === "New" ? "blue" :
                        lead.status === "Contacted" ? "orange" : "green";
    const tr = document.createElement("tr");
    tr.classList.add("fade-in");
    tr.innerHTML = `
      <td>${lead.name}</td>
      <td>${lead.email}</td>
      <td>${lead.phone}</td>
      <td style="color:${statusColor}; font-weight:bold">${lead.status}</td>
      <td>${lead.notes}</td>
      <td>
        <button onclick="updateStatus('${lead._id}')">Update</button>
        <button onclick="deleteLeadAnimated('${lead._id}', this)">Delete</button>
      </td>
    `;
    leadTable.appendChild(tr);
  });
}

function updateDashboard(list) {
  totalLeadsEl.textContent = list.length;
  newLeadsEl.textContent = list.filter(l => l.status === "New").length;
  contactedLeadsEl.textContent = list.filter(l => l.status === "Contacted").length;
  convertedLeadsEl.textContent = list.filter(l => l.status === "Converted").length;
}

leadForm.addEventListener("submit", async e => {
  e.preventDefault();
  const leadData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value
  };
  await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(leadData) });
  leadForm.reset();
  loadLeads();
  showTab("leadsList");
});

async function deleteLeadAnimated(id, btn) {
  const tr = btn.closest("tr");
  tr.classList.add("slide-out");
  setTimeout(async () => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadLeads();
  }, 500);
}

function updateStatus(id) {
  const lead = leads.find(l => l._id === id);
  currentLeadId = id;
  modalStatus.value = lead.status;
  statusModal.style.display = "block";
}

saveStatusBtn.addEventListener("click", async () => {
  const newStatus = modalStatus.value;
  await fetch(`${API}/${currentLeadId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });
  statusModal.style.display = "none";
  loadLeads();
});

function closeModal() { statusModal.style.display = "none"; }
window.onclick = function(event) { if (event.target == statusModal) closeModal(); }

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(query) ||
    l.email.toLowerCase().includes(query) ||
    l.status.toLowerCase().includes(query)
  );
  displayLeads(filtered);
});