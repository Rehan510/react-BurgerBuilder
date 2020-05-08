import React, { Component } from "react";
import axios from "../../axios-order";

import Aux from "../../hoc/Auxiliray/Auxiliray";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import { INGREDIENTS_PRICES } from "../../constants/IngredientPrices";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import ShowModal from "../../components/UI/Modal/ShowModal";
import Spinner from "../../components/UI/Spinner/Spinner";

export default class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      meat: 0,
      cheese: 0,
    },
    totalPrice: 20,
    purchasable: false,
    modal: false,
    loading: false,
  };

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
    const newPrice = oldPrice - priceDeduction;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
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
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Rashid Naveed",
        address: {
          street: "71-L, Johar town",
          zipCode: "54782",
          country: "Pakistan",
        },
        email: "chrashidnaveed95@gmail.com",
      },
      deliveryMethod: "fast service",
    };
    axios
      .post("/orders.json", order)
      .then((res) => this.setState({ loading: false, modal: false }))
      .catch((err) => this.setState({ loading: false, modal: false }));
  };
  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = (
      <OrderSummary
        ingredients={this.state.ingredients}
        toggle={this.toggle}
        price={this.state.totalPrice}
        order={this.purchaseContinueHandler}
      />
    );
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
  }
}
