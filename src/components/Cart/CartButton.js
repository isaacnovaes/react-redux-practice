import classes from "./CartButton.module.css";
import { useDispatch, useSelector } from "react-redux";
import { uiSliceAction } from "../../store/ui-slice";

const CartButton = props => {
	const dispatch = useDispatch();
	const itemsQuantity = useSelector(state => state.cart.totalQuantity);

	const toggleCartHandler = () => dispatch(uiSliceAction.toggleShowCart());

	return (
		<button className={classes.button} onClick={toggleCartHandler}>
			<span>My Cart</span>
			<span className={classes.badge}>{itemsQuantity}</span>
		</button>
	);
};

export default CartButton;
