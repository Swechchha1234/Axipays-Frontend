import React, { useState } from "react";

import PaymentProcess from "./PaymentStatus";

import Icon from "../media/icon/icons";
import mastercard from "../media/image/blank-master-card.png";
import axipayslogo from "../media/image/axipays-full-logo.png";

import visa from "../media/image/visa.webp";
import unionpay from "../media/image/unionpay.webp";
import discover from "../media/image/discover.webp";
import amex from "../media/image/Amex.webp";
import rupay from "../media/image/RuPay.webp";
import jcb from "../media/image/jcb.webp";
import dinersclub from "../media/image/DinersClub.webp";
import secure from "../media/image/certificates.png";
import Modal from "../components/utilitis/Modal";

function PaymentDetails() {
	const [currentPage, setCurrentPage] = useState("form");
	const [ModalOpen, setModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		amount: "",
		currencyCode: "",
		cardNumber: "",
		expiryMonth: "",
		expiryyear: "",
		cardCVC: "",
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		cardHolder: "",
	});

	const [, setErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		cardNumber: "",
		cardHolder: "",
		expiryMonth: "",
		expiryyear: "",
		cardCVC: ""
	});

	const handleInputChange = (field, value) => {
		if (field === "cardNumber") {
			const cardType = detectCardType(value);

			setFormData((prevFields) => ({
				...prevFields,
				cardNumber: value,
				cardType: cardType,
			}));
		} else {
			setFormData((prevFields) => ({
				...prevFields,
				[field]: value,
			}));
		}

		validateField(field, value);
	};

	const validateField = (field, value) => {
		let errorMessage = "";
		switch (field) {
			case "firstName":
			case "lastName":
				if (!value) errorMessage = `${field} is required`;
				break;
			case "email":
				if (!value) errorMessage = "Email is required";
				else if (!/\S+@\S+\.\S+/.test(value)) errorMessage = "Email is invalid";
				break;
			case "phone":
				if (!value) errorMessage = "Contact number is required";
				else if (!/^\d{10}$/.test(value)) errorMessage = "Contact number must be 10 digits";
				break;
			case "cardNumber":
				if (!value) errorMessage = "Card number is required";
				else if (!/^\d{16}$/.test(value.replace(/\D/g, ""))) errorMessage = "Card number must be 16 digits";
				break;
			case "cardHolder":
				if (!value) errorMessage = "Card holder name is required";
				break;
			case "expiryMonth":
			case "expiryyear":
				if (!value) errorMessage = "Expiry date is required";
				break;
			case "cardCVC":
				if (!value) errorMessage = "cardCVC is required";
				break;
			default:
				break;
		}

		setErrors((prevErrors) => ({
			...prevErrors,
			[field]: errorMessage,
		}));
	};

	const handleSubmit = async () => {
		setCurrentPage("processing");
		try {
			console.log("formData", formData)
			// Transform the data into the required format
			const payload = {
				transactionId: "CBS-Test78",
				callbackURL: "https://api.vancipay.com/api/v1/axipays/callbackurl",
				paymentDetails: {
					amount: formData.amount,
					currencyCode: formData.currencyCode,
					method: "Card",
					cardDetails: {
						cardNumber: formData.cardNumber,
						expiryMonth: formData.expiryMonth,
						expiryYear: formData.expiryyear,
						cardCVC: formData.cardCVC,
					}
				},
				billingDetails: {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					phone: formData.phone,
					address: {
						addressLine1: "Mkt Street 1",
						addressLine2: "Mkt Street 2",
						city: "san francisco",
						state: "CA",
						postalCode: "94105",
						countryCode: "US"
					}
				}
			};

			console.log("submit", payload);
			const response = await fetch(
				"https://api.vancipay.com/api/v1/initiate_transaction?method=iframe",
				{
					method: "POST",
					headers: {
						"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6MTA1LCJjbGllbnROYW1lIjoiQXhpcGF5c1Rlc3QifQ.1xPQxo7PHPSAZQniTB7dRooko6YaFT7qhyASxZq-cYw",
						"api-secret": "secret_xFoPVGA6Wh1G9duovVAFcHZbUssagH/aaw==",
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
					// mode: "no-cors"
				}
			);

			const data = await response.json();
			console.log("response", response);

			const redirectURL = data["data"]["redirect_url"]
			window.location.href = redirectURL;
		} catch (error) {
			console.error("Error initiating transaction:", error);

		}
	}; // Include status in dependency array

	if (currentPage === "processing") return <PaymentProcess status="processing" />;
	if (currentPage === "success") return <PaymentProcess status="success" />;
	if (currentPage === "failed") return <PaymentProcess status="failed" />;

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

	const openModal = () => {
		setModalOpen(true);
	}

	const onClose = () => {
		setModalOpen(false);
	}

	return true ? (
		<>
			<Modal
				isOpen={ModalOpen}
				onClose={onClose}
				centered
				title="Set Mid"
				modalbuttonCancel="forgot-button-back"
				overlay
				modalbuttonConfirm="forgot-password-button"
				iconName="arrow_right_alt"
				iconColor="#ffffff"
				// onConfirm={}
			>
				<div className="showmids">
					<div ><h4>Current Mid</h4>  <p>Mid</p></div>
					<div className="aviliablemids">
					<h4>Aviliable Mids</h4>
					<Icon name="keyboard_arrow_down" width={20} height={20} color="#00264c"></Icon>
					</div>
				</div>

			</Modal>
			<div className="payment-form-container">
				<div className="payment-details">
					<div className="payment-form-head">
						<h3 className="payment-details-heading">Payment Details</h3>
						<p className="card-info-para">Please enter, review and confirm your payment information here.</p>
					</div>

					<form onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}} className="payment-form">
						<div className="top-logo">
							<img src={axipayslogo} alt="axipays logo" />
							<p>Your global payment processor</p>
						</div>
						<div className="set-mid-in-paymnt" onClick={openModal}>
							<Icon name="settings" width={20} height={20} color="#888"></Icon>
						</div>
						<div className="customer-details">
							<h4 className="card-info-heading">Customer Details</h4>
							<div className="form-group">
								<input
									type="text"
									id="firstName"
									placeholder="First Name"
									value={formData.firstName}
									onChange={(e) => handleInputChange("firstName", e.target.value)}
									required
								/>
								<input
									type="text"
									id="lastName"
									placeholder="Last Name"
									value={formData.lastName}
									onChange={(e) =>
										handleInputChange("lastName", e.target.value)
									}
									required
								/>
								<input
									type="email"
									id="email"
									placeholder="Email Id"
									value={formData.email}
									onChange={(e) =>
										handleInputChange("email", e.target.value)
									}
									required
								/>
								<input
									type="tel"
									id="phone"
									placeholder="Contact No."
									value={formData.phone}
									onChange={(e) =>
										handleInputChange("phone", e.target.value)
									}
									required
								/>
								<input
									type="amount"
									id="amount"
									placeholder="Amount"
									value={formData.amount}
									onChange={(e) =>
										handleInputChange("amount", e.target.value)
									}
									required
								/>
								<input
									type="currencyCode"
									id="currencyCode"
									placeholder="Currency"
									value={formData.currencyCode}
									onChange={(e) =>
										handleInputChange("currencyCode", e.target.value)
									}
									required
								/>
							</div>
						</div>
						<div className="customer-details">
							<h4 className="card-info-heading">Card Details</h4>
							<div className="card-info-div">
								<div className="card-info-details">
									<div>
										<h4 className="card-info-head">Card Holder</h4>
										<p className="card-info-para">Enter name of the card holder.</p>
									</div>
									<div className="card-number-input card-holder-input">
										<input
											type="text"
											id="cardHolder"
											placeholder="Card Holder Name"
											value={formData.cardHolder}
											onChange={(e) =>
												handleInputChange("cardHolder", e.target.value)
											}
											required
										/>
									</div>
								</div>

								<div className="card-info-details">
									<div>
										<h4 className="card-info-head">Card Number</h4>
										<p className="card-info-para">Enter 16-digit card number.</p>
									</div>
									<div className="card-number-input">
										<input
											type="text"
											id="cardNumber"
											placeholder="Card No."
											value={formData.cardNumber}
											maxlength={19}
											onChange={(e) =>
												handleInputChange("cardNumber", e.target.value)
											}
											required
										/>
										{renderCardLogo()}
									</div>

								</div>

								<div className="card-info-details expirycard-div">
									<div className="card-details-container">
										<div>
											<h4 className="card-info-head">Expiry Date</h4>
											<p className="card-info-para">Enter the expration date of the card.</p>
										</div>
										<div className="expiry-date-input">
											<input
												type="text"
												id="expiryMonth"
												placeholder="MM"
												value={formData.expiryMonth}
												onChange={(e) =>
													handleInputChange("expiryMonth", e.target.value)
												}
												className="expirymonth"
												required
											/>
											<span className="separator">/</span>
											<input
												type="text"
												placeholder="YYYY"
												id="expiryMonth"
												value={formData.expiryyear}
												onChange={(e) =>
													handleInputChange("expiryyear", e.target.value)
												}
												required
											/>
										</div>
									</div>

									<div className="card-details-container">
										<div>
											<h4 className="card-info-head">cardCVC</h4>
											<p className="card-info-para">Security code</p>
										</div>
										<input
											type="text"
											id="cardCVC"
											maxlength={3}
											value={formData.cardCVC}
											onChange={(e) =>
												handleInputChange("cardCVC", e.target.value)
											}
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
							<img src={secure} alt="secure" />
						</div>
					</form>
				</div>
			</div>
		</>
	) : null;
}

export default PaymentDetails;