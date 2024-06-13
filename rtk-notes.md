### Redux ToolKit 🟪

- recent recommendations/opinionated pattern
- installation - npm i @reduxjs/toolkit (namespace)
- Creating the store with RTK -

```js
//! redux store (src/store.js)
import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/account/accountSlice';
import customerReducer from './features/customers/customerSlice';

const store = configureStore({
	reducer: {
		account: accountReducer,
		customer: customerReducer,
	},
});

export default store;
```

### Creating the Account Slice 🏦

- import { createSlice } from "@reduxjs/toolkit";
- Advantages/Benefits of {createSlice}✌🏻:
  1️⃣. Automatically creates ACTION CREATORS from our reducers.
  2️⃣. Writing reducers becomes easier (nomore switch-cases & the default-case is handled automatically).
  3️⃣. We can mutate state inside our reducers ('immer', a library is used behind the scenes).

⚠️ Problem: The automatically created action-creators only accept 1 argument as PAYLOAD (limitation of RTK 🥺💔)

```js
requestLoan(state, action) {
            if (state.loan > 0) return;
            state.loan = action.payload.amount;
            state.loanPurpose = action.payload.purpose;
            state.balance = state.balance + action.payload.amount;
        },
/* loan: undefined, loanPurpose: undefined, balance: NaN */
```

💡Solution: Preparing the data before it reaches the reducer 😊💖

```js
 requestLoan: {
            prepare(amount, purpose) {
                return {
                    payload:{amount, purpose}
                }
             },
            reducer(state, action) {
                if (state.loan > 0) return;
                state.loan = action.payload.amount;
                state.loanPurpose = action.payload.purpose;
                state.balance = state.balance + action.payload.amount;
            }
        }
```

- The full Slice (without Thunk) 🍕 ↘️

```js
//! src/features/account/accountSlice.js
import { createSlice } from '@reduxjs/toolkit';

//! initial Account state
const initialState = {
	balance: 0,
	loan: 0,
	loanPurpose: '',
	isLoading: false,
};

//! Account Slice creation
const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		deposit(state, action) {
			state.balance += action.payload;
		},
		withdraw(state, action) {
			if (state.balance > 0) {
				state.balance -= action.payload;
			} else {
				alert(`Can't withdraw! Insufficient funds..🥲`);
			}
		},
		requestLoan: {
			prepare(amount, purpose) {
				return {
					payload: { amount, purpose },
				};
			},
			reducer(state, action) {
				if (state.loan > 0) return;
				state.loan = action.payload.amount;
				state.loanPurpose = action.payload.purpose;
				state.balance = state.balance + action.payload.amount;
			},
		},
		 payLoan(state) {
            //order matters here
            state.balance -= state.loan; //1
            state.loan = 0; //2
            state.loanPurpose = ""; //3
        },
	},
});

console.log(accountSlice);

//! Export them
export const { deposit, withdraw, requestLoan, payLoan } = accountSlice.actions;
export default accountSlice.reducer;
```
### Back to "Thunks", but with RTK📶
- Using Redux-Saga is an OVERKILL for this project, so, for now, we're using action-creators, the Vanilla Redux way (Just for now)
```js
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

// using action-creator for Async Task, for now
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
```
### Finally, Creating the Customer Slice 🍰

```js
import { createSlice } from "@reduxjs/toolkit";

//! Initial Customer State
const initialState = {
    fullName: "",
    nationalId: "",
    createdAt: "",
}

//! Customer Slice Creation
const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        updateCustomer(state, action) {
            state.fullName = action.payload;
        },
        createCustomer: {
            prepare(fullName, nationalId) {
                return {
                    // Always implement complex logic inside a prepare(), not inside the reducers
                    payload: { fullName, nationalId, createdAt: new Date().toISOString() }
                }
            },
            reducer(state, action) {
                state.fullName = action.payload.fullName;
                state.nationalId = action.payload.nationalId;
                state.createdAt = action.payload.createdAt;
            }

        }
    }
})

//! Exporting them
export const { createCustomer, updateCustomer } = customerSlice.actions;
export default customerSlice.reducer;

//console.log(createSlice);
```

