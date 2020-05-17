import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../Auxiliray/Auxiliray";
import Navigation from "../../components/UI/Navigation/Navigation";
import SideDrawer from "../../components/UI/Navigation/SideDrawer/SideDrawer";

class Layout extends Component {
  state = {
    showSideDrawer: false,
  };

  sideDrawerCloseHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };
  render() {
    return (
      <Aux>
        <Navigation
          drawerToggleClicked={this.sideDrawerToggleHandler}
          isAuth={this.props.isAuthenticated}
        />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.sideDrawerCloseHandler}
          isAuth={this.props.isAuthenticated}
        />
        <main
          style={{
            marginTop: 72,
          }}
        >
          {this.props.children}
        </main>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
