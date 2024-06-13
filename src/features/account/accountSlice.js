import { createSlice } from "@reduxjs/toolkit";

//! initial Account state
const initialState = {
    balance: 0,
    loan: 0,
    loanPurpose: "",
    isLoading: false,
}

//! Account Slice creation
const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        deposit(state, action) {
            state.balance += action.payload;
            state.isLoading = false;
        },
        withdraw(state, action) {
            if (state.balance > 0) {
                state.balance -= action.payload;
            }
            else {
                alert(`Can't withdraw! Insufficient funds..🥲`)
            }
        },
        requestLoan: {
            prepare(amount, purpose) {
                return {
                    payload: { amount, purpose },
                }
            },
            reducer(state, action) {
                if (state.loan > 0) return;
                state.loan = action.payload.amount;
                state.loanPurpose = action.payload.purpose;
                state.balance = state.balance + action.payload.amount;
            }
        },
        payLoan(state) {
            //order matters here
            state.balance -= state.loan; //1
            state.loan = 0; //2
            state.loanPurpose = ""; //3

        },
        convertingCurrency(state) {
            state.isLoading = true;

        }
    },
});

//! Using action-creator for Async Task, for now
export function deposit(amount, currency) {
    if (currency === "USD") {
        return { type: "account/deposit", payload: amount };
    };
    return async function (dispatch, getState) {
        // API call
        dispatch({ type: "account/convertingCurrency" })
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`);
        const data = await res.json();
        const converted = data.rates.USD;
        // return action
        dispatch({ type: "account/deposit", payload: converted });
    }
}

//! Export them
export const { withdraw, requestLoan, payLoan } = accountSlice.actions;
export default accountSlice.reducer;
console.log(accountSlice);

