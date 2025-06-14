import { createSlice } from "@reduxjs/toolkit";
const orderSlice=createSlice({
    name:"order",
    initialState:{
        orders:[],
        singleOrder:null
    },
    reducers:{
        setOrders:(state,action)=>{
            state.orders=action.payload
        },
        setSingleOrder:(state,action)=>{
            state.singleOrder=action.payload
        }
    }
})

export const {setOrders,setSingleOrder}=orderSlice.actions
export default orderSlice.reducer