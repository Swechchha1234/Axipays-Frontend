import React, { useState, useEffect } from "react";

import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Skeleton from "../components/Skeleton.jsx";

import Heading, { headings } from "../components/utilitis/Heading.jsx";
import Table from "../components/MerchantTable.jsx";
import Icon from "../media/icon/icons.jsx";
import Button from "../components/utilitis/Button.jsx";
import { Input } from "../components/utilitis/Input.jsx";
import { apiRequest } from "../services/apiService.jsx";

function ManageMerchant() {
	const currentYear = new Date().getFullYear();
	const [filterStatus, setFilterStatus] = useState("all");
	const [activeCard, setActiveCard] = useState("all");
	const [merchants, setMerchants] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(true);

	const headerLabels = [
		{ id: 1, heading: "Company Name", label: "client_name" },
		{ id: 2, heading: "Status", label: "status" },
		{ id: 3, heading: "Email", label: "email" },
		{ id: 4, heading: "Skype ID", label: "skype_id" },
		{ id: 5, heading: "Website URL", label: "website_url" },
		{ id: 6, heading: "Phone Number", label: "phone_no" }
	];

	const fetchAllMerchants = async () => {
		setLoading(true);
		try {
			const clientApiEndpoint = "api/v1/client";
			const tempUsersApiEndpoint = "api/v1/auth/tempusers";

			const [clientResponse, tempUsersResponse] = await Promise.all([
				apiRequest(clientApiEndpoint, "GET").catch(() => ({ data: [] })),
				apiRequest(tempUsersApiEndpoint, "GET").catch(() => ({ data: [] }))
			]);

			const clientData = clientResponse?.data || [];
			const tempUsersData = tempUsersResponse?.data.map(user => ({
				...user,
				website_url: user.company_url || "",
				client_name: user.company_name || "", 
			})) || [];
			const allMerchants = [...clientData, ...tempUsersData];

			setMerchants(allMerchants);
		} catch (error) {
			setErrorMessage("Failed to fetch merchants. Please try again.");
			console.error("Fetch error:", error);
		}
		finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllMerchants();
	}, []);

	const approveClient = async (merchantID) => {
		const approveClientEndpoint = `api/v1/auth/approveclient?userId=${merchantID}&rootconsent=false`;

		try {
			const response = await apiRequest(approveClientEndpoint, "PUT");

			if (response?.error) {
				throw new Error(response.error);
			}
			fetchAllMerchants();
		} catch (error) {
			console.error("Error approving client:", error);
			alert("Error approving client: " + error.message);
		}
	};

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

	const totalCount = merchants.length;
	const activeCount = merchants.filter(item => item.status === "Active").length;
	const inactiveCount = merchants.filter(item => item.status === "Inactive").length;
	const pendingCount = merchants.filter(item => item.status === "Pending").length;
	const tempCount = merchants.filter(item => item.role === "firstUser").length;
	const ratioData = [
		{ count: activeCount, className: "mm-active", label: "Active" },
		{ count: inactiveCount, className: "mm-inactive", label: "Inactive" },
		{ count: pendingCount, className: "mm-pending", label: "Pending" },
		{ count: tempCount, className: "mm-temp", label: "temp" }
	];

	const totalWidth = totalCount > 0 ? 100 : 0;
	const ratioWidths = ratioData.reduce((acc, { count }) => {
		acc.push(totalCount > 0 ? (count / totalCount) * totalWidth : 0);
		return acc;
	}, []);

	const activeStatusCount =
		activeCard === "all" ? totalCount :
			activeCard === "temp" ? tempCount :
				merchants.filter(item => item.status === activeCard).length;

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
				<Heading heading={headings.mmerchant} />

				<div className="merchant-card-top">
					<div className="mm-card mm-card-container">
						<div className="mm-card">
							<Icon name="total_users" width={25} height={25} color="#002966" />
							<p>Total Merchant</p>
						</div>
						<h4 className="mm-head-active">{activeStatusCount}</h4>
					</div>

					<div className="mm-Ratio-wrapper">
						<div className="Ratio-wrapper" style={{ width: "100%" }}>
							{ratioData.map((data, index) =>
								data.count > 0 && (
									<span
										key={index}
										className={`Ratio-wrapper-bar ${data.className}`}
										style={{
											width: `${ratioWidths[index]}%`,
										}}
									/>
								)
							)}
						</div>
					</div>

					<div className="mm-card mm-card-container">
						<div className="mm-card ">
							{["all", "Active", "Inactive", "Pending", "temp"].map((status) => (
								<div key={status} className={`mm-card mm-card-status ${activeCard === status ? "mm-active-card" : "mm-card mm-card-status"}`} onClick={() => handleCardClick(status)}>

									<span
										className={`status-circle ${status === "Active" ? "mm-active" :
											status === "Inactive" ? "mm-inactive" :
												status === "Pending" ? "mm-pending" :
													status === "temp" ? "mm-temp" : ""}`}
										title={status}
									/>

									<p className="p2">{status === "all" ? "Total" : status}</p>

									<h4
										className={`mm-head ${activeCard === status ? "mm-active-status" : "mm-head"}`}
									>
										{status === "all" ? totalCount :
											status === "temp" ? tempCount :
												merchants.filter(item => item.status === status).length}
									</h4>
								</div>
							))}
						</div>

						<div className="mm-counts">
							<div className="mm-counts">
								<p>Merchant</p>
								<p className="p2">52</p>
							</div>
							<span>|</span>
							<div className="mm-counts">
								<p>PSP</p>
								<p className="p2">52</p>
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
							<Icon name="filter_list" width={20} height={20} color="#000" />
						</div>
					</div>
					<Button className="btn-medium" backgroundcolor="#003366" size="medium">
						<Icon name="add_user" width={20} height={20} color="#fff" /> Add New User
					</Button>
				</div>

				<div>
					<Table filteredMerchants={filteredMerchants} headerLabels={headerLabels} approveClient={approveClient} />
				</div>
				<div className="footer-section">
					<p>©{currentYear} Axipays. All rights reserved.</p>
				</div>
			</div>
			)}
		</>
	);
}

export default ManageMerchant;
