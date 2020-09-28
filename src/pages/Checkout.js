import React from 'react';
import { CartContext } from "../context/cart";
import { UserContext } from "../context/user";
import { useHistory } from "react-router-dom";
import EmptyCart from "../components/Cart/EmptyCart";
import submitOrder from "../strapi/submitOrder";
import Loading from '../components/Loading'
import {loadStripe} from '@stripe/stripe-js';
import {CardElement,Elements,useStripe, useElements,
    ElementsConsumer} from '@stripe/react-stripe-js';

function Checkout (props) {
    const { user, showAlert, hideAlert, alert } = React.useContext(UserContext);    
    const { cart, total, clearCart } = React.useContext(CartContext);
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const isEmpty = !name || alert.show;
    const elements = useElements();
    const stripe = useStripe();
    const history = useHistory();

    async function handleSubmit(e) {
        showAlert({ msg: "submitting order... please wait" });
        e.preventDefault();
        if (!stripe || !elements) {
            return <Loading/>;
        }
        const cardElement = elements.getElement(CardElement);

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: name,
            }
        });

        if (error) {
            console.log('[error]', error);

            hideAlert();
            setError(error);
        } else {
            setError("");

            const id = paymentMethod.id;
            let order = await submitOrder({
                name: name,
                total: total,
                items: cart,
                stripeTokenId: id,
                userToken: user.token
            });
            if (order) {
                showAlert({ msg: "your order is complete" });
                clearCart();
                history.push("/");
                return;
            } else {
                showAlert({
                    msg: "there was an error with your order. please try again!",
                    type: "danger"
                });
            }
        }
    };

    if (cart.length < 1) return <EmptyCart />;

    return (
        <section className="section form">
            <h2 className="section-title">checkout</h2>
            <form className="checkout-form">
                <h3>
                    order total : <span>${total}</span>
                </h3>
                {/* single input */}
                <div className="form-control">
                    <label htmlFor="name">name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => {
                            setName(e.target.value);
                        }}
                    />
                </div>
                {/* end of single input */}
                {/* card element */}
                <div className="stripe-input">
                    <label htmlFor="card-element">Credit or Debit Cart</label>
                    <p className="stripe-info">
                    Test using this credit card : <span>4242 4242 4242 4242</span>
                    <br />
                    enter any 5 digits for the zip code
                    <br />
                    enter any 3 digits for the CVC
                    </p>
                </div>
                {/* end of card element */}
                {/* STRIPE ELEMENTS */}
                <CardElement className="card-element"></CardElement>
                {/* stripe errors */}
                {error && <p className="form-empty">{error.messag}</p>}
                {/* empty value */}
                {isEmpty ? (
                    <p className="form-empty">please fill out name field</p>
                ) : (
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn btn-primary btn-block"
                    >submit
                    </button>
                )}
            </form>
        </section>
    );
}

const InjectedCheckout = () => {
  return (
    <ElementsConsumer>
      {({elements, stripe}) => (
        <Checkout elements={elements} stripe={stripe} />
      )}
    </ElementsConsumer>
  );
};

const stripePromise = loadStripe('pk_test_51HO1OADzQxak2KKrKE6cVy83jS2LHjJB3ooIKik8b8Vnhwy5VpFfNaslkQ69mKn0xo9L4BPjhqRcmveQuveF7fU200dBcNh7L0');
const StripeWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <InjectedCheckout/>
    </Elements>
  );
};
export default StripeWrapper;