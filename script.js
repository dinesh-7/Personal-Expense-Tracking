// const arrow = document.querySelector('.arrow');

// arrow.addEventListener('click', (event) => {
//   event.preventDefault();
//   const targetElement = document.querySelector(event.target.getAttribute('#tracker'));
//   targetElement.scrollIntoView({ behavior: 'smooth' });
// });

// Get the table-part element and the transaction-table
const tablePart = document.querySelector(".table-part");
const transactionTable = document.getElementById("transaction-table");

// Function to check the number of entries and apply scrollbar if needed
function checkTableScroll() {
  const rowCount = transactionTable.rows.length - 1; // Exclude the header row
  const maxRowCount = 10; // Set the desired maximum number of entries

  if (rowCount > maxRowCount) {
    tablePart.classList.add("scrollable");
  } else {
    tablePart.classList.remove("scrollable");
  }
}

// Call the function initially and whenever there is a change in the table
checkTableScroll();

// Add an event listener for changes in the table
const observer = new MutationObserver(checkTableScroll);
observer.observe(transactionTable, {
  childList: true,
  subtree: true,
});

// Initialize an empty array to store the transactions
let transactions = [];
// let transactions = [
//   { description: "Salary", amount: 5000, type: "income" },
//   { description: "Rent", amount: 2000, type: "expense" },
//   { description: "Groceries", amount: 1000, type: "expense" }
// ];


// Variable to store the current transaction being edited
let editedTransaction = null;

// Function to add a new transaction
function addTransaction() {
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const typeInput = document.getElementById("type");
  const dateInput = document.getElementById("date");

  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const chosenDate = new Date(dateInput.value);

  // Clear the input fields
  descriptionInput.value = "";
  amountInput.value = "";
  dateInput.value = "";

  // Validate the input
  if (description.trim() === "" || isNaN(amount) || isNaN(chosenDate)) {
    return;
  }

  // Create a new transaction object
  const transaction = {
    primeId: chosenDate.getTime(),
    description: description,
    amount: amount,
    type: type,
  };

  // Add the transaction to the array
  transactions.push(transaction);

  // Update the balance
  updateBalance();

  // Update the transaction table
  updateTransactionTable();
}

// Function to delete a transaction
function deleteTransaction(primeId) {
  // Find the index of the transaction with the given primeId
  const index = transactions.findIndex(
    (transaction) => transaction.primeId === primeId
  );

  // Remove the transaction from the array
  if (index > -1) {
    transactions.splice(index, 1);
  }

  // Update the balance
  updateBalance();

  // Update the transaction table
  updateTransactionTable();
}

// Function to edit a transaction
function editTransaction(primeId) {
  // Find the transaction with the given primeId
  const transaction = transactions.find(
    (transaction) => transaction.primeId === primeId
  );

  // Populate the input fields with the transaction details for editing
  document.getElementById("description").value = transaction.description;
  document.getElementById("amount").value = transaction.amount;
  document.getElementById("type").value = transaction.type;

  // Store the current transaction being edited
  editedTransaction = transaction;

  // Show the Save button and hide the Add Transaction button
  document.getElementById("add-transaction-btn").style.display = "none";
  document.getElementById("save-transaction-btn").style.display =
    "inline-block";

  // Set the date input value to the chosen date
  const dateInput = document.getElementById("date");
  const chosenDate = new Date(transaction.primeId);
  const formattedDate = formatDate(chosenDate);
  dateInput.value = formattedDate;
}

// Function to save the edited transaction
function saveTransaction() {
  if (!editedTransaction) {
    return;
  }
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const typeInput = document.getElementById("type");
  const dateInput = document.getElementById("date");

  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const chosenDate = new Date(dateInput.value);

  // Validate the input
  if (description.trim() === "" || isNaN(amount) || isNaN(chosenDate)) {
    return;
  }

  // Update the transaction details
  editedTransaction.description = description;
  editedTransaction.amount = amount;
  editedTransaction.type = type;
  editedTransaction.primeId = chosenDate.getTime();

  // Clear the input fields
  descriptionInput.value = "";
  amountInput.value = "";
  dateInput.value = "";

  // Clear the edited transaction
  editedTransaction = null;

  // Update the balance
  updateBalance();

  // Update the transaction table
  updateTransactionTable();

  // Show the Add Transaction button and hide the Save button
  document.getElementById("add-transaction-btn").style.display = "inline-block";
  document.getElementById("save-transaction-btn").style.display = "none";
}

// Function to update the balance
function updateBalance() {
  const balanceElement = document.getElementById("balance");
  let balance = 0.0;

  // Calculate the total balance
  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      balance += transaction.amount;
    } else if (transaction.type === "expense") {
      balance -= transaction.amount;
    }
  });

  // Format the balance with currency symbol
  const currencySelect = document.getElementById("currency");
  const currencyCode = currencySelect.value;
  const formattedBalance = formatCurrency(balance, currencyCode);

  // Update the balance display
  balanceElement.textContent = formattedBalance;

  // Check if the balance is negative or positive
  if (balance < 0) {
    balanceElement.classList.remove("positive-balance");
    balanceElement.classList.add("negative-balance");
  } else {
    balanceElement.classList.remove("negative-balance");
    balanceElement.classList.add("positive-balance");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Set initial balance value
  let balance = 0.0;
  updateBalance(balance); // Update the balance display

  // Other code for adding transactions, updating balance, etc.

  // Function to update the balance display
  function updateBalance(balance) {
    const balanceElement = document.getElementById("balance");
    balanceElement.textContent = balance.toFixed(2); // Format balance with 2 decimal places
  }
});
// Function to format currency based on the selected currency code
function formatCurrency(amount, currencyCode) {
  // Define currency symbols and decimal separators for different currency codes
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    INR: "₹",
  };

  const decimalSeparators = {
    USD: ".",
    EUR: ",",
    INR: ".",
  };

  // Get the currency symbol and decimal separator based on the currency code
  const symbol = currencySymbols[currencyCode] || "";
  const decimalSeparator = decimalSeparators[currencyCode] || ".";

  // Format the amount with currency symbol and decimal separator
  const formattedAmount =
    symbol + amount.toFixed(2).replace(".", decimalSeparator);
  return formattedAmount;
}

// Function to format date as DD/MM/YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to update the transaction table
function updateTransactionTable() {
  const transactionTable = document.getElementById("transaction-table");

  // Clear the existing table rows
  while (transactionTable.rows.length > 1) {
    transactionTable.deleteRow(1);
  }

  // Add new rows to the table
  transactions.forEach((transaction) => {
    const newRow = transactionTable.insertRow();

    const dateCell = newRow.insertCell();
    const date = new Date(transaction.primeId);
    dateCell.textContent = formatDate(date);

    const descriptionCell = newRow.insertCell();
    descriptionCell.textContent = transaction.description;

    const amountCell = newRow.insertCell();
    const currencySelect = document.getElementById("currency");
    const currencyCode = currencySelect.value;
    const formattedAmount = formatCurrency(transaction.amount, currencyCode);
    amountCell.textContent = formattedAmount;

    const typeCell = newRow.insertCell();
    typeCell.textContent = transaction.type;

    const actionCell = newRow.insertCell();
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () =>
      editTransaction(transaction.primeId)
    );
    actionCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () =>
      deleteTransaction(transaction.primeId)
    );
    actionCell.appendChild(deleteButton);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");
    saveButton.addEventListener("click", () =>
      saveTransaction(transaction.primeId)
    );
    actionCell.appendChild(saveButton);
  });
}

// Event listener for the Add Transaction button
document
  .getElementById("add-transaction-btn")
  .addEventListener("click", addTransaction);

// Event listener for the Save Transaction button
document
  .getElementById("save-transaction-btn")
  .addEventListener("click", saveTransaction);

// Initial update of the balance and transaction table
updateBalance();
updateTransactionTable();

// Function to handle the download of data in PDF and CSV formats
function handleDownload() {
  // Prompt the user to select the export format
  const exportFormat = prompt("Select export format: PDF or CSV").toLowerCase();

  if (exportFormat === "pdf") {
    // Call a function to export data to PDF
    exportToPDF();
  } else if (exportFormat === "csv") {
    // Call a function to export data to CSV
    exportToCSV();
  } else {
    alert('Invalid export format. Please enter either "PDF" or "CSV".');
  }
}

// Function to export data to PDF
function exportToPDF() {
  // Define the document content using pdfMake syntax
  const docDefinition = {
    content: [
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto"],
          body: [
            [
              { text: "Date", style: "header" },
              { text: "Description", style: "header" },
              { text: "Amount", style: "header" },
              { text: "Type", style: "header" },
            ],
            // Add transaction data to the table body
            ...transactions.map((transaction) => {
              const date = formatDate(new Date(transaction.primeId));
              const description = transaction.description;
              const amount = transaction.amount;
              const type = transaction.type;

              return [date, description, amount.toString(), type];
            }),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        margin: [0, 5],
      },
    },
  };

  // Create the PDF document
  pdfMake.createPdf(docDefinition).download("transactions.pdf");
}

// Function to export data to CSV
function exportToCSV() {
  // Generate CSV content
  const csvContent =
    "Date,Description,Amount,Type\n" +
    transactions
      .map((transaction) => {
        const date = formatDate(new Date(transaction.primeId));
        const description = transaction.description;
        const amount = transaction.amount;
        const type = transaction.type;

        return `${date},${description},${amount},${type}`;
      })
      .join("\n");
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link element and trigger a click to download the CSV file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transactions.csv";
  link.click();
}












let transactionChart = null;

// Sample Transactions Array (Replace with real transactions)
// let transactions = [
//     { amount: 100, type: "income" },
//     { amount: 50, type: "expense" },
//     { amount: 200, type: "income" },
//     { amount: 80, type: "expense" }
// ];

// Function to toggle chart visibility
function toggleChart() {
    const chartCanvas = document.getElementById("transactionChart");

    if (chartCanvas.style.display === "none") {
        chartCanvas.style.display = "block";
        updateChart();  // Generate chart when shown
    } else {
        chartCanvas.style.display = "none";
    }
}

// Function to update the chart dynamically
function updateChart() {
    // Destroy previous chart if exists
    if (transactionChart) {
        transactionChart.destroy();
    }

    // Aggregate income & expenses
    let totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    let totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

    // Create new chart
    const ctx = document.getElementById("transactionChart").getContext("2d");
    transactionChart = new Chart(ctx, {
        type: "pie", // Change to "bar" for a bar chart
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                label: "Transaction Breakdown",
                data: [totalIncome, totalExpense],
                backgroundColor: ["green", "red"]
            }]
        }
    });
}





function openGraphPopup() {
  if (transactions.length === 0) {
      alert("No transactions to display!");
      return;
  }

  // Group transactions into categories
  let incomeCategories = {};
  let expenseCategories = {};

  transactions.forEach(t => {
      if (t.type === "income") {
          incomeCategories[t.description] = (incomeCategories[t.description] || 0) + t.amount;
      } else {
          expenseCategories[t.description] = (expenseCategories[t.description] || 0) + t.amount;
      }
  });

  // Prepare Data for Chart.js
  let labels = [...Object.keys(incomeCategories), ...Object.keys(expenseCategories)];
  let data = [...Object.values(incomeCategories), ...Object.values(expenseCategories)];
  let colors = [...Array(labels.length)].map(() => '#' + Math.floor(Math.random()*16777215).toString(16)); // Random colors

  // Open modal popup
  let modal = document.getElementById("graphModal");
  modal.style.display = "flex";

  // Get Canvas Context
  let ctx = document.getElementById("transactionChart").getContext("2d");

  // Destroy old chart if exists
  if (window.myChart) {
      window.myChart.destroy();
  }

  // Create Pie Chart
  window.myChart = new Chart(ctx, {
      type: "pie",
      data: {
          labels: labels,
          datasets: [{
              data: data,
              backgroundColor: colors
          }]
      }
  });
}

// Close Modal Function
function closeGraphPopup() {
  document.getElementById("graphModal").style.display = "none";
}


function predict() {
  // Ask the user for their income
  let income = prompt("Enter your monthly income:");
  
  if (!income || isNaN(income) || income <= 0) {
    alert("Please enter a valid positive number for income.");
    return;
  }

  income = parseFloat(income); // Convert input to number

  // Define expense categories and their percentage allocation
  const expenses = [
    { description: "Rent", percentage: 13 },
    { description: "Groceries", percentage: 15 },
    { description: "Entertainment", percentage: 10 },
    { description: "Transportation", percentage: 10 },
    { description: "Utilities", percentage: 8 },
    { description: "Savings", percentage: 12 },
    { description: "Health & Insurance", percentage: 5 },
    { description: "Shopping", percentage: 5 },
    { description: "Education", percentage: 20 },
    { description: "Miscellaneous", percentage: 2 }
  ];

  // Reset transactions and add income entry
  transactions = [{ description: "Salary", amount: income, type: "income" }];

  // Calculate expenses based on percentage
  expenses.forEach(expense => {
    let amount = (income * expense.percentage) / 100;
    transactions.push({ description: expense.description, amount: amount, type: "expense" });
  });

  console.log(transactions); // Check the transactions array in console

  // Call openGraphPopup() (assuming it's defined somewhere in your code)
  openGraphPopup();
  transactions =[]; // Reset transactions after prediction
}