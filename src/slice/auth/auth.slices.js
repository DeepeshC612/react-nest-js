import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "auth",
  initialState: {
    tokenRedux: "",
  },
  reducers: {
    loginAction: (state, action) => {
      return (state = {
        ...state,
        tokenRedux: action.payload,
      });
    },
  },
});

export const { loginAction } = counterSlice.actions;

export const login = (data) => async (dispatch) => {
  try {
    dispatch(loginAction(data));
  } catch (error) {
    console.log(error)
  }
};

export default counterSlice.reducer;
