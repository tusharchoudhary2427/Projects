'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data //
const account1 = {
  owner: 'John Snow',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-05-27T17:01:17.194Z',
    '2025-01-08T23:36:17.929Z',
    '2025-02-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

////////Elements////////
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////Functions////////////////////

// Function to format movement date
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  if (Math.round(daysPassed) <= 30 || Math.round(daysPassed) <= 31)
    return `1 month ago`;
  if (Math.round(daysPassed) <= 182.5) return '6 months ago';
  if (Math.round(daysPassed) <= 364.5 || Math.round(daysPassed) <= 365)
    return '1 year ago';

  return new Intl.DateTimeFormat(locale).format(date);
};

// Function to format currency
const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display transactions
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
              <div class="movements__date">${displayDate}</div>
 
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Function to calculate and display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
};

// Function to create username
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

//Function to start the logout timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    //Decrease 1s
    time--;
  };
  // Set Time to 5 minutes
  let time = 300;
  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Login event handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Create current date and time//

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',

      hour12: true,
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);

    //Reset Timer//
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Transfer event handler
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date //
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //Reset Timer//
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Loan event handler
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Disable button to prevent multiple clicks
    btnLoan.disabled = true;

    setTimeout(() => {
      // Add movement only once
      currentAccount.movements.push(amount);

      // Add loan date only once
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      //Reset Timer//
      clearInterval(timer);
      timer = startLogOutTimer();

      alert(`Congratulations, Your loan is approved!`);

      // Re-enable button after operation is complete
      btnLoan.disabled = false;
    }, 4000);
  }

  // Clear input fields
  inputLoanAmount.value = '';
});

// Close account event handler
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

/*const createUserName = function (accts) {
  accts.forEach(function (acct) {
    acct.username = acct.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);*/

/*const user = 'Tushar Choudhary';
const username = user
  .toLowerCase()
  .split(' ')
  .map(name => name[0])
  .join(' ');

console.log(username);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToInr = 90.4;

/*const movementsINR = movements.map(function (mov) {
  return mov * euroToInr;
});

const movementsINR = movements.map(mov => mov * euroToInr);

console.log(movements);
console.log(movementsINR);

const movementsDescription = movements.map(
  (mov, i, arr) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescription);*/

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

/*let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log(...arr);

//SPLICE//
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);*/

//REVERSE//

/*let arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['f', 'g', 'h', 'i', 'j'];
console.log(arr2.reverse());

//CONICAT//
const letters = arr.concat(arr2);
console.log(letters);
console.log(...arr, ...arr2);

//JOIN//
console.log(letters.join('_'));*/

//ACT METHOD//

/*const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

//GETTING LAST ARRAY METHODD//
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
const myName = 'Tushar Choudhary';
console.log(myName.at(5));*/

/*const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movements > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}
console.log('___FOREACH_____');

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});

//WITH MAPS//

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//WITH SETS//
const currenciesUnique = new Set(['USD', 'EUR', 'GBP', 'USD', 'EUR', 'GBP']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});*/

/*const cart = [
  { item: 'Shoes', price: 120 },
  { item: 'Shirt', price: 50 },
  { item: 'Jeans', price: 80 },
];
//map//
const discountedCart = cart.map(product => ({
  ...product,
  price: product.price * 0.9,
}));
console.log(discountedCart);
//filer//
const expensiveItems = cart.filter(product => product.price > 60);
console.log(expensiveItems);
//reduce//
const totalPrice = cart.reduce((total, product) => total + product.price, 0);
console.log(totalPrice);*/

/*const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);

console.log(movements);
console.log(withdrawals);

const balance = movements.reduce(function (acc, curr, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + curr;
}, 0);
console.log(balance);

//Using Arrow Function//

const balance = movements.reduce((acc, curr) => acc + curr, 0);
console.log(balance);*/

//MAXIMUM VALUE//
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

//CHAINING METHOD//
//PIPELINE//
const euroToUsd = 1.04;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    return mov * euroToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);*/

//NEW FINDLIST AND FINDLASTINDEX//

/*const lastwithdrawal = movements.findLast(mov => mov < 0);
console.log(lastwithdrawal);

const latestLargeMovementIndex = movements.findLastIndex(
  mov => Math.abs(mov) > 2000
);
console.log(latestLargeMovementIndex);
console.log(
  `Your latest large movement was ${
    movements.length - latestLargeMovementIndex
  } movements ago`
);

//SOME AND EVERY//

console.log(movements);

//EQUALITY//

console.log(movements.includes(-130));

//CONDITION//
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

//EVERY METHOD//
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//SEPARATE CALLBACKS//
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//FLAT METHOD//

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat(4));

const overallBalance1 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance1);

//FLAT-MAP METHOD//
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

///////////SORTING//////////

//STRINGS//
const owners = ['C', 'F', 'G', 'A', 'B', 'X'];
console.log(owners.sort());
console.log(owners);

//NUMBERS//
console.log(movements.sort());

//ASCENDING ORDER//
movements.sort((a, b) => a - b);
console.log(movements);

//DESCENDING ORDER//
movements.sort((a, b) => b - a);

console.log(movements);*/

//////////ARRAY GROUPING//////////
/*console.log(movements);

const groupedMovements = Object.groupBy(movements, movement =>
  movement > 0 ? 'deposits' : 'withdrawals'
);

console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return 'very active';
  if (movementCount >= 4) return 'active';
  if (movementCount >= 1) return 'moderate';
  return 'inactive';
});
console.log(groupedByActivity);

const groupedAccounts = Object.groupBy(accounts, ({ type }) => type);
console.log(groupedAccounts);

const arr = [1, 2, 3, 4, 5, 6, 7, 8];
console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8));

const x = new Array(8);
console.log(x);

arr.fill(64, 69);
console.log(arr);*/

//////////Non-Destructive Alternatives: toReversed, toSorted, toSpliced, with//////////
/*console.log(movements);
const reversedMov = movements.toReversed();
console.log(reversedMov);
console.log(movements);

//with//
const newMovements = movements.with(1, 2000);
console.log(newMovements);
console.log(movements);

//////////ARRAY METHODS//////////

const bankDepositSum = accounts.flatMap(acc => acc.movements);
const bankDepositSum2 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);
console.log(bankDepositSum2);

//////////CONVERTING AND CHECKING NUMBERS//////////

console.log(23 === 23.1);

console.log('23');
console.log(parseInt('23', 2));
console.log(+'23');

//Parsing//

console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));

console.log(+parseInt('2.5rem'));
console.log(+parseFloat('2.5rem'));

//Checking if the value is NaN or not//
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(+isNaN(+'20X'));
console.log(+isNaN(23 / 0));

//Checking if the value is number//
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(+isFinite(+'20px'));
console.log(+isFinite(23 / 0));
console.log(+isFinite('23/0'));

//Math and Rounding//
console.log(Math.sqrt(25));
console.log(125 ** (1 / 3));

console.log(Math.max(5, 13, 8, 69, 42, 33));
console.log(Math.max(5, 13, 8, '69', 42, 33));
console.log(Math.max(5, 13, 8, '69px', 42, 33));

console.log(Math.min(5, 13, 8, 69, 42, 33));

//Calculating the radius of circle using a radon number//

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

//Random function creator//
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
randomInt(10, 20);
console.log(randomInt(10, 20));
console.log(randomInt(0, 3));

//Rounding integers//
console.log(Math.trunc(23.3));

console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor(23.9));

//trunc vs floor in case of -ve//

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.9));

//Rounding decimals//
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));

//////////REMINDER OPERATOR//////////
console.log(5 % 2);
console.log(5 / 2);

console.log(8 % 3);
console.log(8 / 3);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(25));
console.log(isEven(34));

//Numeric Separators//

const diameter = 287_460_000_000;
console.log(diameter);

//BigInt//
console.log(Number.MAX_SAFE_INTEGER);
console.log(BigInt(2 ** 53 + 2));

const huge = 20304856489690798n;
const num = 25;
console.log(huge * BigInt(num));

//Exceptions//
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n === '20');

console.log(huge + ' is REALLY DAMM BIG!!!!');

//Divisions//
console.log(11n / 3n);
console.log(11 / 3);

//Creating Dates//
const now = new Date();
console.log(now);
console.log(new Date('15 august 2024'));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

//Working with Dates//

const future = new Date(2069, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.getMilliseconds());
console.log(future.toISOString());
console.log(future.getTime());

const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1);*/

const num = 34597678990.69;
const options = { style: 'currency', currency: 'EUR' };

console.log('US:', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria:', new Intl.NumberFormat('ar-SY', options).format(num));

console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);

//SetInterval//
