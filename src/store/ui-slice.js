import { createSlice } from "@reduxjs/toolkit";

const uiSliceInitialState = {
	showCart: false,
	notification: null,
};

const uiSlice = createSlice({
	name: "ui",
	initialState: uiSliceInitialState,
	reducers: {
		toggleShowCart(state) {
			state.showCart = !state.showCart;
		},
		showNotification(state, action) {
			state.notification = {
				status: action.payload.status,
				title: action.payload.title,
				message: action.payload.message,
			};
		},
	},
});

export default uiSlice;
export const uiSliceAction = uiSlice.actions;
