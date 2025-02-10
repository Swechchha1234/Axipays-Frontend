import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/apiService";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Icon from "../media/icon/icons";
import Heading, { headings } from "../components/utilitis/Heading.jsx";
import Skeleton from "../components/Skeleton.jsx";

import UserProfile from "../media/image/UserProfile.png";
import Settlementimage from "../media/image/settlementimage.webp";
import TransactionTable from "../components/Table";
import Button from "../components/utilitis/Button";
import ButtonAnimation from "../components/Animation/ButtonsAnimation";
import GaugeChart from "../components/Charts/GaugeChart.jsx";
import VolumeGraph from "../components/Charts/VolumeGrapgh.jsx";

function ViewMerchant() {
    const currentYear = new Date().getFullYear();
    const role = localStorage.getItem("role");
    const [activeTab, setActiveTab] = useState("Business Details");
    const [merchant, setMerchant] = useState(null);
    const [, setErrorMessage] = useState("");
    // const [apiKeyVisible, setApiKeyVisible] = useState(false);
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [changedFields, setChangedFields] = useState({});
    const [status, setStatus] = useState("");

    const [editableFields, setEditableFields] = useState({
        aboutInfo: [
            // { label: "Client ID", value: "N/A", id: "client_ref_id" },
            { label: "Website URL", value: "N/A", id: "website_url" },
            { label: "Industry", value: "N/A", id: "business_type" },
        ],
        contactInfo: [
            { label: "Phone No.", value: "N/A", id: "phone_no" },
            { label: "Email ID", value: "N/A", id: "email" },
            { label: "Skype ID", value: "N/A", id: "skype_id" },
        ],
        businessInfo: [
            { label: "Business Type", value: "N/A", id: "business_type" },
            { label: "Business Category", value: "N/A", id: "business_category" },
            { label: "Card Type", value: "N/A", id: "card_type" },
            { label: "Registered On", value: "N/A", id: "business_registration_date" },
            { label: "Industries ID", value: "N/A", id: "industries_id" },
            { label: "Pay In", value: "N/A", id: "client_payin" },
            { label: "Pay Out", value: "N/A", id: "client_payout" },
            { label: "Settlement Charge", value: "N/A", id: "payment_method" },
            { label: "Turnover", value: "N/A", id: "turnover" },
            { label: "Expected Chargeback Percentage", value: "N/A", id: "ex_chargeback_percentage" },
        ],
        addressInfo: [
            { label: "Country", value: "N/A", id: "country" },
            { label: "State", value: "N/A", id: "state" },
            { label: "City", value: "N/A", id: "city" },
            { label: "Street Address 1", value: "N/A", id: "company_address1" },
            { label: "Street Address 2", value: "N/A", id: "company_address2" },
        ],
        // directorInfo: [
        //     { label: "First Name", value: "", id: "first_name" },
        //     { label: "Last Name", value: "", id: "last_name" },
        // ]
    });

    const [headerLabels] = useState([
        { heading: "S.No", label: "sno" },
        { heading: "Charging Items", label: "chargingitems" },
        { heading: "Charging Rate/ Amount", label: "amount" },
        { heading: "Remark", label: "remark" },
    ]);

    const [searchResults] = useState([
        { sno: "1", chargingitems: "MDR", amount: "0%", remark: "" },
        { sno: "2", chargingitems: "Transaction Approved", amount: "$ 0", remark: "" },
        { sno: "3", chargingitems: "Transactions Declined", amount: "$ 0", remark: "" },
        { sno: "4", chargingitems: "Rolling Reserve", amount: "0%", remark: "" },
        { sno: "5", chargingitems: "Settlement Charge", amount: "0%", remark: "" }
    ]);

    const tabs = [
        { name: "Business Details", icon: "building" },
        { name: "Rates", icon: "rates" },
        { name: "Settlements", icon: "checkbook" },
        { name: "Secrets", icon: "secrets" },
        { name: "MIDs", icon: "recenter" },
    ];

    const renderEditableFields = (section) =>
        editableFields[section].map((field) => (
            <div key={field.id} className="business-info-details1">
                <div className="business-info-left">
                    <p>{field.label}</p>
                </div>
                <div className="business-info-right">
                    {isEditable ? (
                        <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleInputChange(section, field.id, e.target.value)}
                            className="edit-input-field"
                        />
                    ) : (
                        <p>{field.value}</p>
                    )}
                </div>
            </div>
        ));

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    // const toggleApiKeyVisibility = () => {
    //     setApiKeyVisible(!apiKeyVisible);
    // };

    const handleCopy = (value, index) => {
        navigator.clipboard.writeText(value);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleInputChange = (section, id, value) => {
        const updatedFields = { ...editableFields };
        const fieldIndex = updatedFields[section].findIndex((field) => field.id === id);
        if (fieldIndex > -1) {
            updatedFields[section][fieldIndex].value = value;
            setEditableFields(updatedFields);
            setChangedFields((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    };

    useEffect(() => {
        const fetchMerchant = async () => {
            const apiEndpoint = `api/v1/client/${userId}`;
            setLoading(true);
            try {
                const response = await apiRequest(apiEndpoint, "GET");
                if (response && response.data) {
                    setMerchant(response.data);
                    setStatus(response.data.status);
                    populateEditableFields(response.data);
                    setErrorMessage("");
                } else {
                    setErrorMessage("No merchants found.");
                }
            } catch (error) {
                setErrorMessage("Failed to fetch merchants. Please try again.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchMerchant();
    }, [userId]);

    const populateEditableFields = (data) => {
        const updatedFields = { ...editableFields };
        Object.keys(updatedFields).forEach((section) => {
            updatedFields[section] = updatedFields[section].map((field) => ({
                ...field,
                value: data[field.id] || "",
            }));
        });
        setEditableFields(updatedFields);
    };

    const statusClass =
        status === "Active"
            ? "status-success"
            : status === "Inactive"
                ? "status-failed"
                : status === "Pending" ? "status-pending" : "status-pending";

    const handleEditClick = async () => {
        if (isEditable) {
            await handleUpdate();
        } else {
            setIsEditable(true);
        }
    };

    const handleUpdate = async () => {
        if (Object.keys(changedFields).length === 0) {
            // console.log("No fields have been changed.");
            setIsEditable(false);
            return;
        }
    
        try {
            // console.log("Starting handleUpdate with changedFields:", changedFields);
    
            const formattedFields = { ...changedFields };
            const arrayFields = [
                "currencies",
                "payment_method",
                "primary_regions",
                "primary_client",
                "traffic_type",
            ];
    
            arrayFields.forEach((field) => {
                if (formattedFields[field] && !Array.isArray(formattedFields[field])) {
                    // console.log(`Converting field ${field} to an array:`, formattedFields[field]);
                    formattedFields[field] = [formattedFields[field]];
                }
            });
    
            if (formattedFields["card_type"]) {
                const cardTypeValue = formattedFields["card_type"];
                // console.log("Processing card_type value:", cardTypeValue);
    
                formattedFields["processing_cards"] =
                    typeof cardTypeValue === "string"
                        ? cardTypeValue.split(/\s+/).map((card) => card.trim())
                        : Array.isArray(cardTypeValue)
                            ? cardTypeValue.flatMap((item) =>
                                typeof item === "string" ? item.split(/\s+/).map((card) => card.trim()) : item
                            )
                            : [];
    
                // console.log("Formatted processing_cards:", formattedFields["processing_cards"]);
                delete formattedFields["card_type"];
            }
    
            const apiEndpoint = `api/v1/client?clientId=${userId}`;
            // console.log("API Endpoint:", apiEndpoint);
            // console.log("Formatted fields for update:", formattedFields);
    
            const response = await apiRequest(apiEndpoint, "PATCH", formattedFields);
            // console.log("API Response:", response);
    
            if (response && response.success) {
                // console.log("Update successful. Clearing changedFields and setting editable to false.");
                setChangedFields({});
                setIsEditable(false);
            } else {
                // console.error("API responded with an error or no success:", response);
            }
        } catch (error) {
            // console.error("Error updating merchant data:", error);
        } finally {
            // console.log("Resetting isEditable to false.");
            setIsEditable(false);
        }
    };
    

    const handleStatusToggle = async () => {
        const newStatus = status === "Active" ? "Inactive" : "Active";
        try {
            const apiEndpoint = `api/v1/client/update?clientId=${userId}`;
            const response = await apiRequest(apiEndpoint, "PATCH", { status: newStatus });
            if (response && response.success) {
                setStatus(newStatus);
                setIsEditable(false);
            }
        } catch (error) {
        }
        finally {
            setIsEditable(false);
            setStatus(newStatus);
        }
    };

    return (
        <>
            <Header />
            <Sidebar />
            {loading ? (
                <div className="main-screen">
                    <Skeleton />
                </div>
            ) : (
                <div className="main-screen">
                    <Heading heading={headings.vmerchant} />
                    <div className="viewmerchant-row1">
                        <div className="viewmerchant-card1">
                            <p className="profile-title">Profile Details</p>

                            <div className="merchant-intro">
                                <div className="profile-image" >
                                    <img src={UserProfile} alt="ProfilePicture" />
                                </div>
                                <div className="merchant-status-name">
                                    <p className="company-name">{merchant?.client_name}</p>
                                    <div className={`status-column ${statusClass}`}>
                                        <div className={`bullet ${statusClass}`}></div>{status ? `${status}` : "Not_Assigned."}
                                    </div>
                                </div>
                            </div>
                            {role === 'client' ? (<div className="profile-buttons">
                            </div>) : (<div className="profile-buttons">
                                <div className="vm-root">
                                    <span className="checkbox"></span>
                                    <p>Make it as Root?</p>
                                </div>
                                {merchant?.role === "client" ? null : (
                                    <Button
                                        size="medium"
                                        backgroundcolor="transparent"
                                        border="#ff3333"
                                        textColor="#ff3333"
                                        className="vm-btn"
                                        onClick={handleStatusToggle}
                                    >
                                        {status === "Active" ? "Suspend" : "Activate"}
                                    </Button>
                                )}
                            </div>)}

                            <div className="profile-details-bottom">
                                <div className="profile-info">
                                    <div>
                                        <p className="business-info-p">About</p>
                                        {renderEditableFields("aboutInfo")}
                                    </div>
                                    <div>
                                        <p className="business-info-p">Contact Info</p>
                                        {renderEditableFields("contactInfo")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="viewmerchant-row2">
                            <div className="viewmerchant-card2">
                                <p className="profile-title">Overview</p>
                                <div className="overview-details">
                                    <div className="vm-chart">
                                        <GaugeChart />
                                    </div>
                                    <div className="vm-chart">
                                        <VolumeGraph volume="Total Volume" />
                                    </div>
                                    <div className="vm-chart">
                                        <VolumeGraph volume="Settled Volume" />
                                    </div>
                                </div>
                            </div>
                            <div className="viewmerchant-row2-card">
                                <div className="viewmerchant-tabs">
                                    <ButtonAnimation
                                        buttons={tabs}
                                        activeTab={activeTab}
                                        onTabChange={handleTabClick}
                                    />
                                </div>
                                <div className="tab-details">
                                    {activeTab === "Business Details" && (
                                        <div className="vm-tabs">
                                            <div className="vm-tab-head">
                                                <p className="profile-title">Bussiness Details</p>
                                                {isEditable ? (<Icon
                                                    name="update"
                                                    width={20}
                                                    height={20}
                                                    color="#B7B7B7"
                                                    className="vm-edit-icon"
                                                    onClick={handleUpdate}
                                                />) : (
                                                    <Icon
                                                        name="edit"
                                                        width={20}
                                                        height={20}
                                                        color="#B7B7B7"
                                                        className="vm-edit-icon"
                                                        onClick={handleEditClick}
                                                    />
                                                )}

                                            </div>
                                            <div className="business-details-box scrollbar">

                                                <div className="business-info">
                                                    <p className="business-info-p">Business Info</p>
                                                    <div className="business-info-details">
                                                        <div className="section">
                                                            {renderEditableFields("businessInfo")}
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="business-details-right">
                                                    <div className="business-info">
                                                        <p className="business-info-p">Address Details</p>
                                                        <div className="section">
                                                            {renderEditableFields("addressInfo")}
                                                        </div>
                                                    </div>

                                                    {/* <p className="business-details-right-p">Director's Info</p>
                                                    <div className="section">
                                                        {renderEditableFields("directorInfo")}
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === "Rates" && (
                                        <div className="vm-tabs">
                                            <div className="rates-tab-head">
                                                <p>Current Prices</p>
                                                {role === "client" ? null : (
                                                    <Button backgroundcolor="#003366" size="small" className="btn-medium ">
                                                        <Icon
                                                            name="edit"
                                                            width={20}
                                                            height={20}
                                                            color="#fafafa"
                                                        />
                                                        Edit Details
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="rate-table scrollbar">
                                                <TransactionTable
                                                    headerLabels={headerLabels}
                                                    tableData={searchResults}
                                                    isAction={false}
                                                    pagination={false}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === "Settlements" && (
                                        <div className="vm-tabs">
                                            <div className="settlement-tab">
                                                <img src={Settlementimage} alt="" />
                                            </div>

                                        </div>
                                    )}
                                    {activeTab === "Secrets" && (
                                        <div className="vm-tabs">
                                            <div className="rates-tab-head">
                                                <p>Current Prices</p>
                                                {/* <Button backgroundcolor="#003366" size="small" onClick={toggleApiKeyVisibility}>
                                                    {apiKeyVisible ? "Hide Key" : "Generate Key"}
                                                </Button> */}
                                            </div>
                                            <div className="keys">
                                                {[
                                                    { type: "Public Key", label: "API Key", keyName: "api_key" },
                                                    { type: "Private Key", label: "Secret Key", keyName: "api_secret" },
                                                    // { type: "", label: "Account Creation Key" },
                                                ].map((key, index) => (
                                                    <div className="api-key" key={index}>
                                                        {key.type && <div className="key-type">{key.type}</div>}
                                                        <div className="key-content">
                                                            <div className="copyable-apikey">
                                                                {key.label}
                                                                <span
                                                                    className="icon-cursor"
                                                                    onClick={() => handleCopy(merchant[key.keyName], index)}
                                                                >
                                                                    {copiedIndex === index ? (
                                                                        <Icon name="check" width={16} height={16} color="green" />
                                                                    ) : (
                                                                        <Icon name="copy" width={16} height={16} color="#00264C" />
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <p>
                                                                {/* {merchant[key.keyName]?.slice(0, 4)}{"*".repeat(
                                                                    (merchant[key.keyName]?.length || 8) - 8
                                                                )}{merchant[key.keyName]?.slice(-4)} */}

                                                                {merchant[key.keyName]?.slice(0, 5)}
                                                                {"*".repeat(14)}
                                                                {merchant[key.keyName]?.slice(-5)}
                                                            </p>

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === "MIDs" && (
                                        <div className="vm-tabs">
                                            <div className="rates-tab-head">
                                                <p>Assign MIDs</p>
                                                <Button backgroundcolor="#003366" size="small">
                                                    <Icon
                                                        name="document"
                                                        width={20}
                                                        height={20}
                                                        color="#fafafa"
                                                        className="ic edit-icon"
                                                    />
                                                    Add MID
                                                </Button>
                                            </div>
                                            <div className="mid-details scrollbar">
                                                {/* {[
                                                    { midName: "MID_123", acquirer: "MilkyPay" },
                                                    { midName: "MID_456", acquirer: "PayFlex" },
                                                    { midName: "MID_789", acquirer: "QuickPay" },
                                                ].map((mid, index) => (
                                                    <div className="mids" key={index}>
                                                        <div className="mid1">
                                                            <p className="mid-mid1">MID Name</p>
                                                            <p className="midname-mid1">{mid.midName}</p>
                                                        </div>
                                                        <div className="mid1">
                                                            <p className="mid-mid1">Acquirer</p>
                                                            <p className="midname-mid1">{mid.acquirer}</p>
                                                        </div>
                                                    </div>
                                                ))} */}
                                                <p>No mid</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-section">
                        <p>©{currentYear} Axipays. All rights reserved.</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewMerchant;