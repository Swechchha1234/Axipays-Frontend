import React from "react";

import AxipaysLogoFailed from "../media/image/axipays-full-logo.webp";
import Failimg from "../media/image/Failimg.png";
import Alertimg from "../media/image/alertimg.gif";

import AxipaysLogoWhite from "../media/image/axipays-full-white-logo.jpg";
import paymentprocess from "../media/image/paymentprocess.gif";
import completepaymentgif from "../media/image/completeimg.gif";

const PaymentStatus = ({ status }) => {
  let content;

  switch (status) {
    case "failed":
      content = (
        <div className="payment-failed-container payment-form">
          <div className="logo-header">
            <img src={AxipaysLogoFailed} alt="Axipays Logo" className="logo" />
            <h2>Your Global Payment Processor</h2>
          </div>
          <div className="payment-form-modal-content">
            <div className="failpayment-image">
              <img src={Failimg} alt="Payment Failed Icon" className="failed-icon" />
              <img src={Alertimg} alt="Alert Icon" className="alertimg-gif" />
            </div>
            <h1 className="failed-text">YOUR PAYMENT FAILED!</h1>
            <p className="retry-text">Please Try Again</p>
          </div>
          <div className="payment-form-footer">
            <button className="go-back-button" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      );
      break;

    case "processing":
      content = (
        <div className="payment-process-container payment-form">
          <div className="logo-header">
            <img src={AxipaysLogoWhite} alt="Axipays Logo" className="logo" />
            <h2 className="tag-line">Your Global Payment Processor</h2>
          </div>
          <div className="payment-form-modal-content">
            <div className="failpayment-image">
              <img src={paymentprocess} alt="Processing Payment" className="success-gif" />
              <p className="tag-line">Processing Your Payment</p>
            </div>
          </div>
          <div className="payment-form-footer"></div>
        </div>
      );
      break;

    case "success":
      content = (
        <div className="payment-success-container payment-form">
          <div className="logo-header">
            <img src={AxipaysLogoWhite} alt="Axipays Logo" className="logo" />
            <h2 className="tag-line">Your Global Payment Processor</h2>
          </div>
          <div className="payment-form-modal-content">
            <div className="failpayment-image">
              <img src={completepaymentgif} alt="Payment Success" className="success-gif" />
            </div>
          </div>
          <div className="payment-form-footer">
            <button
              className="go-back-button backbtn-completepayment"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      );
      break;

    default:
      content = <p>Invalid payment status.</p>;
  }

  return (
    <div className="payment-form-container">
      <div className="payment-details">
        <div className="payment-form-head">
          <h3>Payment Details</h3>
          <p className="card-info-para">
            Please enter, review and confirm your payment information here.
          </p>
        </div>
        {content}
      </div>
    </div>
  );
};

export default PaymentStatus;
