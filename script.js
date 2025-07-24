// Select elements
const form = document.getElementById("expense-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dailyTotalEl = document.getElementById("daily-total");
const monthlyTotalEl = document.getElementById("monthly-total");
const expenseList = document.getElementById("expense-list");

// Load expenses from localStorage or set as empty array
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Save to localStorage
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Update totals
function updateTotals() {
  const today = new Date().toISOString().split("T")[0];
  const month = today.slice(0, 7);

  let dailyTotal = 0;
  let monthlyTotal = 0;

  expenses.forEach(exp => {
    if (exp.date === today) dailyTotal += exp.amount;
    if (exp.date.startsWith(month)) monthlyTotal += exp.amount;
  });

  dailyTotalEl.textContent = dailyTotal;
  monthlyTotalEl.textContent = monthlyTotal;
}

// Render all expenses
function renderExpenses() {
  expenseList.innerHTML = "";

  expenses.slice().reverse().forEach((exp, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${exp.date} - ₹${exp.amount} (${exp.category}) - ${exp.desc}
      <button class="delete-btn" onclick="deleteExpense(${expenses.length - 1 - index})">Delete</button>
    `;
    expenseList.appendChild(li);
  });
}

// Delete an expense
function deleteExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses.splice(index, 1);
    saveExpenses();
    updateTotals();
    renderExpenses();
  }
}

// Handle form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const newExpense = {
    desc: descInput.value.trim(),
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    date: new Date().toISOString().split("T")[0]
  };

  expenses.push(newExpense);
  saveExpenses();
  updateTotals();
  renderExpenses();

  // Reset form
  form.reset();
});

// Initialize
updateTotals();
renderExpenses();
function clearAllExpenses() {
  if (confirm("This will delete ALL your expenses. Are you sure?")) {
    expenses = [];
    localStorage.removeItem("expenses");
    updateTotals();
    renderExpenses();
  }
}
