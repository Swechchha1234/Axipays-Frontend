import React, { useState,useEffect } from "react";
import Icon from "../media/icon/icons";
import { Input } from "../components/utilitis/Input";
import mastercard from "../media/image/blank-master-card.png";
import axipayslogo from "../media/image/axipays-full-logo.webp";

import visa from "../media/image/visa.webp";
import unionpay from "../media/image/unionpay.webp";
import discover from "../media/image/discover.webp";
import amex from "../media/image/Amex.webp";
import rupay from "../media/image/RuPay.webp";
import jcb from "../media/image/jcb.webp";
import dinersclub from "../media/image/DinersClub.webp";
import sslcertificate from "../media/image/sslcertificate.webp";
import pcicertificate from "../media/image/pcicertificate.webp";
import secure from "../media/image/secure-hundred-percent.webp";

function PaymentDetails() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    contactNo: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    expiryyear: "",
    cvv: ""
  });
  const [cvvMasked, setCvvMasked] = useState(""); 
  const [showCvv, setShowCvv] = useState(true);

  useEffect(() => {
    if (!showCvv) {
      setCvvMasked("*".repeat(formData.cvv.length));
    }
  }, [showCvv, formData.cvv]);

  const handleCVVChange = (value) => {
    handleInputChange("cvv", value);

    setShowCvv(true);
    setCvvMasked(value);

    setTimeout(() => {
      setShowCvv(false);
    }, 500); 
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Construct a message to display the form data
    const formDetails = `
      First Name: ${formData.firstName}
      Last Name: ${formData.lastName}
      Email: ${formData.emailId}
      Contact Number: ${formData.contactNo}
      Card Number: ${formData.cardNumber}
      Card Holder: ${formData.cardHolder}
      Expiry Date: ${formData.expiryDate}/${formData.expiryyear}
      CVV: ${cvvMasked}
    `;
  
    // Show the success message with all the details
    alert("All details filled successfully:\n" + formDetails);
  };  

  const detectCardType = (cardNumber) => {
    const visaRegex = /^4/;
    const mastercardRegex = /^(5[1-5]|2[2-7])/;
    const amexRegex = /^3[47]/;
    const unionPayRegex = /^62/;
    const discoverRegex = /^(6011|622|64|65)/;
    const dinersClubRegex = /^(30|36|38)/;
    const jcbRegex = /^35/;
    const rupayRegex = /^(60|652)/;

    if (visaRegex.test(cardNumber)) {
      return "visa";
    } else if (mastercardRegex.test(cardNumber)) {
      return "mastercard";
    } else if (amexRegex.test(cardNumber)) {
      return "amex";
    } else if (unionPayRegex.test(cardNumber)) {
      return "unionpay";
    } else if (discoverRegex.test(cardNumber)) {
      return "discover";
    } else if (dinersClubRegex.test(cardNumber)) {
      return "dinersclub";
    } else if (jcbRegex.test(cardNumber)) {
      return "jcb";
    } else if (rupayRegex.test(cardNumber)) {
      return "rupay";
    } else {
      return "";
    }
  };

  const handleCardNumberChange = (value) => {
    const numericValue = value.replace(/\D/g, "");
    const cardType = detectCardType(numericValue);

    const formattedCardNumber = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    handleInputChange("cardNumber", formattedCardNumber.trim());

    handleInputChange("cardType", cardType);
  };

  const renderCardLogo = () => {
    if (!formData.cardType) {
      return <Icon name="card" width={20} height={20} className="card-icon" />;
    }

    switch (formData.cardType) {
      case "visa":
        return <div className="card-icon mastercardimg"> <img src={visa} alt="Visa" className="card-icon mastercardimg" /></div>;
      case "mastercard":
        return <div className="card-icon mastercardimg"><img src={mastercard} alt="MasterCard" className="card-icon mastercardimg" /></div>;
      case "amex":
        return <div className="card-icon mastercardimg"><img src={amex} alt="American Express" className="card-icon mastercardimg" /></div>;
      case "unionpay":
        return <div className="card-icon mastercardimg"><img src={unionpay} alt="UnionPay" className="card-icon mastercardimg" /></div>;
      case "discover":
        return <div className="card-icon mastercardimg"><img src={discover} alt="Discover" className="card-icon mastercardimg" /></div>;
      case "dinersclub":
        return <div className="card-icon mastercardimg"><img src={dinersclub} alt="Diners Club" className="card-icon mastercardimg" /></div>;
      case "jcb":
        return <div className="card-icon mastercardimg"><img src={jcb} alt="JCB" className="card-icon mastercardimg" /></div>;
      case "rupay":
        return <div className="card-icon mastercardimg"> <img src={rupay} alt="RuPay" className="card-icon mastercardimg" /></div>;
      default:
        return <Icon name="card" width={20} height={20} className="card-icon" />;
    }
  };

  return (
    <div className="payment-form-container">
      <div className="payment-details">
        <h3>Payment Details</h3>
        <p className="card-info-para">Please enter, review and confirm your payment information here.</p>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="top-logo">
            <img src={axipayslogo} alt="axipays logo" />
            <p>Your global payment processor</p>
          </div>
          <div className="customer-details">
            <h4 className="card-info-heading">Customer Details</h4>
            <div className="form-group">
              <Input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(value) =>
                  handleInputChange("firstName", value)
                }
                required
              />
              <Input
                type="text"
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(value) =>
                  handleInputChange("lastName", value)
                }
                required
              />
              <Input
                type="email"
                id="emailId"
                placeholder="Email Id"
                value={formData.emailId}
                onChange={(value) =>
                  handleInputChange("emailId", value)
                }
                required
              />
              <Input
                type="tel"
                id="contactNo"
                placeholder="Contact No."
                value={formData.contactNo}
                onChange={(value) =>
                  handleInputChange("contactNo", value)
                }
                required
              />
            </div>
          </div>
          <div>
            <h4 className="card-info-heading">Card Details</h4>
            <div className="card-info-div">
              <div className="card-info-details">
                <div>
                  <h4 className="card-info-head">Card Number</h4>
                  <p className="card-info-para">Enter 16-digit card number.</p>
                </div>
                <div className="card-number-input">
                  <Input
                    type="text"
                    id="cardnumber"
                    placeholder="Card No."
                    value={formData.cardNumber}
                    maxlength={19}
                    onChange={(value) => handleCardNumberChange(value)}
                    required
                  />
                  {renderCardLogo()}
                </div>

              </div>

              <div className="card-info-details">
                <div>
                  <h4 className="card-info-head">Card Holder</h4>
                  <p className="card-info-para">Enter name of the card holder.</p>
                </div>
                <div className="card-number-input card-holder-input">
                  <Input
                    type="text"
                    id="cardHolder"
                    placeholder="Card Holder Name"
                    value={formData.cardHolder}
                    onChange={(value) =>
                      handleInputChange("cardHolder", value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="card-info-details">
                <div className="card-details-container">
                  <div>
                    <h4 className="card-info-head">Expiry Date</h4>
                    <p className="card-info-para">Enter the expration date of the card.</p>
                  </div>
                  <div className="expiry-date-input">
                    <Input
                      type="text"
                      id="expiryDate"
                      placeholder="MM"
                      value={formData.expiryDate}
                      onChange={(value) =>
                        handleInputChange("expiryDate", value)
                      }
                      inputClass="expirymonth"
                      required
                    />
                    <span className="separator">/</span>
                    <Input
                      type="text"
                      placeholder="YY"
                      id="expiryDate"
                      value={formData.expiryyear}
                      onChange={(value) =>
                        handleInputChange("expiryyear", value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="card-details-container">
                  <div>
                    <h4 className="card-info-head">CVV</h4>
                    <p className="card-info-para">Security code</p>
                  </div>
                  <Input
                    type="text"
                    id="cvv"
                    maxlength={3}
                    value={cvvMasked}
                    onChange={(value) => handleCVVChange(value)}
                    required
                  />
                </div>
              </div>

            </div>
          </div>
          <div className="submit-btn">
            <button type="submit">Pay<Icon name="arrow_right_alt" width={20} height={20} color="#ffffff"></Icon></button>
          </div>
          <div className="certificates">
            <img src={pcicertificate} alt="pcicertificate" />
            <img src={secure} alt="secure" />
            <img src={sslcertificate} alt="sslcertificate" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentDetails;
