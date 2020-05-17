import React, { Component } from "react";
import axios from "../../axios-order";
import { connect } from "react-redux";

import Aux from "../../hoc/Auxiliray/Auxiliray";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import ShowModal from "../../components/UI/Modal/ShowModal";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as burgerBuilderActions from "../../store/actions/index";

class BurgerBuilder extends Component {
  state = {
    modal: false,
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((ingKey) => {
        return ingredients[ingKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  };

  toggle = () => {
    if (this.props.isAuthenticated) {
      this.setState({ modal: !this.state.modal });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  purchaseContinueHandler = () => {
    this.props.onPurchaseInit();
    this.props.history.push("/checkout");
  };
  render() {
    const disabledInfo = {
      ...this.props.ings,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.props.error ? (
      <p>Failed to load ingredients from server</p>
    ) : (
      <Spinner />
    );
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            addIngredients={this.props.onAddIngredients}
            removeIngredients={this.props.onRemoveIngredients}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            isAuth={this.props.isAuthenticated}
            price={this.props.price}
            toggle={this.toggle}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          toggle={this.toggle}
          price={this.props.price}
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

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddIngredients: (ingName) =>
      dispatch(burgerBuilderActions.addIngredients(ingName)),
    onRemoveIngredients: (ingName) =>
      dispatch(burgerBuilderActions.removeIngredients(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
    onPurchaseInit: () => dispatch(burgerBuilderActions.purchaseInit()),
    onSetAuthRedirectPath: (path) =>
      dispatch(burgerBuilderActions.authRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
