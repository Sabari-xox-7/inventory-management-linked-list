const STORAGE_KEY = "stockroom-products-v1";
const starterProducts = [
  { id: 101, name: "Notebook", quantity: 42, price: 45 },
  { id: 102, name: "Blue Pen", quantity: 4, price: 12.5 },
  { id: 103, name: "Desk Organizer", quantity: 12, price: 180 },
  { id: 104, name: "A4 Paper Pack", quantity: 0, price: 250 },
  { id: 105, name: "Highlighter Set", quantity: 8, price: 95 }
];
let products = loadProducts();
let editingId = null;
const $ = id => document.getElementById(id);
const money = amount => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterProducts.map(p => ({...p}));
  } catch { return starterProducts.map(p => ({...p})); }
}
function saveProducts() { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }
function statusFor(p) {
  if (p.quantity === 0) return ["Out of stock", "out"];
  if (p.quantity <= 5) return ["Low stock", "low"];
  return ["In stock", "good"];
}
function render() {
  const search = $("search").value.trim().toLowerCase();
  const filter = $("filter").value;
  const filtered = products.filter(p => {
    const matches = p.name.toLowerCase().includes(search) || String(p.id).includes(search);
    const level = filter === "all" || (filter === "low" && p.quantity > 0 && p.quantity <= 5) ||
      (filter === "healthy" && p.quantity > 5) || (filter === "out" && p.quantity === 0);
    return matches && level;
  });
  $("totalProducts").textContent = products.length;
  $("totalUnits").textContent = products.reduce((sum,p) => sum + p.quantity, 0).toLocaleString("en-IN");
  $("stockValue").textContent = money(products.reduce((sum,p) => sum + p.quantity * p.price, 0));
  $("lowStock").textContent = products.filter(p => p.quantity <= 5).length;
  $("productRows").innerHTML = filtered.map(p => {
    const [label, cls] = statusFor(p);
    const initials = p.name.trim().split(/\s+/).slice(0,2).map(s => s[0]).join("").toUpperCase();
    return `<tr>
      <td><div class="product-cell"><span class="product-icon">${escapeHTML(initials)}</span><div><strong>${escapeHTML(p.name)}</strong><small>Product item</small></div></div></td>
      <td class="id">#${p.id}</td><td class="price">${money(p.price)}</td><td class="qty">${p.quantity}</td>
      <td><span class="status ${cls}">${label}</span></td>
      <td><div class="actions"><button class="action" data-edit="${p.id}">Edit</button><button class="action delete" data-delete="${p.id}">Delete</button></div></td>
    </tr>`;
  }).join("");
  $("empty").classList.toggle("hidden", filtered.length > 0);
  $("resultCount").textContent = `Showing ${filtered.length} of ${products.length} products`;
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function showToast(message) {
  const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function openAdd() {
  editingId = null; $("productForm").reset(); $("modalTitle").textContent = "Add a product";
  $("pid").disabled = false; $("formError").textContent = ""; $("productDialog").showModal(); $("name").focus();
}
function openEdit(id) {
  const p = products.find(item => item.id === id); if (!p) return;
  editingId = id; $("modalTitle").textContent = "Edit product";
  $("name").value = p.name; $("pid").value = p.id; $("pid").disabled = true;
  $("quantity").value = p.quantity; $("price").value = p.price; $("formError").textContent = "";
  $("productDialog").showModal();
}
$("addTop").addEventListener("click", openAdd);
$("closeDialog").addEventListener("click", () => $("productDialog").close());
$("cancelDialog").addEventListener("click", () => $("productDialog").close());
$("search").addEventListener("input", render);
$("filter").addEventListener("change", render);
$("productRows").addEventListener("click", event => {
  const edit = event.target.closest("[data-edit]");
  const del = event.target.closest("[data-delete]");
  if (edit) openEdit(Number(edit.dataset.edit));
  if (del) {
    const id = Number(del.dataset.delete), p = products.find(item => item.id === id);
    if (p && confirm(`Delete "${p.name}" from inventory?`)) {
      products = products.filter(item => item.id !== id); saveProducts(); render(); showToast("Product deleted");
    }
  }
});
$("productForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("name").value.trim(), id = Number($("pid").value);
  const quantity = Number($("quantity").value), price = Number($("price").value);
  if (!name || !Number.isInteger(id) || id < 1 || !Number.isInteger(quantity) || quantity < 0 || !Number.isFinite(price) || price < 0) {
    $("formError").textContent = "Enter a name, positive whole-number ID, and valid non-negative quantity and price."; return;
  }
  if (editingId === null && products.some(p => p.id === id)) { $("formError").textContent = "That product ID already exists."; return; }
  if (editingId !== null) {
    const p = products.find(item => item.id === editingId);
    Object.assign(p, {name, quantity, price});
    showToast("Product updated successfully");
  } else {
    products.unshift({id, name, quantity, price});
    showToast("Product added successfully");
  }
  saveProducts(); render(); $("productDialog").close();
});
$("exportBtn").addEventListener("click", () => {
  const rows = [["ID","Product Name","Quantity","Unit Price"], ...products.map(p => [p.id, p.name, p.quantity, p.price])];
  const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = "stockroom-inventory.csv"; a.click(); URL.revokeObjectURL(url);
  showToast("CSV export ready");
});
render();
