import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NavigateT = {
  openPage: string;
  loader: boolean;
};

const initialState: NavigateT = {
  openPage: "",
  loader: false,
};

const NavigateSlice = createSlice({
  name: "navigate",
  initialState,
  reducers: {
    navigationStart: (state) => {
      state.loader = true;
    },
    navigationSuccess: (state, action: PayloadAction<string>) => {
      state.openPage = action.payload;
      state.loader = false;
    },
    navigationComplete: (state) => {
      state.loader = false;
    },
  },
});

export const { navigationStart, navigationSuccess, navigationComplete } =
  NavigateSlice.actions;
export default NavigateSlice.reducer;
