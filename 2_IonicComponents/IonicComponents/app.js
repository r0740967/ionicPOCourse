const reasonInput = document.querySelector('#input-reason');
const amountInput = document.querySelector('#input-amount');
const cancelBtn = document.querySelector('#btn-cancel');
const confirmBtn = document.querySelector('#btn-confirm');

const expensesList = document.querySelector('#expenses-list');

const totalExpensesOutput = document.querySelector('#total-expenses');

let totalExpense = 0;

const clear = () => {
    reasonInput.value = '';
    amountInput.value = '';
}

confirmBtn.addEventListener('click', () => {
    const enteredReason = reasonInput.value;
    const enteredAmount = amountInput.value;

    if (enteredReason.trim().length <= 0 || enteredAmount <= 0 || enteredAmount.trim().length <= 0){
        const alert = document.createElement("ion-alert");
        alert.header = "Invalid inputs";
        alert.message = "Please provide a valid reason and amount";
        alert.buttons = ['Okay'];
        document.body.appendChild(alert);
        return alert.present();
    }

    const newItem = document.createElement('ion-item');

    newItem.textContent = enteredReason + ': $' + enteredAmount;

    expensesList.appendChild(newItem);

    totalExpense += +enteredAmount;
    totalExpensesOutput.textContent = totalExpense;
    clear();
})

cancelBtn.addEventListener('click', clear);