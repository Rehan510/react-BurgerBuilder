import React, { Component, Suspense } from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
const ContactData = React.lazy(() => import("./ContactData/ContactData"));
export class Checkout extends Component {
  checkoutCanclledHandler = () => {
    this.props.history.goBack();
  };
  checkoutCantinuedHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };
  render() {
    let summary = <Redirect to="/" />;
    if (this.props.ings) {
      const purchasedRedirect = this.props.purchased ? (
        <Redirect to="/" />
      ) : null;
      summary = (
        <React.Fragment>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ings}
            checkoutCanclled={this.checkoutCanclledHandler}
            checkoutCantinued={this.checkoutCantinuedHandler}
          />
          <Route
            path={this.props.match.path + "/contact-data"}
            render={() => (
              <Suspense fallback={<div>Loading...</div>}>
                <ContactData />
              </Suspense>
            )}
          />
        </React.Fragment>
      );
    }
    return <div>{summary}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
  };
};

export default withRouter(connect(mapStateToProps)(Checkout));
