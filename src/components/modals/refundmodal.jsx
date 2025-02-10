import React from "react";
import ResponsiveModal from "../../components/utilitis/Modal.jsx";
import Icon from "../../media/icon/icons.jsx";

const RefundModal = ({ isOpen, onClose, merchantData }) => {
    const getTitle = () => "View More";

    const safeGetData = (key) => (merchantData && merchantData[key]) || "N/A";

    const getTransactionStatus = (transactionstatus) => {
        let iconName = "paid";
        let displayText = "Paid";
        let iconColor = "#339900";

        switch (transactionstatus?.toLowerCase()) {
            case "success":
                iconName = "check_circle";
                displayText = "Success";
                iconColor = "#339900";
                break;
            case "pending":
                iconName = "radio_button";
                displayText = "Pending";
                iconColor = "#0066FF";
                break;
            case "fail":
                iconName = "cancel";
                displayText = "Fail";
                iconColor = "#CC0000";
                break;
            default:
                iconName = "delete";
                displayText = "Draft";
                iconColor = "#339900";
                break;
        }

        return { iconName, displayText, iconColor };
    };


    const renderRow = (heading, value, isRow = false) => {
        return isRow ? (
            <div className="row-item">
                <h3 className="headings">{heading}</h3>
                <p className="details">{value}</p>
            </div>
        ) : (
            <div>
                <h3 className="headings">{heading}</h3>
                <p className="details">{value}</p>
            </div>
        );
    };

    const renderStatusRow = (heading, key) => {
        const { iconName, displayText, iconColor } = getTransactionStatus(safeGetData(key));
        return (
            <div>
                <h3 className="headings">{heading}</h3>
                <p className="details" style={{ color: "#00264C" }}>
                    <Icon name={iconName} color={iconColor} width={20} height={20}></Icon>{displayText}
                </p>
            </div>
        );
    };

    // Mapping over the merchant data sections
    const renderSection = (sectionTitle, fields, isStatus = false) => (
        <div className="row">
            <p className="head-row">{sectionTitle}</p>
            <div className="text-in-row">
                {fields.map((field, index) => (
                    <React.Fragment key={index}>
                        {isStatus
                            ? renderStatusRow(field.heading, field.key)
                            : renderRow(field.heading, safeGetData(field.key))}
                        {index < fields.length - 1 && <div className="sapration-line"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
    // Custom rendering for the "Details" section with left and right split
    const renderDetailsSection = () => {
        const fields = [
            { heading: "Customer Name", key: "customerName" },
            { heading: "Merchant Name", key: "merchantName" },
            { heading: "Acquire Name", key: "acquireName" },
            { heading: "Customer Email Id", key: "customerEmail" },
            { heading: "Transaction Date", key: "transactionDate" },
            { heading: "Card Number", key: "cardNumber" },
        ];

        return (
            <div className="row">
                <p className="head-row">Details</p>
                <div className="text-in-row">
                    <div className="left-side">
                        {fields.slice(0, 3).map((field, index) => (
                            <div key={index}>
                                {renderRow(field.heading, safeGetData(field.key), true)}
                            </div>
                        ))}
                    </div>
                    <div className="sapration-line"></div>
                    <div className="right-side">
                        {fields.slice(3).map((field, index) => (
                            <div key={index}>
                                {renderRow(field.heading, safeGetData(field.key), true)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            centered
            showDivider={true}
            title={getTitle()}
            overlay
            showbuttons={false}
        >
            <div className="modal-for-refund">
                {/* Transaction Details */}
                {renderSection("Id's", [
                    { heading: "Transaction ID", key: "transactionId" },
                    { heading: "Merchant TNX ID", key: "merchantTxnId" },
                    { heading: "Acquire ID", key: "acquireId" },
                ])}

                {/* Status Details */}
                {renderSection("Status", [
                    { heading: "Transaction Status", key: "transactionstatus" },
                    { heading: "Refund Status", key: "refundStatus" },
                ], true)}


                {/* Custom Details Section */}
                {renderDetailsSection()}

                {/* Amount Details */}
                <div className="row">
                    <div className="total-amount-row">
                        <h3 className="headings">Total Amount</h3>
                        <span className="total-amount-text">
                            <p className="numbers">{safeGetData("totalAmount")}</p>
                            <p className="currency">{safeGetData("currency")}</p>
                        </span>
                    </div>

                    <div className="total-amount-row refund-total">
                        <h3 className="headings">Refund Amount</h3>
                        <span className="total-amount-text ">
                            <p className="numbers p-for-refund color-gry">{safeGetData("refundAmount")}</p>
                            <p className="currency color-gry">{safeGetData("currency")}</p>
                        </span>
                    </div>
                </div>
            </div>
        </ResponsiveModal>
    );
};

export default RefundModal;
