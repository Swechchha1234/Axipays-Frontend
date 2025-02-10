import React, { useState, useEffect } from "react";

import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Skeleton from "../components/Skeleton.jsx";

import Table from "../components/MerchantTable.jsx";
import Icon from "../media/icon/icons.jsx";
import Button from "../components/utilitis/Button.jsx";
import { Input } from "../components/utilitis/Input.jsx";
import Heading,{headings} from "../components/utilitis/Heading.jsx";

import { apiRequest } from "../services/apiService.jsx";

function ManageUser() {
    const currentYear = new Date().getFullYear();
    const role = localStorage.getItem("role");
    const [filterStatus, setFilterStatus] = useState("all");
    const [activeCard, setActiveCard] = useState("all");
   const [loading, setLoading] = useState(true);
    const [, setErrorMessage] = useState("");
    const [merchants, setMerchants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [headerLabels] = useState([
        { id: 1, heading: "User Name", label: "client_name" },
        { id: 2, heading: "Status", label: "status" },
        { id: 3, heading: "Role", label: "role" },
        { id: 4, heading: "Activity" },
        { id: 5, heading: "Email", label: "email" }
    ]);

    const fetchAllMerchants = async () => {
        setLoading(true);

        const clientApiEndpoint = "api/v1/auth/users";

        try {
            const clientResponse = await apiRequest(clientApiEndpoint, "GET").catch(() => ({ data: [] }));

            const clientData = clientResponse?.data || [];
            setMerchants(clientData);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Failed to fetch merchants. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllMerchants();
    }, []);

    const handleCardClick = (status) => {
        setFilterStatus(status);
        setActiveCard(status);
    };

    const filteredMerchants = merchants.filter((merchant) => {
		const matchesStatus =
			filterStatus === "all" ||
			(filterStatus === "temp" && merchant.role === "firstUser") ||
			merchant.status === filterStatus;
	
		const matchesSearch =
			(merchant.client_name && merchant.client_name.includes(searchQuery)) ||
			(merchant.email && merchant.email.includes(searchQuery)) ||
			(merchant.phone_no && merchant.phone_no.includes(searchQuery));
	
		return matchesStatus && matchesSearch;
	});

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    if (role === "admin" || role === "merchant") {
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
                <Heading heading={headings.muser} />
                    <div className="main-screen-rows settlement-first-row">
                        <div
                            className={`row-cards merchant-card ${activeCard === "all" ? "active-card" : ""}`}
                            onClick={() => handleCardClick("all")}
                        >
                            <div className="merchant-card-top">
                                <div className="merchant-card-left">
                                    <div className="creditcard-div total">
                                        <Icon
                                            name="total_users"
                                            width={25}
                                            height={25}
                                            color="#0066ff"
                                            className="ic"
                                        />
                                    </div>
                                    <p className="p2">Total Root User</p>
                                    <h4 className="merchant-card-head">{merchants.length}</h4>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`row-cards merchant-card ${activeCard === "Agent-User" ? "active-card" : ""}`}
                            onClick={() => handleCardClick("Agent-User")}
                        >
                            <div className="merchant-card-top">
                                <div className="merchant-card-left">
                                    <div className="creditcard-div total">
                                        <Icon
                                            name="supervisor_account"
                                            width={25}
                                            height={25}
                                            color="#0066ff"
                                            className="ic"
                                        />
                                    </div>
                                    <p className="p2">Total Sub-User</p>
                                    <h4 className="merchant-card-head">{merchants.filter(item => item.status === "Agent-User").length}</h4>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`row-cards merchant-card ${activeCard === "Active" ? "active-card" : ""}`}
                            onClick={() => handleCardClick("Active")}
                        >
                            <div className="merchant-card-top">
                                <div className="merchant-card-left">
                                    <div className="creditcard-div total">
                                        <Icon
                                            name="person_check"
                                            width={25}
                                            height={25}
                                            color="#0066ff"
                                            className="ic"
                                        />
                                    </div>
                                    <p className="p2">Total Active User</p>
                                    <h4 className="merchant-card-head">{merchants.filter(item => item.status === "Active").length}</h4>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`row-cards merchant-card ${activeCard === "Pending" ? "active-card" : ""}`}
                            onClick={() => handleCardClick("Pending")}
                        >
                            <div className="merchant-card-top">
                                <div className="merchant-card-left">
                                    <div className="creditcard-div total">
                                        <Icon
                                            name="deployed_code_account"
                                            width={25}
                                            height={25}
                                            color="#0066ff"
                                            className="ic"
                                        />
                                    </div>
                                    <p className="p2">Total Live User</p>
                                    <h4 className="merchant-card-head">{merchants.filter(item => item.status === "Pending").length}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="manageuser-functionality">
                        <div className="manageuser-searchfilter">
                            <div className="input-grp">
                                <div className="ic">
                                    <Icon name="search" width={22} height={22} color="black" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    hideWrapper={true}
                                />
                            </div>
                            <div className="btn-pagination">
                                <Icon
                                    name="filter_list"
                                    width={20}
                                    height={20}
                                    color="#000"
                                />
                            </div>
                        </div>
                        <Button className="btn-medium" backgroundcolor="#003366" size="medium">
                            <Icon name="add_user" width={20} height={20} color="#fff" /> Add New User
                        </Button>
                    </div>

                    <div className="manageuser-table">
                        <Table filteredMerchants={filteredMerchants} headerLabels={headerLabels} expandedRows={true}/>
                    </div>
                    <div className="footer-section">
                        <p>©{currentYear} Axipays. All rights reserved.</p>
                    </div>
                </div>
            )}
            </>
        );
    }
}

export default ManageUser;
