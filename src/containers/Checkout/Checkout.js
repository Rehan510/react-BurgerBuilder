import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import ContactData from "./ContactData/ContactData";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
export class Checkout extends Component {
  checkoutCanclledHandler = () => {
    this.props.history.goBack();
  };
  checkoutCantinuedHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };
  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.props.ings}
          checkoutCanclled={this.checkoutCanclledHandler}
          checkoutCantinued={this.checkoutCantinuedHandler}
        />
        <Route
          path={this.props.match.path + "/contact-data"}
          component={ContactData}
        />
      </div>
    );
  }
}

const getStateToProps = (state) => {
  return {
    ings: state.ingredients,
  };
};

export default connect(getStateToProps)(Checkout);
