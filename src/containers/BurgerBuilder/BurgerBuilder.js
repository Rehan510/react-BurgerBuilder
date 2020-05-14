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
import * as actionType from "../../store/action";

class BurgerBuilder extends Component {
  state = {
    modal: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    // axios
    //   .get("https://react-my-burger-e3301.firebaseio.com/ingredients.json")
    //   .then((res) => {
    //     // console.log(res);
    //     this.setState({ ingredients: res.data });
    //     // this.updatePurchaseState(this.state.ingredients);
    //   })
    //   .catch((error) => {
    //     this.setState({ error: true });
    //   });
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
    this.setState({ modal: !this.state.modal });
  };

  purchaseContinueHandler = () => {
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
    let burger = this.state.error ? (
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
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ings)}
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
    ings: state.ingredients,
    price: state.totalPrice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddIngredients: (ingName) =>
      dispatch({ type: actionType.ADD_INGREDIENT, ingredientName: ingName }),
    onRemoveIngredients: (ingName) =>
      dispatch({ type: actionType.REMOVE_INGREDIENT, ingredientName: ingName }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
