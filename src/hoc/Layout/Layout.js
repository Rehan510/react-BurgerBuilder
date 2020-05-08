import React, { Component } from "react";
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
        <Navigation drawerToggleClicked={this.sideDrawerToggleHandler} />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.sideDrawerCloseHandler}
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

export default Layout;
