import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "auth",
  initialState: {
    userData: {},
    cart: [],
    order: []
  },
  reducers: {
    loginAction: (state, action) => {
      return (state = {
        ...state,
        userData: action.payload,
      });
    },
    cartAction: (state, action) => {
      return (state = {
        ...state,
        cart: action.payload,
      });
    },
    orderAction: (state, action) => {
      return (state = {
        ...state,
        order: action.payload,
      });
    },
  },
});

export const { loginAction, cartAction, orderAction } = counterSlice.actions;

export const login = (data) => async (dispatch) => {
  try {
    dispatch(loginAction(data));
  } catch (error) {
    console.log(error)
  }
};
export const addToCart = (data) => async (dispatch) => {
  try {
    dispatch(cartAction(data));
  } catch (error) {
    console.log(error)
  }
};
export const orderProduct = (data) => async (dispatch) => {
  try {
    dispatch(orderAction(data));
  } catch (error) {
    console.log(error)
  }
};

export default counterSlice.reducer;
