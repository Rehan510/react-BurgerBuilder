import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as logoutAction from "../../../store/actions/index";

export class Logout extends Component {
  componentDidMount() {
    this.props.onLogout();
  }
  render() {
    return <Redirect to="/" />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logoutAction.logout()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
