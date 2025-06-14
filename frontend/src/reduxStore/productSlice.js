import { createSlice } from "@reduxjs/toolkit";
const productSlice=createSlice({
    name: 'product',
    initialState:{
        products:[],
        singleProduct:null
    },
    reducers:{
        setProducts:(state,action)=>{
            state.products=action.payload
        },
        setSingleProduct:(state,action)=>{
            state.singleProduct=action.payload
        }
    }
})

export default productSlice.reducer
export const {setProducts,setSingleProduct}=productSlice.actions