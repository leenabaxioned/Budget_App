/* Author: */
const budgetForm = document.querySelector("#budgetForm");
const expenseForm = document.querySelector("#expenseForm");
const enterBudgetInput = document.querySelector("#enterBudget");
const expenseNameInput = document.querySelector("#expenseName");
const expenseAmountInput = document.querySelector("#expenseAmount");
const budgetAmountElem = document.querySelector(
  ".budget-calculation .first .amount"
);
const expensesAmountElem = document.querySelector(
  ".budget-calculation .second .amount"
);
const balanceAmountElem = document.querySelector(
  ".budget-calculation .third .amount"
);
const expenseTable = document.querySelector("#expense-table");

let editingIndex = null;

const loadData = () => {
  const budget = localStorage.getItem("budget") || "0";
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  updateDisplay(budget, expenses);
};

// Update and display amount and table li's
const updateDisplay = (budget, expenses) => {
  const totalExpenses = expenses.reduce(
    (sum, { amount }) => sum + parseFloat(amount),
    0
  );
  const balance = parseFloat(budget) - totalExpenses;

  budgetAmountElem.textContent = `$ ${parseFloat(budget).toFixed(2)}`;
  expensesAmountElem.textContent = `$ ${totalExpenses.toFixed(2)}`;
  balanceAmountElem.textContent = `$ ${balance.toFixed(2)}`;

  expenseTable.innerHTML = `
      <li class="row">
        <h2 class="column">Expense Title</h2>
        <h2 class="column">Expense Value</h2>
        <h2 class="column">Update/Delete</h2>
      </li>`;

  expenses.forEach((expense, index) => {
    expenseTable.innerHTML += `
        <li class="row rows">
          <span class="column">${expense.title}</span>
          <span class="column">$${parseFloat(expense.amount).toFixed(2)}</span>
          <span class="column modifications">
            <button class="editBtn" onclick="editExpense(${index})">Edit</button>
            <button class="deleteBtn" onclick="deleteExpense(${index})">Delete</button>
          </span>
        </li>`;
  });
};

const saveData = (budget, expenses) => {
  localStorage.setItem("budget", budget);
  localStorage.setItem("expenses", JSON.stringify(expenses));
};

const removeExistingError = (form) => {
  form
    .querySelectorAll(".errExpense, .errBudget")
    .forEach((error) => error.remove());
};

// function to delete expense-item row
window.deleteExpense = (index) => {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.splice(index, 1);
  saveData(localStorage.getItem("budget"), expenses);
  updateDisplay(localStorage.getItem("budget"), expenses);
};

// function to edit expense-item row
window.editExpense = (index) => {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const { title, amount } = expenses[index];

  expenseNameInput.value = title;
  expenseAmountInput.value = amount;
  editingIndex = index;

  expenseForm.querySelector(".addExpense").textContent = "Update Expense";
};

// budgetform on calculate btn function
budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  removeExistingError(budgetForm);

  const enterBudget = enterBudgetInput.value.trim();
  if (isNaN(enterBudget) || enterBudget === "") {
    const errBudget = document.createElement("p");
    errBudget.className = "errBudget";
    errBudget.textContent = "*Please enter a valid budget amount.";
    budgetForm.appendChild(errBudget);
    return;
  }
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  saveData(enterBudget, expenses);
  updateDisplay(enterBudget, expenses);
  budgetForm.reset();
});

// expense form on add expense btn function
expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  removeExistingError(expenseForm);

  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = expenseAmountInput.value.trim();

  if (expenseName === "" || isNaN(expenseAmount) || expenseAmount === "") {
    const errExpense = document.createElement("p");
    errExpense.className = "errExpense";
    errExpense.textContent = "*Please enter valid expense details.";
    expenseForm.appendChild(errExpense);
    return;
  }

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  if (editingIndex !== null) {
    expenses[editingIndex] = {
      title: expenseName,
      amount: parseFloat(expenseAmount).toFixed(2),
    };
    editingIndex = null;
    expenseForm.querySelector(".addExpense").textContent = "Add Expense";
  } else {
    expenses.push({
      title: expenseName,
      amount: parseFloat(expenseAmount).toFixed(2),
    });
  }

  saveData(localStorage.getItem("budget"), expenses);
  updateDisplay(localStorage.getItem("budget"), expenses);
  expenseForm.reset();
});

loadData();