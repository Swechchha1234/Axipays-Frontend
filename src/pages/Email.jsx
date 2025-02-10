import React, { useState, useRef } from "react";
import { apiRequest } from "../services/apiService";
import Button from "../components/utilitis/Button";

const EmailComponent = ({ children }) => {
    const UserId = sessionStorage.getItem('userId');
    const [isEditable, setIsEditable] = useState(false);
    const [editBoxVisible, setEditBoxVisible] = useState(false);
    const [editHref, setEditHref] = useState("");
    const [isSaved, setIsSaved] = useState(true);
    const [emailFields, setEmailFields] = useState({ fromEmail: "", toEmail: "", subject: "" });
    const [sections, setSections] = useState({ features: true, paymentPartner: true });
    const [deletedSections, setDeletedSections] = useState([]);
    const [selectedLink, setSelectedLink] = useState(null);

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
        if (isEditable) {
            event.preventDefault();
            setSelectedLink(link);
            setEditHref(link.getAttribute("href"));
            setEditBoxVisible(true);
        }
    };

    const closeEditBox = () => {
        setEditBoxVisible(false);
        setEditHref("");
    };

    const updateLinkHref = () => {
        if (selectedLink) {
            selectedLink.setAttribute("href", editHref.trim());
        }
        closeEditBox();
    };

    const deleteSection = (section) => {
        setSections((prevSections) => {
            const updatedSections = { ...prevSections, [section]: false };
            setDeletedSections((prevDeleted) => [...prevDeleted, section]);
            return updatedSections;
        });
    };

    const undoDelete = () => {
        if (deletedSections.length === 0) return;

        setSections((prevSections) => {
            const lastDeleted = deletedSections[deletedSections.length - 1];
            setDeletedSections((prevDeleted) => prevDeleted.slice(0, -1));
            return { ...prevSections, [lastDeleted]: true };
        });
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

                    .container-for-email {
                            padding-top: 10px;
                            border-radius: 8px;
                            display: flex;
                            flex-direction: row;
                            height: 90vh;
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
                            padding: 40px;
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

                        .email-container {
                            background-color: #f1f1f1;
                            padding: 20px;
                            border: 1px solid #888;
                            border-radius: 10px;
                        }

                        .em-header {
                            background-image: url("https://idox9w5.sufydely.com/rectangle.png");
                            background-size: cover;
                            background-position: center;
                            background-repeat: no-repeat;
                            display: flex;
                            align-items: center;
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

                        .experience-head .tag-line {
                            background-color: #00264C;
                            padding: 10px;
                            color: #f1f1f1;
                            margin: 3px auto;
                            width: fit-content;
                        }

                        .feature-container {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 20px;
                            border-radius: 20px;
                            background-color: black;
                            color: white;
                            position: relative;
                        }

                        .left-section {
                            flex: 1 1 200px;
                            padding: 20px;
                            background-image: url("https://idox9w5.sufydely.com/payment-processes.png");
                            background-size: 100% 100%;
                            aspect-ratio: 1;
                            background-position: center;
                            background-repeat: no-repeat;
                            border-radius: 10px 0 0 10px;
                            color: transparent;
                            text-align: left;
                            display: grid;
                            justify-content: space-between;
                        }

                        .left-section .subline {
                            font-size: 24px;
                            font-weight: 600;
                            color: transparent;
                        }

                        .left-section .subline2 {
                            font-size: 24px;
                            color: transparent;
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

                        .payment-partner-section {
                            position: relative;
                        }

                        .payment-partner {
                              background-image: url("https://idox9w5.sufydely.com/image.png");
                                background-size: contain;
                                background-color: #000;
                                background-position: center;
                                background-repeat: no-repeat;
                                justify-content: center;
                                border-radius: 10px;
                                padding: 90px;
                        }

                        .payment-partner div {
                            justify-content: center;
                            background: rgba(255, 255, 255, 0.1);
                            backdrop-filter: blur(10px);
                            -webkit-backdrop-filter: blur(10px);
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            border-radius: 12px;
                            padding: 20px;
                            text-align: center;
                            color: #ffffff;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)
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
                            cursor: pointer;
                        }

                        .footer p {
                            margin: 10px 0;
                        }

                        .footer a:hover {
                            text-decoration: underline;
                        }

                        .ptag{
                            color: #888;
                            font-size: 12px;
                            margin: -2px 0;
                        }

                        @media (max-width: 768px) {
                            .container-for-email {
                                display: grid;
                                width: 100%;
                            }

                            .email-container {
                                width: 100%;
                                padding: 10px;
                            }

                            .referral-header {
                                padding: 10px !important;
                            }

                            .referral-header .header-content {
                                display: grid;
                                justify-content: center;
                            }

                            .header-content h1,
                            .experience-section h2,
                            .feature h3,
                            .payment-partner h1,.referral-header .header-content h1  {
                                font-size: 1.5rem !important;
                            }

                            .feature-container {
                                display:grid;
                            }

                            .left-section {
                                text-align: center;
                                justify-content: center;
                                flex: 0 0 500px;
                                border-radius: 10px 10px 0 0;
                            }

                            .step h1 {
                                font-size: 14px;
                            }

                            .step h2 {
                                font-size: 14px;
                            }

                            .payment-partner{
                                padding: 20px;
                                background-size: cover;
                            }

                            .payment-partner-for-referral {
                                padding: 10px !important;
                            }

                            .feature p,
                            .payment-partner p, .payment-partner-for-referral p {
                                font-size: 0.7rem;
                            }

                            .left-section-for-referral{
                                text-align: center !important;
                                justify-content: center !important;
                            }
                        
                            .left-section-for-referral .subline {
                                font-size: 20px;
                                margin-top: 0;
                            }
                        
                            .left-section-for-referral.subline2 {
                                font-size: 16px;
                                margin-top: 0;
                            }
                        }

                        @media (min-width: 769px) {

                            .payment-partner h1 {
                                font-size: 1.5rem;
                            }

                            .payment-partner {
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
                user_id: parseInt(UserId),
            };

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

    return (
        <div className="container-for-email">
            <div className="input-section">
                <div className="em-input">
                    {['fromEmail', 'toEmail', 'subject'].map(field => (
                        <input
                            key={field}
                            type={field === 'subject' ? 'text' : 'email'}
                            placeholder={`${field.replace('Email', ' Email')}`}
                            name={field}
                            value={emailFields[field]}
                            onChange={handleEmailFieldChange}
                        />
                    ))}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <p className="ptag">There can be multiple recipients.</p>
                    <Button className="send-btn" onClick={handleSendEmail} backgroundcolor="#003366" size="medium">Send</Button>
                    <Button className="use-company-email-btn" onClick={() => setEmailFields(prev => ({ ...prev, fromEmail: "no.reply@axipays.io" }))} backgroundcolor="#003366" size="medium">
                        Send by Company mail
                    </Button>
                </div>
                <Button className="edit-btn" onClick={toggleEditableState}>{isEditable ? "Save" : "Edit"}</Button>
                {deletedSections.length > 0 && (
                    <Button onClick={undoDelete}>Undo</Button>
                )}
            </div>

            <div className="email-section" ref={emailContainerRef}
                contentEditable={isEditable}>
                <div className="email-container">
                    <div className={children ? "referral-header" : "em-header"}>
                        <div className="header-content">
                            <h1 id="email-heading">{children ? "Axipays Referral Programe" : "Welcome to Axipays"}</h1>
                            <p id="email-description">{children ? "Your Global Payment Processor" : "Redefining Payment Solutions"}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="experience-head">
                            {children ? (
                                <>
                                    <span>Earn More, Grow Together 🤝</span>
                                    <span class="tag-line-for-referral"> Unlock Endless Opportunities</span>
                                    <span>with the Axipays Referral Programme!</span></>
                            ) : (
                                <>
                                    <span>Experience</span>
                                    <span className="tag-line">Secure, Swift, and Flexible</span>
                                    <span>Payments</span>
                                </>
                            )}

                        </h2>
                        {sections.features && (
                            <div className="feature-container">
                                {isEditable && <button className="delete-btn" onClick={() => deleteSection("features")}>✖</button>}
                                {children ? (<>
                                    <div className="left-section-for-referral"> <h1>HOW IT WORKS!</h1> <p className="subline">EMPOWER.<br />REFER.<br />EARN.</p> <p className="subline2">Turn Referrals Into Rewards</p> </div>
                                    <div className="right-section">
                                        {[
                                            "Refer Merchants",
                                            "Earn Commissions",
                                            "Leverage Competitive MDR Rates",
                                            "Timely Benefits",
                                            "Referral Chain Model"
                                        ].map((title, index) => {
                                            const descriptions = [
                                                "Connect businesses with Axipays and introduce them to our tailored solutions.",
                                                "Benefit from flexible commission options, including Markup or Revenue Share.",
                                                <>Visa/Mastercard solutions starting at just <span className="highlight">3.5%</span> MDR.</>,
                                                "Enjoy on-time reports, transparent communication, and guaranteed payouts.",
                                                "Refer other partners and earn commissions as your network grows."
                                            ];

                                            return (
                                                <div className="step" key={index}>
                                                    <h1>0{index + 1}.</h1>
                                                    <h2>{title}</h2>
                                                    <p>{descriptions[index]}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                                ) : (
                                    <>
                                        <div className="left-section"> <h1>HOW IT WORKS!</h1> <p className="subline">EMPOWER.<br />REFER.<br />EARN.</p> <p className="subline2">Turn Referrals Into Rewards</p></div>
                                        <div className="right-section">
                                            {["Security First", "Speed and Flexibility", "Tailored Solutions"].map((title, index) => (
                                                <div className="step" key={index}>
                                                    <h1>0{index + 1}.</h1>
                                                    <h2>{title}</h2>
                                                    <p>{["State-of-the-art security to protect your transactions.", "Optimize your business with seamless payment flows.", "A referral model connecting businesses with the perfect PSPs."][index]}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                            </div>
                        )}
                    </div>
                    <div className="platform-section">
                        <p>
                            {children ?
                                "Join us in revolutionizing the payment landscape with our newly launched Referral Programme.This is your opportunity to connect merchants with Axipays' tailored payment solutions while earning commissions through transparent and rewarding models."
                                : "At Axipays, we understand the evolving needs of businesses in the digital economy. Whether you're a small enterprise or a large organization, our dynamic payment gateway is designed to simplify your transactions and fuel your growth."
                            }
                        </p>
                        {children ?
                            (<>
                                <strong>Why Partner with Axipays?</strong>
                                <p><strong>↗️ Visa/Mastercard Rates: Starting as low as 3.5% MDR.</strong></p>
                                <p><strong>↗️ Flexible Commission Options: Choose between Markup or Revenue Share models.</strong>
                                </p>
                                <p><strong>↗️ Transparency: Comprehensive and timely reports to track your earnings.</strong></p>
                                <p><strong>↗️ On-Time Payments: Your payouts, always on time.</strong></p>
                            </>
                            ) : (
                                <>
                                    <ul>
                                        <li><strong>Cutting-Edge Security:</strong> Advanced measures to keep your data and payments safe.</li>
                                        <li><strong>Faster Transactions:</strong> Minimized delays for smoother operations.</li>
                                        <li><strong>Flexible Integrations:</strong> Adaptable solutions tailored to your unique needs.</li>
                                        <li><strong>Innovative Referral Model:</strong> Helping businesses connect with the right payment service providers for a seamless experience.</li>
                                    </ul>
                                    <p>
                                        With Axipays, we don’t just process payments; we build trust, scalability, and success into every transaction.
                                    </p>
                                </>
                            )}
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
                            <div className={children ? "payment-partner-for-referral" : "payment-partner"}>
                                <div id="payment-partner">
                                    <h1>{children ? "Ready to Get Started?" : "Your Partner in Payment Excellence"}</h1>
                                    <p>{children ? "Unlock Rewards with Every Connection" : "Fostering collaboration, empowering businesses, and driving innovation."}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="label">
                        <p>The Axipays Team</p>
                        <div className="contacts">
                            <a href="https://axipays.com/">axipays.com</a> | <a href="mailto:info@axipays.io">info@axipays.io</a>
                        </div>
                    </div>
                </div>

                <div className="footer" contentEditable={isEditable}>
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
                    {editBoxVisible && (
                        <div
                            className="edit-box"
                            style={{
                                display: "block",
                            }}
                        >
                            <label>Edit Link URL:</label>
                            <input
                                type="text"
                                value={editHref}
                                onChange={(e) => setEditHref(e.target.value)}
                            />
                            <div>
                                <Button onClick={updateLinkHref}>Update</Button>
                                <Button onClick={closeEditBox}>Cancel</Button>
                            </div>
                        </div>
                    )}
                </div>

            </div>


        </div>
    );
};

export default EmailComponent;
