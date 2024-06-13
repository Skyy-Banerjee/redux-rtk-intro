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