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

function ViewUser() {
    const currentYear = new Date().getFullYear();
    const role = localStorage.getItem("role");
    const [activeTab, setActiveTab] = useState("Business Details");
    const [merchant, setMerchant] = useState(null);
    const [, setErrorMessage] = useState("");
    const [apiKeyVisible, setApiKeyVisible] = useState(false);
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);

    const [isEditable, setIsEditable] = useState(false);
    const [changedFields, setChangedFields] = useState({});
    const [status, setStatus] = useState("");

    const [editableFields, setEditableFields] = useState({
        aboutInfo: [
            { label: "Merchant ID", value: "", id: "client_ref_id" },
            { label: "Website URL", value: "", id: "website_url" },
            { label: "Industry", value: "", id: "business_type" },
        ],
        contactInfo: [
            { label: "Phone No.", value: "", id: "phone_no" },
            { label: "Email ID", value: "", id: "email" },
            { label: "Skype ID", value: "", id: "skype_id" },
        ],
        businessInfo: [
            { label: "Business Type", value: "", id: "business_type" },
            { label: "Business Category", value: "", id: "business_category" },
            { label: "Card Type", value: "", id: "card_type" },
            { label: "Registered On", value: "", id: "registered_on" },
            { label: "Industries ID", value: "", id: "industries_id" },
            { label: "Pay In", value: "", id: "merchant_pay_in" },
            { label: "Pay Out", value: "", id: "merchant_pay_out" },
            { label: "Settlement Charge", value: "", id: "payment_method" },
            { label: "Turnover", value: "", id: "turnover" },
            { label: "Expected Chargeback Percentage", value: "", id: "ex_chargeback_percent" },
        ],
        addressInfo: [
            { label: "Country", value: "", id: "country" },
            { label: "State", value: "", id: "state" },
            { label: "City", value: "", id: "city" },
            { label: "Street Address 1", value: "", id: "company_address1" },
            { label: "Street Address 2", value: "", id: "company_address2" },
        ],
        directorInfo: [
            { label: "First Name", value: "", id: "first_name" },
            { label: "Last Name", value: "", id: "last_name" },
        ]
    });

    const [headerLabels] = useState([
        { heading: "S.No", label: "sno" },
        { heading: "Charging Items", label: "chargingitems" },
        { heading: "Charging Rate/ Amount", label: "amount" },
        { heading: "Remark", label: "remark" },
    ]);

    const [searchResults] = useState([
        { sno: "1", chargingitems: "MDR", amount: "8.5%", remark: "-" },
        { sno: "2", chargingitems: "Transaction Approved", amount: "$ 0.5", remark: "-" },
        { sno: "3", chargingitems: "Transactions Declined", amount: "$ 0.5", remark: "-" },
        { sno: "4", chargingitems: "Rolling Reserve", amount: "10%", remark: "For 180 days" },
        { sno: "5", chargingitems: "Settlement Charge", amount: "2%", remark: "On first 2 settlements" }
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

    const toggleApiKeyVisibility = () => {
        setApiKeyVisible(!apiKeyVisible);
    };

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value);
        alert(`Copied: ${value}`);
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
            const apiEndpoint = `api/v1/auth/users?userId=${userId}`;
            setLoading(true);
        
            try {
                const response = await apiRequest(apiEndpoint, "GET");
        
                if (response && response.data && Array.isArray(response.data)) {
                    setMerchant(response.data);
        
                    const firstMerchant = response.data[0];
                    if (firstMerchant) {
                        setMerchant(firstMerchant);
                        setStatus(firstMerchant.status);
                        populateEditableFields(firstMerchant);
                    }
        
                    setErrorMessage("");
                    // console.log("Fetched merchants:", response.data);
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
                : "status-pending";

    const handleEditClick = async () => {
        if (isEditable) {
            await handleUpdate();
        } else {
            setIsEditable(true);
        }
    };

    const handleUpdate = async () => {
        if (Object.keys(changedFields).length === 0) {
            setIsEditable(false);
            return;
        }
    
        try {
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
                    formattedFields[field] = [formattedFields[field]]; 
                }
            });
    
            if (formattedFields["card_type"]) {
                const cardTypeValue = formattedFields["card_type"];
                
                formattedFields["processing_cards"] = 
                    typeof cardTypeValue === "string"
                    ? cardTypeValue.split(/\s+/).map((card) => card.trim()) 
                    : Array.isArray(cardTypeValue)
                    ? cardTypeValue.flatMap((item) =>
                          typeof item === "string" ? item.split(/\s+/).map((card) => card.trim()) : item
                      ) 
                    : [];
                
                delete formattedFields["card_type"];
            }
    
            const apiEndpoint = `api/v1/client/update?userId=${userId}`;
            const response = await apiRequest(apiEndpoint, "PATCH", formattedFields);
    
            if (response && response.success) {
                alert("Merchant data updated successfully.");
                setChangedFields({});
                setIsEditable(false);
            }
        } catch (error) {
            console.error("Error updating merchant data:", error);
        } finally {
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
                alert(`Status updated to ${newStatus}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
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
                <Heading heading={headings.vuser} />
                <div className="viewmerchant-row1">
                    <div className="viewmerchant-card1">
                        <p className="profile-title">Profile Details</p>

                        <div className="merchant-intro">
                            <div className="profile-image" >
                                <img src={UserProfile} alt="ProfilePicture" />
                            </div>
                            <div className="merchant-status-name">
                                <p className="company-name">{merchant?.company_name}</p>
                                <div className={`status-column ${statusClass}`}>
                                    <div className={`bullet ${statusClass}`}></div>{status}
                                </div>
                            </div>
                        </div>

                        <div className="profile-buttons">
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
                        </div>
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
                                    <div>
                                        <div className="vm-tab-head">
                                            <p className="profile-title">Bussiness Details</p>
                                            {isEditable?( <Icon
                                                name="update"
                                                width={20}
                                                height={20}
                                                color="#B7B7B7"
                                                className="vm-edit-icon"
                                                onClick={handleUpdate}
                                            />):(
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

                                                <p className="business-details-right-p">Director's Info</p>
                                                <div className="section">
                                                    {renderEditableFields("directorInfo")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "Rates" && (
                                    <>
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

                                        <TransactionTable
                                            headerLabels={headerLabels}
                                            tableData={searchResults}
                                            isAction={false}
                                            pagination={false}
                                        />
                                    </>
                                )}
                                {activeTab === "Settlements" && (
                                    <>
                                        <div className="settlement-tab">
                                            <img src={Settlementimage} alt="" />
                                        </div>

                                    </>
                                )}
                                {activeTab === "Secrets" && (
                                    <>
                                        <div className="rates-tab-head">
                                            <p>Current Prices</p>
                                            <Button backgroundcolor="#003366" size="small" onClick={toggleApiKeyVisibility}>
                                                {apiKeyVisible ? "Hide Key" : "Generate Key"}
                                            </Button>
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

                                                                onClick={() => handleCopy(merchant[key.keyName])}
                                                            >
                                                                <Icon name="copy" width={16} height={16} color="#00264C" />
                                                            </span>
                                                        </div>

                                                        <p>
                                                            {apiKeyVisible ? (
                                                                merchant[key.keyName] || "N/A"
                                                            ) : (
                                                                "**********"
                                                            )}
                                                        </p>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {activeTab === "MIDs" && (
                                    <>
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
                                        <div className="mid-details">
                                            {[
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
                                            ))}
                                        </div>
                                    </>
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

export default ViewUser;