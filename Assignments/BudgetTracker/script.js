document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transactionForm");
  const list = document.getElementById("transactionList");
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const descriptionInput = document.getElementById("description");
  const dateInput = document.getElementById("date");
  const typeInputs = document.querySelectorAll('input[name="type"]');
  
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let editId = null; // To track which transaction is being edited

  // Load Transactions on Page Load
  renderList();

  // Form Submission Event
  form.addEventListener("submit", (e) => {
      e.preventDefault();

      const type = document.querySelector('input[name="type"]:checked').value;
      const category = categoryInput.value;
      const amount = parseFloat(amountInput.value);
      const description = descriptionInput.value;
      const date = dateInput.value;

      if (!amount || amount <= 0) {
          alert("Please enter a valid amount.");
          return;
      }

      if (editId === null) {
          // Add new transaction
          const transaction = { id: Date.now(), type, category, amount, description, date, status: "Pending" };
          transactions.push(transaction);
      } else {
          // Update existing transaction
          transactions = transactions.map(trx =>
              trx.id === editId ? { ...trx, type, category, amount, description, date } : trx
          );
          editId = null;
      }

      localStorage.setItem("transactions", JSON.stringify(transactions));
      renderList();
      form.reset();
  });

  // Render Transactions in Table
  function renderList() {
      list.innerHTML = ""; // Clear the list before rendering
      transactions.forEach(addTransactionToTable);
  }

  // Add a Transaction Row to Table
  function addTransactionToTable(transaction) {
      const row = document.createElement("tr");
      row.setAttribute("data-id", transaction.id);

      row.innerHTML = `
          <td>${transaction.category}</td>
          <td>₹${transaction.amount.toFixed(2)}</td>
          <td>${transaction.description}</td>
          <td>${transaction.status}</td>
          <td>
              <button class="edit-btn" data-id="${transaction.id}">Edit</button>
              <button class="delete-btn" data-id="${transaction.id}">Delete</button>
          </td>
      `;

      list.appendChild(row);
  }

  // Event Delegation for Edit & Delete Buttons
  list.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-btn")) {
          editTransaction(e.target.dataset.id);
      }
      if (e.target.classList.contains("delete-btn")) {
          deleteTransaction(e.target.dataset.id);
      }
  });

  // Edit Transaction
  function editTransaction(id) {
      const transaction = transactions.find(trx => trx.id == id);
      if (!transaction) return;

      // Fill form with existing data
      amountInput.value = transaction.amount;
      categoryInput.value = transaction.category;
      descriptionInput.value = transaction.description;
      dateInput.value = transaction.date;
      typeInputs.forEach(input => {
          if (input.value === transaction.type) {
              input.checked = true;
          }
      });

      editId = transaction.id; // Set edit mode
  }

  // Delete Transaction
  function deleteTransaction(id) {
      transactions = transactions.filter(trx => trx.id != id);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      renderList();
  }
});
