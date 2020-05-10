import React, { Component } from "react";
import axios from "../../axios-order";

import Aux from "../../hoc/Auxiliray/Auxiliray";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import { INGREDIENTS_PRICES } from "../../constants/IngredientPrices";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import ShowModal from "../../components/UI/Modal/ShowModal";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 20,
    purchasable: false,
    modal: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    axios
      .get("https://react-my-burger-e3301.firebaseio.com/ingredients.json")
      .then((res) => {
        // console.log(res);

        this.setState({ ingredients: res.data });
        // this.updatePurchaseState(this.state.ingredients);
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount === 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    if (this.state.totalPrice > 20) {
      const newPrice = oldPrice - priceDeduction;
      this.setState({ totalPrice: newPrice });
    }
    this.setState({ ingredients: updatedIngredients });

    this.updatePurchaseState(updatedIngredients);
  };

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((ingKey) => {
        return ingredients[ingKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchasable: sum > 0 });
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  purchaseContinueHandler = () => {
    // this.setState({ loading: true });
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: "Rashid Naveed",
    //     address: {
    //       street: "71-L, Johar town",
    //       zipCode: "54782",
    //       country: "Pakistan",
    //     },
    //     email: "chrashidnaveed95@gmail.com",
    //   },
    //   deliveryMethod: "fast service",
    // };
    // axios
    //   .post("/orders.json", order)
    //   .then((res) => {
    //     console.log(res);
    //     this.setState({ loading: false, modal: false });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.setState({ loading: false, modal: false });
    //   });
    this.props.history.push("/checkout");
  };
  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.state.error ? (
      <p>Failed to load ingredients from server</p>
    ) : (
      <Spinner />
    );
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            addIngredients={this.addIngredientHandler}
            removeIngredients={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchasable={this.state.purchasable}
            toggle={this.toggle}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          toggle={this.toggle}
          price={this.state.totalPrice}
          order={this.purchaseContinueHandler}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }
    return (
      <Aux>
        <ShowModal
          title="Order Summary"
          toggle={this.toggle}
          modal={this.state.modal}
        >
          {orderSummary}
        </ShowModal>
        {burger}
      </Aux>
    );
  }
}
export default withErrorHandler(BurgerBuilder, axios);
