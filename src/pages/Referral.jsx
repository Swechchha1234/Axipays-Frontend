import React, { useState, useRef } from "react";
import { apiRequest } from "../services/apiService";
import Button from "../components/utilitis/Button";

const ReferralComponent = () => {
    const [isEditable, setIsEditable] = useState(false);
    const [editBoxVisible, setEditBoxVisible] = useState(false);
    const [editHref, setEditHref] = useState("");
    const [isSaved, setIsSaved] = useState(true);
    const [editBoxPosition, setEditBoxPosition] = useState({ top: 0, left: 0 });
    const [emailFields, setEmailFields] = useState({
        fromEmail: "",
        toEmail: "",
        subject: "",
    });
    const [sections, setSections] = useState({
        features: true,
        paymentPartner: true,
    });

    const emailContainerRef = useRef(null);
    const [error, setError] = useState("");

    const toggleEditableState = () => {
        setIsEditable((prevState) => !prevState);
        if (isEditable) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    };

    const openEditBox = (event, link) => {
        event.preventDefault();
        setEditHref(link.getAttribute("href"));
        setEditBoxPosition({ top: event.clientY + 10, left: event.clientX + 10 });
        setEditBoxVisible(true);
    };

    const closeEditBox = () => {
        setEditBoxVisible(false);
        setEditHref("");
    };

    const updateLinkHref = () => {
        const activeLink = document.querySelector(`a[href="${editHref}"]`);
        if (activeLink) {
            activeLink.setAttribute("href", editHref.trim());
        }
        closeEditBox();
    };

    const deleteSection = (section) => {
        setSections((prevSections) => ({
            ...prevSections,
            [section]: false,
        }));
    };

    const handleSendEmail = async () => {
        if (!isSaved) {
            alert("Please save your changes first.");
            return;
        }

        if (!emailFields.fromEmail) {
            setError("Please fill in the From Email.");
            return;
        }

        const emailHTML = emailContainerRef.current.innerHTML;
        const emailContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Axipays</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 5px;
    overflow-y: auto;
}

 .container-for-email{
    padding: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    gap: 5%;
}

.email-container {
    background-color: #f1f1f1;
    padding: 20px;
    border: 1px solid #888;
    border-radius: 10px;
}

.header-content {
    text-align: left;
    margin: 40px;
    color: #ffffff;
}

.header-content h1 {
    font-size: 2rem;
}

.experience-head {
    text-align: center;
    padding: 25px;
    color: #00264C;
    display: grid;
    justify-content: center;
}

.feature-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    border-radius: 20px;
    background-color: black;
    color: white;
}

.referral-header {
    background-image: url("https://idox9w5.sufydely.com/referalaxipays.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 10px;
    padding: 30px;
    text-align: center;
}

.referral-header .header-content {
    text-align: center;
}

.referral-header .header-content h1 {
    font-size: 2.5rem;
}

.tag-line-for-referral {
    background-image: url("https://idox9w5.sufydely.com/lineimage.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 10px;
    color: #f1f1f1;
    width: fit-content;
    margin: 3px auto;
}

.left-section-for-referral {
    flex: 1 1 100px;
    padding: 20px;
    background-image: url("https://idox9w5.sufydely.com/referalfeature.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: white;
    text-align: left;
    border-radius: 10px;
    display: grid;
    justify-content: space-between;
}

.left-section-for-referral .subline {
    font-size: 24px;
    font-weight: 600;
}

.left-section-for-referral .subline2 {
    font-size: 24px;
}

.highlight {
    color: #ff3b3b;
    font-weight: bold;
    font-size: 1.5rem;
}

.payment-partner-for-referral {
    background-image: url("https://idox9w5.sufydely.com/referalimg.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    justify-content: center;
    border-radius: 10px;
    padding: 70px;
}

.payment-partner-for-referral div {
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    color: #ffffff;
    margin: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)
}

.right-section {
    flex: 2 1 300px;
    display: grid;
    gap: 20px;
    padding: 20px;
}

.right-section .step {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #888;
    align-items: flex-start;
    padding: 15px 0;
    justify-content: space-between;
}

.step h1 {
    font-size: 16px;
    margin-right: 5px;
}

.step h2 {
    font-size: 16px;
    flex-shrink: 0;
    width: 35%;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 15ch;
    margin-right: 8px;
}

.step p {
    font-size: 14px;
    color: #E5E5E5;
    flex-grow: 1;
}

.platform-section {
    text-align: left;
    padding: 20px;
}

.platform-section ul {
    margin: 10px 0;
    list-style: disc;
    margin-left: 20px;
}

.platform-section li {
    margin: 10px 0;
}

.label {
    text-align: center;
    margin: 20px;
}

.label p,
.footer-line {
    color: #888;
}

.contacts {
    margin-top: 5px;
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 10px;
    justify-content: center;
}

.contacts a {
    color: #01172E;
    text-decoration: none;
}

.footer {
    text-align: center;
    font-size: 0.9rem;
    margin-top: 20px;
}

.footer a {
    color: #002966;
    text-decoration: none;
}

.footer p {
    margin: 10px 0;
}

.footer a:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .container-for-email {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .input-section {
        width: 100%;
        margin-bottom: 10px;
    }

    .email-container {
        width: 100%;
        padding: 10px;
    }

    .header-content h1,
    .experience-section h2,
    .feature h3,
    .payment-partner-for-referral h1 {
        font-size: 0.8rem;
    }

    .feature-container {
    display:grid;
        flex-direction: column;
    }

   .left-section-for-referral {
       text-align: center;
       justify-content: center;
    }

   .left-section-for-referral .subline {
      font-size: 20px;
      margin-top: 0;
    }

    .left-section-for-referral.subline2 {
      font-size: 16px;
      margin-top: 0;
    }

    .step h1 {
        font-size: 14px;
    }

    .step h2 {
        font-size: 14px;
    }

    .payment-partner-for-referral{
        padding: 40px;
    }

    .feature p,
    .payment-partner-for-referral p {
        font-size: 0.7rem;
    }
}

@media (min-width: 769px) {
    .payment-partner-for-referral h1 {
        font-size: 1.5rem;
    }

    .payment-partner-for-referral{
        padding: 50px;
    }
}
        </style>
    </head>
    <body>
            <div>
                ${emailHTML}
            </div>
    </body>
    </html>`;

        const emailData = {
            from_email: emailFields.fromEmail || "from@example.com",
            to_email: emailFields.toEmail || "to@example.com",
            subject: emailFields.subject || "Test Subject",
            body: emailContent,
            user_id: 8,
        };

        console.log("emaildata", emailData);

        try {
            const response = await apiRequest("api/v1/utility/send_portal_email", "POST", emailData);
            if (response.status === "success") {
                alert("Email sent successfully");
            } else {
                alert("Failed to send email");
            }
        } catch (error) {
            alert("Error sending email");
            console.error("Error sending email:", error);
        }
    };

    const handleEmailFieldChange = (e) => {
        const { name, value } = e.target;
        setEmailFields({
            ...emailFields,
            [name]: value,
        });

        if (name === "fromEmail" && value) {
            setError("");
        }
    };

    const handleUseCompanyEmail = () => {
        setEmailFields({
            ...emailFields,
            fromEmail: "no.reply@axipays.io",
        });
    };

    return (
        <div className="container-for-email">
            <div className="input-section">
                <div className="em-input">
                    <input
                        type="email"
                        placeholder="From Email"
                        name="fromEmail"
                        value={emailFields.fromEmail}
                        onChange={handleEmailFieldChange}
                    />
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <input
                        type="email"
                        placeholder="To Email"
                        name="toEmail"
                        value={emailFields.toEmail}
                        onChange={handleEmailFieldChange}
                    />
                     <p className="ptag">There can be multiple recipients.</p>
                    <input
                        type="text"
                        placeholder="Subject"
                        name="subject"
                        value={emailFields.subject}
                        onChange={handleEmailFieldChange}
                    />
                    <Button className="send-btn" onClick={handleSendEmail}>Send</Button>
                    <Button className="use-company-email-btn" onClick={handleUseCompanyEmail}>
                        Send by Company mail
                    </Button>
                </div>
                <Button className="edit-btn" onClick={toggleEditableState}>
                    {isEditable ? "Save" : "Edit"}
                </Button>
            </div>

            <div className="email-section" ref={emailContainerRef} contentEditable={isEditable}>
                <div className="email-container">
                    <div className="referral-header">
                        <div className="header-content">
                            <h1 id="email-heading">Axipays Referral Programe</h1>
                            <p id="email-description">Your Global Payment Processor</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="experience-head">
                            <span>Earn More, Grow Together 🤝</span>
                            <span class="tag-line-for-referral"> Unlock Endless Opportunities</span>
                            <span>with the Axipays Referral Programme!</span>
                        </h2>
                        {sections.features && (
                            <div className="feature-container">
                                {isEditable && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteSection("features")}
                                    >
                                        ✖
                                    </button>
                                )}
                                <div className="left-section-for-referral">
                                    <h1>HOW IT WORKS!</h1>
                                    <p className="subline">EMPOWER.<br />REFER.<br />EARN.</p>
                                    <p className="subline2">Turn Referrals Into Rewards</p>
                                </div>
                                <div className="right-section">
                                    <div class="step">
                                        <h1>01.</h1>
                                        <h2> Refer Merchants</h2>
                                        <p>Connect businesses with Axipays and introduce them to our tailored solutions.</p>
                                    </div>
                                    <div class="step">
                                        <h1>02. </h1>
                                        <h2>Earn Commissions</h2>
                                        <p>Benefit from flexible commission options, including Markup or Revenue Share.</p>
                                    </div>
                                    <div class="step">
                                        <h1>03. </h1>
                                        <h2>Leverage Competitive MDR Rates</h2>
                                        <p>Visa/Mastercard solutions starting at just <span class="highlight">3.5%</span> MDR.
                                        </p>
                                    </div>
                                    <div class="step">
                                        <h1>04.</h1>
                                        <h2> Timely Benefits</h2>
                                        <p>Enjoy on-time reports, transparent communication, and guaranteed payouts.</p>
                                    </div>
                                    <div class="step">
                                        <h1>05.</h1>
                                        <h2> Referral Chain Model</h2>
                                        <p>Refer other partners and earn commissions as your network grows.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="platform-section">
                        <p>
                            Join us in revolutionizing the payment landscape with our newly launched Referral Programme.
                            This is
                            your opportunity to connect merchants with Axipays' tailored payment solutions while earning
                            commissions through transparent and rewarding models.
                        </p>
                        <strong>Why Partner with Axipays?</strong>
                        <p><strong>↗️ Visa/Mastercard Rates: Starting as low as 3.5% MDR.</strong></p>
                        <p><strong>↗️ Flexible Commission Options: Choose between Markup or Revenue Share models.</strong>
                        </p>
                        <p><strong>↗️ Transparency: Comprehensive and timely reports to track your earnings.</strong></p>
                        <p><strong>↗️ On-Time Payments: Your payouts, always on time.</strong></p>
                    </div>
                    {sections.paymentPartner && (
                        <div className="payment-partner-section">
                            {isEditable && (
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteSection("paymentPartner")}
                                >
                                    ✖
                                </button>
                            )}
                            <div className="payment-partner-for-referral">
                                <div id="payment-partner">
                                    <h1>Ready to Get Started?</h1>
                                    <p>Unlock Rewards with Every Connection</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="label">
                        <p>The Axipays Team</p>
                        <div class="contacts"><a href="https://axipays.com/">axipays.com</a> | <a
                            href="mailto:info@axipays.com">info@axipays.com</a>
                        </div>
                    </div>
                </div>

                <div className="footer">
                    <div className="footer-links">
                        <p>
                            Stay in touch with your team from anywhere.
                            <a
                                href="https://axipays.com/"
                                className="editable-link"
                                onClick={(e) => openEditBox(e, e.target)}
                            >
                                Visit Website Link
                            </a>
                        </p>
                        {/* <p>
                            <a href="https://axipays.com/" className="editable-link" onClick={(e) => openEditBox(e, e.target)}>Skype</a> |
                            <a href="https://axipays.com/" className="editable-link" onClick={(e) => openEditBox(e, e.target)}>Telegram</a> |
                            <a href="https://www.linkedin.com/company/axipays/" className="editable-link" onClick={(e) => openEditBox(e, e.target)}>LinkedIn</a>
                        </p>
                        <p>
                            <a href="https://axipays.com/" className="editable-link" onClick={(e) => openEditBox(e, e.target)}>Unsubscribe from Axipays</a>
                        </p> */}
                    </div>
                </div>
            </div>

            {editBoxVisible && (
                <div
                    className="edit-box"
                    style={{
                        display: "block",
                        position: "absolute",
                        top: editBoxPosition.top,
                        left: editBoxPosition.left,
                    }}
                >
                    <label>Edit Link URL:</label>
                    <input
                        type="text"
                        value={editHref}
                        onChange={(e) => setEditHref(e.target.value)}
                    />
                    <button onClick={updateLinkHref}>Update</button>
                    <button onClick={closeEditBox}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ReferralComponent;
