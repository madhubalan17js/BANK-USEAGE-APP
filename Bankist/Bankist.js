"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]); */

/////////////////////////////////////////////////
// filter method

/* let adhu = [200, 450, -400, 3000, -650, -130, 70, 1300];
let eadhu = adhu.filter(function (value, i) {
  let result = value > 0;
  return result;
});
console.log(eadhu); */

//map method

/* let result;
let adhu = [200, 450, -400, 3000, -650, -130, 70, 1300];
let eadhu = adhu.map(function (value, ind, arr) {
  result = value - 2;
  return result;
});
console.log(eadhu); */

//reduce method

/* const adhu = [200, 450, -400, 3000, -650, -130, 70, 1300];
let eadhu = adhu.reduce(function (acc, curr, i, arr) {
  console.log(`${acc}    ${curr} `);
  return acc + curr;
}, 0);
console.log(eadhu); */

//problem using map,filter reduce
/* const ch = function (ages) {

  //map
  const humanages = ages.map(function (ages) {
    if (ages <= 2) {
      return 2 * ages;
    } else {
      return 16 + ages * 4;
    }
  });

  //filter
  const adults = humanages.filter(function (ages) {
    return ages >= 18;
  });

  //reduce
  const avg = adults.reduce(function (pre, cur) {
    return pre + cur / adults.length;
  }, 0);
  console.log(avg);
  console.log(humanages);
  console.log(adults);
};
ch([5, 2, 4, 1, 15, 8, 3]); */

// find ()
/* const accout = accounts.find((acc) => acc.owner === "Jonas Schmedtmann");
console.log(accout); */

////////////////////////////////////////////

// some()

/* console.log(account2.movements);
const someMethod = account2.movements.some((mov) => mov > 200);
console.log(someMethod); */

// every()

/* const someMethod2 = account2.movements.every((mov) => mov > 0);
const someMethod3 = account4.movements.every((mov) => mov > 0);
console.log(someMethod2, someMethod3); */

//separate callback

/* const deposit = (mov) => mov > 0;
console.log(account2.movements.some(deposit));
console.log(account2.movements.every(deposit));
console.log(account2.movements.filter(deposit)); */

//flat ()

/* const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrdeep = [
  [[1, 2], 3],
  [4, [5, 6], 7, 7],
];
console.log(arrdeep.flat(2));
 */

//filter the using map all the array

/* const allacounst = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((pre, cur) => pre + cur);
console.log(allacounst);
 */

//flatMap()
// array function and normal array
/* const x1 = new Array(7);
const x2 = [1, 2, 3, 4, 6, 7];

console.log(x1.fill(5, 3, 5));
console.log(x2.fill(5, 0, 4)); */

//using a array method in Sets and Maps

//from()

/* //convert class elements into array
labelBalance.addEventListener("click", function (e) {
  e.preventDefault();
  // first Method

  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.replace("💲", " "))
  );
  console.log([movementsUI]);
  // secont method to convert array
  const movementsUI2 = [...document.querySelectorAll(".movements__value")];
  console.log([movementsUI]);
});
 */

//Math and Round
/* console.log(Math.max(2, 34, 54, 78, 92, 2));
console.log(Math.min(2, 34, 54, 78, 92, 2));
console.log(Math.PI * Number.parseFloat("10.5px") ** 2);
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;


randomInt(10, 20);
console.log(randomInt(10, 20));


//rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3)); */

/* //Remainder Opertor
console.log(5 % 2);
console.log(5 / 2);

//creating date
const now = new Date();
console.log(now);
console.log("Aug 02 2020 ");
console.log(new Date(2029, 10, 99, 2, 66, 0)); */

// Expermental API Intl dates
/*  const now = new Date();
 const options = {
   hour: "numeric",
   minute: "numeric",
   day: "numeric",
   month: "numeric", //numeric, 2-digit
   year: "numeric",
   /*  weekday: "long", */
/* };
  const locale = navigator.language;
 console.log(locale); 

 labelDate.textContent = new Intl.DateTimeFormat(
   locale,
   options
 ).format(now);  */

//Expermental API Intl number
/* const num = 38789458.255;
const options = {
  style: "unit", //currency,percent,
  unit: "celsius",
  currency: "EUR",
  //useGrouping:false,
};
console.log("Us:   ", new Intl.NumberFormat("en-US", options).format(num));
console.log("Germany:   ", new Intl.NumberFormat("de-DE", options).format(num));
console.log("Syria:   ", new Intl.NumberFormat("ar-SY", options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language).format(num)
); */

//Timer: setTimeout
/* const ingredients = ["olives", "spinach"];
const timer = setTimeout(
  (aru1, aru2) => console.log(`${aru1} and ${aru2}`),
  3000,
  ...ingredients
);
if (ingredients.includes("spinach")) clearTimeout(timer);  */

//Timer:setInterval
/* setInterval(() => {
  const now = new Date();
  console.log(now);
}, 3000); */
