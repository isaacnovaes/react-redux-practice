import { useEffect } from "react";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";

import { useSelector, useDispatch } from "react-redux";
import { uiSliceAction } from "../src/store/ui-slice.js";
import { initialCartDataFetch } from "./store/cart-slice.js";

let isInitial = true;

function App() {
	const showCart = useSelector(state => state.ui.showCart);
	const cart = useSelector(state => state.cart);
	const notification = useSelector(state => state.ui.notification);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(initialCartDataFetch());
	}, [dispatch]);

	useEffect(() => {
		const sendCartData = async () => {
			dispatch(
				uiSliceAction.showNotification({
					status: "pending",
					title: "Sending",
					message: "Sending card data",
				})
			);
			const request = await fetch(
				"https://redux-side-effect-c849b-default-rtdb.firebaseio.com/cart.json",
				{
					method: "PUT",
					body: JSON.stringify({
						items: cart.items,
						totalQuantity: cart.totalQuantity,
					}),
				}
			);

			if (!request.ok) throw new Error("Http error while updating cart");

			dispatch(
				uiSliceAction.showNotification({
					status: "success",
					title: "Success",
					message: "Sent cart data successfully",
				})
			);
		};

		if (isInitial) {
			isInitial = false;
			return;
		}

		if (cart.changed) {
			sendCartData().catch(error =>
				dispatch(
					uiSliceAction.showNotification({
						status: "error",
						title: "Error!",
						message: error.message,
					})
				)
			);
		}
	}, [cart, dispatch]);

	return (
		<>
			{notification && (
				<Notification
					status={notification.status}
					title={notification.title}
					message={notification.message}
				/>
			)}

			<Layout>
				{showCart && <Cart />}
				<Products />
			</Layout>
		</>
	);
}

export default App;
