/* Author: */
document.addEventListener('DOMContentLoaded', () => {
  const budgetForm = document.querySelector('#budgetForm');
  const expenseForm = document.querySelector('#expenseForm');
  const enterBudgetInput = document.querySelector('#enterBudget');
  const expenseNameInput = document.querySelector('#expenseName');
  const expenseAmountInput = document.querySelector('#expenseAmount');
  const budgetAmountElem = document.querySelector('.budget-calculation .first .amount');
  const expensesAmountElem = document.querySelector('.budget-calculation .second .amount');
  const balanceAmountElem = document.querySelector('.budget-calculation .third .amount');
  const expenseTable = document.querySelector('#expense-table');

  let editingIndex = null;  // Variable to store the index of the expense

  // Load and display data from local storage
  function loadData() {
    const budget = localStorage.getItem('budget') || '0';
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    updateDisplay(budget, expenses);
  }

  function updateDisplay(budget, expenses) {
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const balance = parseFloat(budget) - totalExpenses;
    budgetAmountElem.textContent = `$ ${parseFloat(budget).toFixed(2)}`;
    expensesAmountElem.textContent = `$ ${totalExpenses.toFixed(2)}`;
    balanceAmountElem.textContent = `$ ${balance.toFixed(2)}`;
    
    // Update expense table
    expenseTable.innerHTML = '<li class="row"><h2 class="column">Expense Title</h2><h2 class="column">Expense Value</h2><h2 class="column">Operations</h2></li>';
    expenses.forEach((expense, index) => {
      const row = document.createElement('li');
      row.className = 'row rows';
      row.innerHTML = `
        <span class="column">${expense.title}</span>
        <span class="column">$ ${parseFloat(expense.amount).toFixed(2)}</span>
        <span class="column">
          <button class="editBtn" onclick="editExpense(${index})">Edit</button>
          <button class="deleteBtn" onclick="deleteExpense(${index})">Delete</button>
        </span>
      `;
      expenseTable.appendChild(row);
    });
  }

  function saveData(budget, expenses) {
    localStorage.setItem('budget', budget);
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  function removeExistingError(form) {
    const existingErrors = form.querySelectorAll('.errExpense, .errBudget');
    existingErrors.forEach(error => error.remove());
  }

  window.deleteExpense = (index) => {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateDisplay(localStorage.getItem('budget'), expenses);
  }

  window.editExpense = (index) => {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses[index];

    expenseNameInput.value = expense.title;
    expenseAmountInput.value = expense.amount;
    editingIndex = index; // Set editingIndex to the index

    const addButton = expenseForm.querySelector('.addExpense');
    addButton.textContent = 'Update Expense';
  }

  // Handle budget form submission
  budgetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    removeExistingError(budgetForm); 

    const enterBudget = enterBudgetInput.value.trim();
    if (isNaN(enterBudget) || enterBudget === '') {
      const errBudget = document.createElement('p');
      errBudget.className = 'errBudget';
      errBudget.textContent = 'Please enter a valid budget amount.';
      budgetForm.appendChild(errBudget);
      return;
    }
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    localStorage.setItem('budget', enterBudget);
    updateDisplay(enterBudget, expenses);
    budgetForm.reset();
  });

  // Handle expense form submission
  expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    removeExistingError(expenseForm);
    
    const expenseName = expenseNameInput.value.trim();
    const expenseAmount = expenseAmountInput.value.trim();
    
    if (expenseName === '' || isNaN(expenseAmount) || expenseAmount === '') {
      const errExpense = document.createElement('p');
      errExpense.className = 'errExpense';
      errExpense.textContent = 'Please enter a valid expense details.';
      expenseForm.appendChild(errExpense);
      return;
    }
    
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    if (editingIndex !== null) {
      expenses[editingIndex] = { title: expenseName, amount: parseFloat(expenseAmount).toFixed(2) };
      editingIndex = null;
      expenseForm.querySelector('.addExpense').textContent = 'Add Expense'; // Reset button text
    } else {
      expenses.push({ title: expenseName, amount: parseFloat(expenseAmount).toFixed(2) }); //add new expense
    }
    
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateDisplay(localStorage.getItem('budget'), expenses);
    expenseForm.reset();
  });

  loadData();
});




