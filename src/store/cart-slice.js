import { createSlice } from "@reduxjs/toolkit";
import { uiSliceAction } from "./ui-slice";

const cartSliceInitialState = {
	items: [],
	totalQuantity: 0,
	changed: false,
};

const cartSlice = createSlice({
	name: "cart",
	initialState: cartSliceInitialState,
	reducers: {
		replaceCart(state, action) {
			state.totalQuantity = action.payload.totalQuantity;
			state.items = action.payload.items;
		},
		addItem(state, action) {
			const newItem = action.payload;
			const existingItem = state.items.find(item => item.id === newItem.id);
			state.totalQuantity++;
			state.changed = true;
			if (!existingItem) {
				state.items.push({
					id: newItem.id,
					title: newItem.title,
					price: newItem.price,
					quantity: 1,
					totalPrice: newItem.price,
				});
			} else {
				existingItem.quantity++;
				existingItem.totalPrice += newItem.price;
			}
		},
		removeItem(state, action) {
			const id = action.payload;
			const existingItem = state.items.find(item => item.id === id);
			state.totalQuantity--;
			state.changed = true;
			if (existingItem.quantity === 1) {
				state.items = state.items.filter(item => item.id !== id);
			} else {
				existingItem.quantity--;
				existingItem.totalPrice = existingItem.quantity * existingItem.price;
			}
		},
	},
});

export default cartSlice;
export const cartSliceAction = cartSlice.actions;

export const initialCartDataFetch = () => {
	return async dispatch => {
		const fetchData = async () => {
			const request = await fetch(
				"https://redux-side-effect-c849b-default-rtdb.firebaseio.com/cart.json"
			);

			if (!request.ok) throw new Error("Error initial cart fetch");

			const data = await request.json();

			return data;
		};
		fetchData()
			.then(data => {
				data &&
					dispatch(
						cartSlice.actions.replaceCart({
							items: data.items || [],
							totalQuantity: data.totalQuantity,
						})
					);
			})
			.catch(error =>
				dispatch(
					uiSliceAction.showNotification({
						status: "error",
						title: "Error!",
						message: error.message,
					})
				)
			);
	};
};
