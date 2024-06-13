-  npm i redux (installation)
# Creating a store 🏪
```js
//src/store.js 📁
//! redux store
import { createStore } from "redux";

//! initial state
const initialState = {
    balance: 0,
    loan: 0,
    loanPurpose: "",
}

//! reducers must be a pure fx()
function reducerFx(state = initialState, action) {
    switch (action.type) {
        case "account/deposit":
            return { ...state, balance: state.balance + action.payload };
        case "account/withdraw":
            return { ...state, balance: state.balance - action.payload };
        //todo: Later ✅   
        case "account/requestLoan":
            if(state.loan>0) return state;
            return {...state, loan: action.payload.amount, loanPurpose: action.payload.purpose, balance:state.balance + action.payload.amount};
        case "account/payLoan":
            return { ...state, loan: 0, loanPurpose: "", balance: state.balance - state.loan};
        default:
            return state;
    }
}

const store = createStore(reducerFx);

store.dispatch({type: "account/deposit", payload: 500});
//console.log('Hey Redux!');
console.log("account/deposit =>",store.getState());
store.dispatch({type: "account/withdraw", payload: 200});
console.log("account/withdraw =>",store.getState());
store.dispatch({type: "account/requestLoan", payload: {amount:1000, purpose:"Go on a vacation ✈️"}});
console.log("account/requestLoan =>",store.getState());
store.dispatch({type:"account/payLoan"})
console.log("account/payLoan =>",store.getState(),);

/*
! O/P:
account/deposit => {balance: 500, loan: 0, loanPurpose: ''}
store.js:35 account/withdraw => {balance: 300, loan: 0, loanPurpose: ''}
store.js:37 account/requestLoan => {balance: 1300, loan: 1000, loanPurpose: 'Go on a vacation ✈️'}
store.js:39 account/payLoan => {balance: 300, loan: 0, loanPurpose: ''}
*/
```
# Create ACTION / Working with Action Creator fxs() ✨
- Simply functions that return ACTIONS, instead of writing them by hand.
- Not really a Redux thing, Redux would work fine without them, but they are useful conventions used by React/Redux Devs have been using/following.
- 1 action creator fx() for each possible action.
```js
//src/store.js 📁
//! redux store
import { createStore } from "redux";

//! initial state
const initialState = {
    balance: 0,
    loan: 0,
    loanPurpose: "",
}

//! reducers must be a pure fx()
function reducerFx(state = initialState, action) {
    switch (action.type) {
        case "account/deposit":
            return { ...state, balance: state.balance + action.payload };
        case "account/withdraw":
            return { ...state, balance: state.balance - action.payload };
        //todo: Later ✅   
        case "account/requestLoan":
            if (state.loan > 0) return state;
            return { ...state, loan: action.payload.amount, loanPurpose: action.payload.purpose, balance: state.balance + action.payload.amount };
        case "account/payLoan":
            return { ...state, loan: 0, loanPurpose: "", balance: state.balance - state.loan };
        default:
            return state;
    }
}

const store = createStore(reducerFx);

//! const ACCOUNT_DEPOSIT= "account/deposit" //In some older code-bases

//! Action craetor fxs()

function deposit(amount) {
    return { type: "account/deposit", payload: amount };
}

function withdraw(amount) {
    return { type: "account/withdraw", payload: amount };

}

function requestLoan(amount, purpose) {
    return { type: "account/requestLoan", payload: { amount, purpose } };
}

function payLoan() {
    return { type: "account/payLoan" };
}

store.dispatch(deposit(500));
console.log("account/deposit =>", store.getState());
store.dispatch(withdraw(200));
console.log("account/withdraw =>", store.getState());
store.dispatch(requestLoan(1000, "Go on a vacation ✈️"));
console.log("account/requestLoan =>", store.getState());
store.dispatch(payLoan());
console.log("account/payLoan =>", store.getState(),);
/*
! O/P:
account/deposit => {balance: 500, loan: 0, loanPurpose: ''}
store.js:70 account/withdraw => {balance: 300, loan: 0, loanPurpose: ''}
store.js:72 account/requestLoan => {balance: 1300, loan: 1000, loanPurpose: 'Go on a vacation ✈️'}
store.js:74 account/payLoan => {balance: 300, loan: 0, loanPurpose: ''}
*/
```

# Adding 1 more state: Customer 🤵🏻
- the store() fx works on 1 root reducer

```javascript
//! redux store
import { combineReducers, createStore } from "redux";

//! initial state
const initialStateAccount = {
    balance: 0,
    loan: 0,
    loanPurpose: "",
}

//! Adding 1 more state: Customer
const initialStateCustomer = {
    fullName: "",
    nationalId: "",
    createdAt: "",
}

//! reducers must be a pure fx()
function accountReducer(state = initialStateAccount, action) {
    switch (action.type) {
        case "account/deposit":
            return { ...state, balance: state.balance + action.payload };
        case "account/withdraw":
            return { ...state, balance: state.balance - action.payload };
        case "account/requestLoan":
            if (state.loan > 0) return state;
            return { ...state, loan: action.payload.amount, loanPurpose: action.payload.purpose, balance: state.balance + action.payload.amount };
        case "account/payLoan":
            return { ...state, loan: 0, loanPurpose: "", balance: state.balance - state.loan };
        default:
            return state;
    }
}

function customerReducer(state = initialStateCustomer, action) {
    switch (action.payload) {
        case "customer/createCustomer":
            return { ...state, fullName: action.payload.fullName, nationalId: action.payload.nationalId, createdAt: action.payload.createdAt };
        case "customer/updateName":
            return { ...state, fullName: action.payload.fullName };
        default:
            return state;
    }

}

const rootReducer = combineReducers({
    account: accountReducer,
    customer: customerReducer,
});

const store = createStore(rootReducer);

//! const ACCOUNT_DEPOSIT= "account/deposit" //In some older code-bases

//!Account Action craetor fxs()
function deposit(amount) {
    return { type: "account/deposit", payload: amount };
}

function withdraw(amount) {
    return { type: "account/withdraw", payload: amount };

}

function requestLoan(amount, purpose) {
    return { type: "account/requestLoan", payload: { amount, purpose } };
}

function payLoan() {
    return { type: "account/payLoan" };
}

//! Customer Action Creators fxs():
function createCustomer(fullName, nationalId) {
    return { type: "customer/createCustomer", payload: { fullName, nationalId, createdAt: new Date().toISOString() } };
}

function updateName(fullName) {
    return { type: "customer/updateName", payload: fullName };
}

 store.dispatch(createCustomer('Soumadip Banerjee', '123456'));
 console.log(store.getState());
 store.dispatch(deposit(250))
 console.log(store.getState());
```

# Professional Redux File Structure: State Slices
- Previously, devs would create 1 reducers folder and 1 file per reducer, same with action creators. 📁
- Drawbacks: Jumping between different files, thus, not recommended now. 🙅🏻‍♂️
```js
//! src/store.js
//! redux store
import { combineReducers, createStore } from "redux";
import accountReducer from "./features/account/accountSlice";
import customerReducer from "./features/customers/customerSlice";

const rootReducer = combineReducers({
    account: accountReducer,
    customer: customerReducer,
});

const store = createStore(rootReducer);

export default store;
```
 # Connecting our Redux App With React 🪝+⚛️
- npm i react-redux
- import { useSelector, useDispatch } from "react-redux";

# The Legacy Way Of Connecting Components To Redux⌛
```js
//!BalanceDsplay.jsx
//!Using the CONNECT API

import { connect } from "react-redux";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function BalanceDisplay({balance}) {
  return <div className="balance">{formatCurrency(balance)}</div>;
}

function mapStateToProps(state){
  return {
    balance: state.account.balance,
  }
}

export default connect(mapStateToProps)(BalanceDisplay);
```
# Redux Thunks
- Making an API Call with Redux Thunks

#### 3 steps to use the middleware -
1. Install the middleware package
2. We apply that middleware to our store
3. We use the middleware in our action creator fxs()

- npm i redux-thunk

```js
// accountSlice.js

//! initial Account state
const initialStateAccount = {
    balance: 0,
    loan: 0,
    loanPurpose: "",
    isLoading: false,
}

export default function accountReducer(state = initialStateAccount, action) {
    switch (action.type) {
        case "account/deposit":
            return { ...state, balance: state.balance + action.payload, isLoading: false };
        case "account/withdraw":
            return { ...state, balance: state.balance - action.payload };
        case "account/requestLoan":
            if (state.loan > 0) return state;
            return { ...state, loan: action.payload.amount, loanPurpose: action.payload.purpose, balance: state.balance + action.payload.amount };
        case "account/payLoan":
            return { ...state, loan: 0, loanPurpose: "", balance: state.balance - state.loan };
        case "account/convertingCurrency":
            return { ...state, isLoading: true};   
        default:
            return state;
    }
}

//!Account Action creator fxs()
export function deposit(amount, currency) {
    if (currency === "USD") {
        return { type: "account/deposit", payload: amount };
    };
    return async function (dispatch, getState) {
        // API call
        dispatch({ type: "account/convertingCurrency"})
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`);
        const data = await res.json();
        const converted = data.rates.USD;
        // return action
        dispatch ({ type: "account/deposit", payload: converted });
    }
}

export function withdraw(amount) {
    return { type: "account/withdraw", payload: amount };

}

export function requestLoan(amount, purpose) {
    return { type: "account/requestLoan", payload: { amount, purpose } };
}

export function payLoan() {
    return { type: "account/payLoan" };
}
```
# Using Redux Dev Tools
- Install Google Extension for Chrome - Redux Dev Tools
- npm i redux-devtools-extension
```js
//! redux store
import { applyMiddleware, combineReducers, createStore } from "redux";
import accountReducer from "./features/account/accountSlice";
import customerReducer from "./features/customers/customerSlice";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";

const rootReducer = combineReducers({
    account: accountReducer,
    customer: customerReducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
```
