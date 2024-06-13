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

// store.dispatch(deposit(500));
// console.log("account/deposit =>", store.getState());
// store.dispatch(withdraw(200));
// console.log("account/withdraw =>", store.getState());
// store.dispatch(requestLoan(1000, "Go on a vacation ✈️"));
// console.log("account/requestLoan =>", store.getState());
// store.dispatch(payLoan());
// console.log("account/payLoan =>", store.getState(),);


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

