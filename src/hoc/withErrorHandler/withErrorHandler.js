import React, { Component } from "react";
import ShowModal from "../../components/UI/Modal/ShowModal";
// import Aux from "../Auxiliray/Auxiliray";
const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null,
      modal: false,
      errorMessage: "oops error...",
    };

    constructor(props) {
      super(props);
      this.reqInterceptors = axios.interceptors.request.use((req) => {
        this.setState({ error: null, modal: false });
        return req;
      });
      this.resInterceptors = axios.interceptors.response.use(
        (res) => res,
        (error) => {
          this.setState({ error: error, modal: true });
        }
      );
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptors);
      axios.interceptors.response.eject(this.resInterceptors);
    }
    errorConfirmHandler = () => {
      this.setState({ error: null, modal: false });
    };
    render() {
      return (
        <React.Fragment>
          <ShowModal
            modal={this.state.modal}
            toggle={this.errorConfirmHandler}
            title={this.state.errorMessage}
          >
            {this.state.error ? this.state.error.message : null}
          </ShowModal>
          <WrappedComponent {...this.props} />
        </React.Fragment>
      );
    }
  };
};
export default withErrorHandler;
