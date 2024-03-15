import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "auth",
  initialState: {
    userData: {},
    cartData: []
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
        cartData: action.payload,
      });
    },
  },
});

export const { loginAction, cartAction } = counterSlice.actions;

export const login = (data) => async (dispatch) => {
  try {
    dispatch(loginAction(data));
  } catch (error) {
    console.log(error)
  }
};
export const cartListAdd = (data) => async (dispatch) => {
  try {
    dispatch(cartAction(data));
  } catch (error) {
    console.log(error)
  }
};

export default counterSlice.reducer;
