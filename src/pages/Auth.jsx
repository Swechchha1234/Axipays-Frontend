import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// icons
import Icon from "../media/icon/icons";

// icon-images
import Company_Logo_short from "../media/image/companyLogo_short.webp";
import LoginLine from "../media/image/login-line.png";

// css
import "../styles/pages.css";

// components
import Button from "../components/utilitis/Button.jsx";
import Input from "../components/utilitis/InputField.jsx";
import LoginAnimation from "../components/AuthAnimation.jsx";
import Loader from "../components/utilitis/Loader.jsx";
import ModalForAuth from "../components/modals/modalforauth.jsx";
import Errorbox from "../components/utilitis/ErrorBox.jsx";


import { login, signup } from "../services/authService";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [activePage, setActivePage] = useState("login");
  const [hasSwitched, setHasSwitched] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    create: false,
    confirm: false,
    login: false,
  });

  const [errorIcon, setErrorIcon] = useState(null);
  const [errors, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [fields, setFields] = useState({});
  const [, setValidationErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const formParam = new URLSearchParams(location.search).get("form");
    const newPage = formParam === "signup" ? "signup" : "login";

    setActivePage(newPage);
    setHasSwitched(newPage);
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
    if (value !== "" && submitted) {
      setSubmitted(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handlePageSwitch = (page) => {
    if (page !== activePage) {
      setActivePage(page);
      navigate(`/auth?form=${page}`);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
  
    setError("");
    setErrorIcon("");
  
    const { email, password } = fields;
  
    if (!email || !password) {
      setError("Please fill in all fields");
      setErrorIcon("fail");
      return;
    }
    setLoading(true);
    try {
     await login(email, password);
      setLoading(false);
      
      navigate("/home");
    } catch (err) {
      setLoading(false);
      setError("Wrong password or invalid credentials.");
      setErrorIcon("fail");
    }
  };
  
  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();

    setSubmitted(true);

    const requiredFields = [
      "name",
      "useremail",
      "country",
      "contact",
      "companyName",
      "companyURL",
      "povID",
      "new_password",
      "new_confirm",
    ];

    let newErrors = {};
    let formIsValid = true;

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        newErrors[field] = "This field is required";
        formIsValid = false;
      }
    });

    if (!termsAccepted) {
      setError("Please accept the privacy policy and terms");
      setErrorIcon("fail"); 
      return;
    }

    if (!formIsValid) {
      setValidationErrors(newErrors);
      return;
    }

    const {
      name,
      useremail,
      country,
      contact,
      companyName,
      companyURL,
      povID,
      new_password,
      new_confirm,
    } = fields;

    if (new_password !== new_confirm) {
      setError("Passwords do not match");
      setErrorIcon("fail"); 
      return;
    }

    setLoading(true);

    const userDetails = {
      name,
      email: useremail,
      company_name: companyName,
      company_url: companyURL,
      phone_no: contact,
      country,
      telegram_id: povID,
      password: new_password,
    };

    try {
      await signup(userDetails);
      setLoading(false);
      setFields({
        name: "",
        useremail: "",
        country: "",
        contact: "",
        companyName: "",
        companyURL: "",
        povID: "",
        new_password: "",
        new_confirm: "",
      });
      setModalType("signup");
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const openForgetPasswordModal = () => {
    setModalType("forgetpassword")
    setIsModalOpen(true);
  };

  const openPrivacyPolicy = () => {
    setModalType("terms&policy")
    setIsModalOpen(true);
  };

  const closeForgetPasswordModal = () => {
    setIsModalOpen(false);
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      if (!value.trim()) {
        setError((prev) => ({ ...prev, email: "Email is required." }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError((prev) => ({ ...prev, email: "Invalid email format." }));
      }
    }

    if (name === "useremail") {
      if (!value.trim()) {
        setError((prev) => ({ ...prev, useremail: "Email is required." }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError((prev) => ({ ...prev, email: "Invalid email format." }));
      }
    }

    if (name === "name" && !value.trim()) {
      setError((prev) => ({ ...prev, name: "Name is required." }));
    }

    if (name === "new_password" && !value.trim()) {
      setError((prev) => ({ ...prev, new_password: "Fill Password" }));
    }

    if (name === "new_confirm" && !value.trim()) {
      setError((prev) => ({ ...prev, new_confirm: "Fill Password" }));
    }

    if (name === "country" && !value.trim()) {
      setError((prev) => ({ ...prev, country: "Country name is required." }));
    }

    if (name === "povID" && !value.trim()) {
      setError((prev) => ({ ...prev, povID: "Telegram/Skype Id required." }));
    }

    if (name === "companyName" && !value.trim()) {
      setError((prev) => ({ ...prev, companyName: "Company name is required." }));
    }

    if (name === "companyURL" && !value.trim()) {
      setError((prev) => ({ ...prev, companyURL: "Company URL is required." }));
    }

    if (name === "contact" && !value.trim()) {
      setError((prev) => ({ ...prev, contact: "Contact is required." }));
    }
  };

  return (
    <div className="body">
      {errors && errors.length > 0 && (
        <Errorbox
          title={errors}
          iconStatus={errorIcon}
        />
      )}
      <ModalForAuth
        isOpen={isModalOpen}
        onClose={closeForgetPasswordModal}
        defaultEmail={fields.email}
        modalType={modalType}
      />
      <div className="login-page">
        <div className="wrap">
          <div className="login-left">
            <div className="container">
              <Link to="https://axipays.com" className="authBackBtn">
                <div className="backBtn-label">
                  <div>
                    <Icon
                      name="arrow_left"
                      width={20}
                      height={20}
                      color="#0066ff"
                      className="back-icon"
                    />
                  </div>
                  <p>Back</p>
                </div>
              </Link>
              <div className="login-left-header">
                <img src={Company_Logo_short} alt="company logo" />
                <h2>
                  Welcome to <i>Axipays</i>
                </h2>
                <p>Your Gateway to Effortless Management.</p>
              </div>
              <div className="login-left-body">
                <LoginAnimation />
              </div>
              <div className="login-left-footer">
                <p className="firstLine">Seamless Collaboration</p>
                <img src={LoginLine} alt="login line" />
                <p className="lastLine">
                  Effortlessly work together with your team in real-time.
                </p>
              </div>
            </div>
          </div>

          <div className="login-right">
            <div className="auth-form">
              <div className="form-container">
                <div
                  className={`auth-pages ${activePage === "signup" ? "signup-active" : "login-active"
                    } ${hasSwitched ? "with-animation" : ""}`}
                >
                  <button
                    onClick={() => handlePageSwitch("login")}
                    className={activePage === "login" ? "auth-active" : ""}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handlePageSwitch("signup")}
                    className={activePage === "signup" ? "auth-active" : ""}
                  >
                    Sign up
                  </button>
                </div>

                <div className="auth-form-container">
                  <div
                    className={`form-wrapper ${activePage === "login" ? "auth-active" : "inactive"
                      }`}
                  >
                    <form className="login-form">
                      <span>
                        <div className="input-group">
                          <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={fields.email}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.email}
                          />
                        </div>
                        <div className="input-group input-password">
                          <Input
                            type={
                              passwordVisibility.login ? "text" : "password"
                            }
                            label="Password"
                            name="password"
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.password}
                            value={fields.password || ""}
                          />
                          {fields.password && (
                            <span
                              className="password-icon"
                              onClick={() => togglePasswordVisibility("login")}
                            >
                              {passwordVisibility.login ? (
                                <Icon
                                  name="visibility_hide"
                                  width={18}
                                  height={18}
                                  color="#dedddd"
                                />
                              ) : (
                                <Icon
                                  name="show"
                                  width={18}
                                  height={18}
                                  color="#dedddd"
                                />
                              )}
                            </span>
                          )}
                        </div>
                      </span>
                      <label className="forgotpassword-link" onClick={openForgetPasswordModal}>
                        Forgot Password?
                      </label>
                      <Button
                        className="auth_btn"
                        type="submit"
                        backgroundcolor="#007bff"
                        size="large"
                        textColor="#ffffff"
                        onClick={handleLogin}
                      >
                        <span>Log In</span>
                        {loading ? (
                          <Loader
                            strokeColor="#fafafa"
                            width={20}
                            height={20}
                          />
                        ) : (
                          <>
                            <Icon
                              name="auth_btn_right_arrow"
                              width={20}
                              height={20}
                              color="#ffffff"
                            />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>

                  {/* Signup form */}
                  <div
                    className={`form-wrapper ${activePage === "signup" ? "auth-active" : "inactive"
                      }`}
                  >
                    <form className="signup-form">
                      <div>
                        <div className="input-group">
                          <Input
                            type="text"
                            label="Name"
                            name="name"
                            placeholder="Name"
                            value={fields.name}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.name}
                          />
                        </div>
                        <div className="input-group">
                          <Input
                            type="email"
                            label="Email"
                            placeholder="Email"
                            name="useremail"
                            value={fields.useremail}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.useremail}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="input-group">
                          <Input
                            type="text"
                            label="Country"
                            name="country"
                            placeholder="Country"
                            value={fields.country}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.country}
                          />
                        </div>
                        <div className="input-group">
                          <Input
                            type="text"
                            placeholder="Contact No."
                            label="Contact"
                            name="contact"
                            value={fields.contact}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.contact}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="input-group">
                          <Input
                            type="text"
                            placeholder="Company Name"
                            label="Company Name"
                            name="companyName"
                            value={fields.companyName}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.companyName}
                          />
                        </div>
                        <div className="input-group">
                          <Input
                            type="text"
                            placeholder="Company URL"
                            label="Company URL"
                            name="companyURL"
                            value={fields.companyURL}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.companyURL}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="input-group">
                          <Input
                            type="text"
                            placeholder="Skype/Telegram"
                            label="Skype/Telegram"
                            name="povID"
                            value={fields.povID}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.povID}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="input-group input-password">
                          <Input
                            type={
                              passwordVisibility.create ? "text" : "password"
                            }
                            placeholder="Create Password"
                            label="Create Password"
                            name="new_password"
                            value={fields.new_password}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.new_password}
                          />
                          {fields.new_password && (
                            <span
                              className="password-icon"
                              onClick={() => togglePasswordVisibility("create")}
                            >
                              {passwordVisibility.create ? (
                                <Icon
                                  name="visibility_hide"
                                  width={18}
                                  height={18}
                                  color="#dedddd"
                                />
                              ) : (
                                <Icon
                                  name="show"
                                  width={18}
                                  height={18}
                                  color="#dedddd"
                                />
                              )}
                            </span>
                          )}
                        </div>
                        <div className="input-group input-password">
                          <Input
                            type={
                              passwordVisibility.confirm ? "text" : "password"
                            }
                            placeholder="Confirm Password"
                            label="Confirm Password"
                            name="new_confirm"
                            value={fields.new_confirm}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            required
                            errorMessage={errors.new_confirm}
                          />
                          {fields.new_confirm && (
                            <span
                              className="password-icon"
                              onClick={() => togglePasswordVisibility("confirm")}
                            >
                              {passwordVisibility.confirm ? (
                                <Icon
                                  name="visibility_hide"
                                  width={18}
                                  height={18}
                                  color="#dedddd"
                                />
                              ) : (
                                <Icon
                                  name="show"
                                  width={18}
                                  height={18}
                                  color="#dedddd"
                                />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="termspolicy">
                        <Input
                          type="checkbox"
                          id="type-checkbox"
                          onChange={() => setTermsAccepted(!termsAccepted)}
                          required={true}
                        />
                        <span>
                          I agree to <i onClick={openPrivacyPolicy}>privacy policy and terms</i>
                        </span>
                      </div>
                      <Button
                        className="auth_btn signup_btn"
                        backgroundcolor="#007bff"
                        size="large"
                        textColor="#ffffff"
                        onClick={handleSignup}
                      >
                        Sign Up
                        {loading ? (
                          <Loader
                            strokeColor="#fafafa"
                            width={20}
                            height={20}
                          />
                        ) : (
                          <>
                            <Icon
                              name="auth_btn_right_arrow"
                              width={20}
                              height={20}
                              color="#ffffff"
                            />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
