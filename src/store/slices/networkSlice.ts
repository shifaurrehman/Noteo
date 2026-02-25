import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface NetworkState {
  isConnected: boolean | null;
  isInitialCheckDone: boolean;
}
const initialState: NetworkState = {
  isConnected: true,
  isInitialCheckDone: false,
};
const networkSlice = createSlice({
  name: "network",
  initialState: initialState,
  reducers: {
    setNetworkState: (state, action: PayloadAction<boolean | null>) => {
      state.isConnected = action.payload;
      state.isInitialCheckDone = true;
    },
  },
});

export const { setNetworkState } = networkSlice.actions;
export default networkSlice.reducer;