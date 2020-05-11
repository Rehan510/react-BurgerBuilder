import React, { Component } from "react";
import classes from "./ContactData.module.css";
import axios from "../../../axios-order";
import { Button } from "reactstrap";
import Spinner from "../../../components/UI/Spinner/Spinner";

export class ContactData extends Component {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: "",
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
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
      .then((res) => {
        console.log(res);
        this.setState({ loading: false });
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };
  render() {
    let form = (
      <form>
        <input
          className={classes.Input}
          type="text"
          name="name"
          placeholder=" Your Name"
        />
        <input
          className={classes.Input}
          type="email"
          name="email"
          placeholder=" Your Email"
        />
        <input
          className={classes.Input}
          type="text"
          name="street"
          placeholder=" Your Street"
        />
        <input
          className={classes.Input}
          type="text"
          name="postalcode"
          placeholder="Your PostalCode"
        />
        <br />
        <Button outline color="success" onClick={this.orderHandler}>
          ORDER NOW
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
