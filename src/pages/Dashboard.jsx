import React, { useState, useEffect } from "react";

import "../styles/pages.css";

import Icon from "../media/icon/icons";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Skeleton from "../components/Skeleton.jsx";

import LineChart from "../components/LineChart";
import { apiRequest } from "../services/apiService";


//Importing components
import StackedBarChart from "../components/StackedBarChart";
// import CountryMap from "../components/CountryMap";
import Table from "../components/Table";
import footerimage from "../media/image/footer-image.webp";
import dashboardimage from "../media/image/Dashboard_demo.png";
import Heading, { headings } from "../components/utilitis/Heading";

function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [, setErrorMessage] = useState("");
	const [searchedResult, setSearchedResult] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const [expandedItems, setExpandedItems] = useState({});
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [transactionTotal, setTransactionTotal] = useState(0);
 
	const userName = localStorage.getItem("userName")
	const role = localStorage.getItem("role");
	const currentYear = new Date().getFullYear();

	// const countryData = [
	// 	{ name: 'France', percentage: 60, image: france },
	// 	{ name: 'Germany', percentage: 30, image: germany },
	// 	{ name: 'Spain', percentage: 80, image: spain },
	// 	{ name: 'Italy', percentage: 50, image: italy },
	//   ];

	const iconMap = {
		merchant: 'assignment_ind',
		acquirer: 'person_book',
		usd: 'dollar',
		from: 'calendar',
		to: 'calendar',
	};

	const toggleBox = () => {
		if (isOpen) {
			setIsAnimating(true);
			setTimeout(() => {
				setIsAnimating(false);
				setIsOpen(false);
			}, 500);
		} else {
			setIsOpen(true);
			setIsAnimating(false);
		}
	};

	const toggleExpand = (label) => {
		setExpandedItems((prev) => (prev === label ? null : label));
	};

	const handleChildAction = (actionType, value) => {
		if (actionType === "PAGE_CHANGE") {
			setCurrentPage(value);
		} else if (actionType === "ROWS_CHANGE") {
			setRowsPerPage(Number(value));
			setCurrentPage(1);
		}
	};

	const fetchTransactionData = async (pageNumber, pageSize) => {
		if (role === "client") {
			setLoading(false)
			return;
		}
		setLoading(true);
		try {
			const response = await apiRequest(
				`api/v1/txn?pageSize=${pageSize}&pageNumber=${pageNumber}`,
				"GET"
			);
			
			const transactions = response?.data?.transactions;

			if (Array.isArray(transactions)) {
				const modifiedData = transactions.reverse().map((item) => ({
					...item,
					full_name: `${item.first_name} ${item.last_name}`,
					status: normalizeStatus(item.status),
				}));
				const totalTransactions = response?.data?.total_records || 0;
				setTransactionTotal(totalTransactions);
				setSearchedResult(modifiedData);
				setErrorMessage("");
			} else {
				setSearchedResult([]);
				setErrorMessage("No transactions found.");
			}
		} catch (error) {
			setErrorMessage("Failed to fetch transaction data. Please try again.");
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};


	const normalizeStatus = (status) => {
		if (status.toLowerCase() === "success") {
			return "Success";
		}
		if (status.toLowerCase() === "pending") {
			return "Pending";
		}
		if (status.toLowerCase() === "failed") {
			return "Failed";
		}

		if (/active/i.test(status)) {
			return "Success";
		}
		if (/pending/i.test(status)) {
			return "Pending";
		}
		if (/inactive/i.test(status)) {
			return "Failed";
		}

		return status;
	};

	// Fetch transaction data when the component mounts
	useEffect(() => {
		fetchTransactionData(currentPage, rowsPerPage);
	}, [currentPage, rowsPerPage]);

	useEffect(() => {
		const today = new Date();
		const last7Days = new Date(today);
		last7Days.setDate(today.getDate() - 6);

		setFromDate(last7Days.toISOString().split('T')[0]);
		setToDate(today.toISOString().split('T')[0]);
	}, []);

	const handleDateChange = (label, date) => {
		if (label === 'from') setFromDate(date);
		else if (label === 'to') setToDate(date);
	};

	const [headerLabels] = useState([
		{ heading: "S.No", label: "sno" },
		{ heading: "Transaction Ref", label: "transaction_ref" },
		{ heading: "Merchant Trans ID", label: "merchant_txn_id" },
		{ heading: "Customer Name", label: "full_name" },
		{ heading: "Merchant Name", label: "merchant_name" },
		{ heading: "Status", label: "status" },
		{ heading: "Message", label: "message" },
		{ heading: "Transaction Date", label: "CreatedAt" },
		{ heading: "Email", label: "email" },
		{ heading: "Phone No.", label: "phone" },
		{ heading: "Card Number", label: "card_number" },
		{ heading: "Country", label: "country" },
		{ heading: "Card Type", label: "card_type" },
		{ heading: "Amount", label: "amount" },
		{ heading: "Currency", label: "currency_code" },
	]);

	if (role === "admin" || role === "client") {
		return (
			<>
				<Header />
				<Sidebar />
				{loading ? (
                <div className="main-screen">
                    <Skeleton />
                </div>
            ) : (
				<div className="main-screen dashboard">
					<Heading heading={headings.dashboard} />
					{/* Cards showing stats about volume and traffic for a single day for each currency*/}

					<div className="db-glance">
						<div className="db-glance-date-selector">
							<p>Today</p>
							<div className="ic">
								<Icon name="keyboard_arrow_down" width={20} height={20} color="#003366" />
							</div>
						</div>
						<div className="db-glance-top">
							<h3>Welcome back,&nbsp; {userName}</h3>
							<p>Today's latest updates await you,</p>
						</div>
						<div className="db-glance-bottom">
							<div className="today-stats-div">
								<div className="today-stats-head">
									<div className="no-hover-icon-head">
										<div className="no-hover-icon">
											<Icon name="sales" width={22} height={22} color="#002966" />
										</div>
										<h5 className="db-div-head">Total Volume</h5>
									</div>
									<h2>$00,000</h2>
								</div>
								<div className="today-stats-values">
									<div className="today-stats-value-row">
										<div className="no-hover-icon-head">
											<div className="no-hover-icon">
												<Icon name="dollar" width={20} height={20} color="#002966" />
											</div>
											<h6 className="db-div-head">USD</h6>
										</div>
										<div className="no-hover-icon-head">
											<p className="total-counts">$00,000</p>
											<div className="percent-div">
												<p>0%</p>
											</div>
										</div>
									</div>

									<div className="today-stats-value-row">
										<div className="no-hover-icon-head">
											<div className="no-hover-icon">
												<Icon name="euro" width={20} height={20} color="#002966" />
											</div>
											<h6 className="db-div-head">EUR</h6>
										</div>
										<div className="no-hover-icon-head">
											<p className="total-counts">$00,000</p>
											<div className="percent-div">
												<p>0%</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="today-stats-div">
								<div className="today-stats-head">
									<div className="no-hover-icon-head">
										<div className="no-hover-icon">
											<Icon name="traffic" width={22} height={22} color="#002966" />
										</div>
										<h5 className="db-div-head">Traffic Status</h5>
									</div>
									<h2>00,000</h2>
								</div>
								<div className="today-stats-values">
									<div className="today-stats-value-row">
										<div className="no-hover-icon-head">
											<div className="no-hover-icon">
												<Icon name="dollar" width={20} height={20} color="#002966" />
											</div>
											<h6 className="db-div-head">USD</h6>
										</div>
										<div className="no-hover-icon-head">
											<p className="total-counts">00,000</p>
											<div className="percent-div">
												<p>0%</p>
											</div>
										</div>
									</div>

									<div className="today-stats-value-row">
										<div className="no-hover-icon-head">
											<div className="no-hover-icon">
												<Icon name="euro" width={20} height={20} color="#002966" />
											</div>
											<h6 className="db-div-head">EUR</h6>
										</div>
										<div className="no-hover-icon-head">
											<p className="total-counts">00,000</p>
											<div className="percent-div traffic-percent-div">
												<p>0%</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="glance-show-more-div">
								<Icon name="vertical_dots" width={22} height={22} color="#002966" />
							</div>
						</div>
					</div>

					{/* {Filters} */}

					<div className="db-filters">
						<div className="manage-main-head db-filters-head">
							<h4>Customization</h4>
						</div>
						{role === "client" ? null : (
							<div className="db-filters-button">
								{isOpen && (
									<div className={`box-row ${isAnimating ? 'close' : 'open'}`}>
										{['merchant', 'acquirer', 'usd', 'from', 'to'].map((label, index) => (
											<div className={`box-content ${label === 'from' || label === 'to' ? 'tofrominput' : ''}`} key={index}>
												<p className="db-filter-icons">
													<Icon name={iconMap[label]} width={22} height={22} color="#002966" />
													{label.charAt(0).toUpperCase() + label.slice(1)}
												</p>
												<Icon
													name="keyboard_arrow_down"
													width={23}
													height={23}
													color="#002966"
													className="icon-cursor"
													onClick={() => toggleExpand(label)}
												/>
												{expandedItems === label && (
													<div className="dropdown-content">
														{label === 'from' || label === 'to' ? (
															<input
																type="date"
																onChange={(e) => handleDateChange(label, e.target.value)}
															/>
														) : (
															<p>Dropdown content for {label}</p>
														)}
													</div>
												)}
											</div>
										))}
									</div>
								)}
								<div className="no-hover-icon no-hover-filter-icon" onClick={toggleBox}>
									<Icon name={isOpen ? 'close_fill' : 'dashboard_customize'} width={22} height={22} color="#002966" />
								</div>

							</div>
						)}
					</div>

					{/* Cards showing stats about volume, traffic and approvals for a selected range of 7 days*/}

					<div className="db-details">
						<div className="db-details-approvals">
							<div className="approvals-div">
								<div className="today-stats-head">
									<div className="no-hover-icon-head">
										<div className="no-hover-icon">
											<Icon name="piechart" width={22} height={22} color="#002966" />
										</div>
										<h5 className="db-div-head">Weekly Ratio</h5>
									</div>
									<Icon
										name="right_diagonal_up_arrow"
										width={22}
										height={22}
										color="#0066ff"
										className="icon-cursor"
									/>
								</div>

								{/* <div className="stackedbar-info">
									<div className="stacked-bar-status-info">
										{[
											{ label: 'Success', amount: '$ 1,234,324', bulletColor: '#005CB8' },
											{ label: 'Failed', amount: '$ 1,234,324', bulletColor: '#247CFF' },
											{ label: 'Incomplete', amount: '$ 1,234,324', bulletColor: '#D6EBFF' },
										].map(({ label, amount, bulletColor }) => (
											<div className="status-head" key={label}>
												<div>
													<span className="status-bullet" style={{ backgroundColor: bulletColor }}></span>
													{label}
												</div>
												<span>{amount}</span>
											</div>
										))}
									</div>

									<div className="percent-div view-more">
										View More
									</div>
								</div> */}
								<div className="stacked-bar-chart stacked-line-chart">
									{" "}
									<StackedBarChart fromDate={fromDate} toDate={toDate} />
								</div>
							</div>

							<div className="approvals-div">
								<div className="today-stats-head">
									<div className="no-hover-icon-head">
										<div className="no-hover-icon">
											<Icon name="sales" width={22} height={22} color="#002966" />
										</div>
										<h5 className="db-div-head">Approval Ratio</h5>
									</div>
									<Icon
										name="right_diagonal_up_arrow"
										width={22}
										height={22}
										color="#0066ff"
										className="icon-cursor"
									/>
								</div>
								<div className="stacked-bar-chart stacked-line-chart">
									{" "}
									<LineChart />
								</div>
							</div>
						</div>

						{/* <div className="db-details-country">
							<div className="country-div">
								<div className="today-stats-head">
									<div className="no-hover-icon-head">
										<div className="no-hover-icon">
											<Icon name="map" width={22} height={22} color="#002966" />
										</div>
										<h5 className="db-div-head">Performance Across Regions</h5>
									</div>
									<Icon
										name="right_diagonal_up_arrow"
										width={22}
										height={22}
										color="#0066ff"
										className="icon-cursor"
									/>
								</div>
								<div className="country-stats">
									{" "}
									<div className="country-map">
										<CountryMap /> 
									</div>
									<div className="country-right">
										{countryData.map((country, index) => (
											<div key={index} className="country-cards">
												<img
													src={country.image}
													width={20}
													height={20}
													alt={country.name}
												/>
												<div className="country-info">
													{country.name}
													<div className="country-bar-wrapper">
														<span
															className="country-percent-bar"
															style={{ width: `${country.percentage}%` }}
														></span>
													</div>
												</div>
												<span>{country.percentage}%</span>
											</div>
										))}
									</div>
								</div>
							</div>
							<div className="details-show-more-div"></div>
						</div>  */}
					</div>

					{/* Table showing latest transactions */}
					<div className={role === "client" ? "db-table-disable" : "db-table"}>
						<Table
							headerLabels={headerLabels}
							tableData={searchedResult}
							transactionTotal={transactionTotal}
							currentPage={currentPage}
							rowsPerPage={rowsPerPage}
							setCurrentPage={setCurrentPage}
							handleChildAction={handleChildAction}
						/>
					</div>

					<div className="footer-text-column">
						<div className="footer-text">
							<span data-title="P">P</span>
							<span data-title="r">r</span>
							<span data-title="o">o</span>
							<span data-title="c">c</span>
							<span data-title="e">e</span>
							<span data-title="s">s</span>
							<span data-title="s">s</span>
							<span data-title="&#x25A0;" className="square" style={{ fontSize: '50px' }}>&#x25A0;</span>
							<span></span>
						</div>
						<div className="footer-text-inline">
							<div className="footer-text">
								<span data-title="T">T</span>
								<span data-title="r">r</span>
								<span data-title="a">a</span>
								<span data-title="c">c</span>
								<span data-title="k">k</span>
								<span data-title="&#x25A0;" className="square" style={{ fontSize: '50px' }}>&#x25A0;</span>
							</div>

							<div className="footer-text">

								<span data-title="G">G</span>
								<span data-title="r">r</span>
								<span data-title="o">o</span>
								<span data-title="w">w</span>
								<span data-title="&#x25A0;" className="square" style={{ fontSize: '50px' }}>&#x25A0;</span>
							</div>
						</div>
						<img src={footerimage} alt="footer-img" />

						<p className="footer-tag-line"> ©{currentYear} Axipays. All rights reserved. </p>
					</div>
				</div>
			)}
			</>
		);
	}
	if (role === "employee") {
		return (
			<>
				<div>Hello {userName}</div>
			</>
		);
	}
	if (role === "firstUser") {
		return (
			<>
				<Header />
				<div className="dashboard-for-firstuser">
					<div className="db-firstuser">
						<div className="db-firstuser-left">
							<h1 className="db-firstuser-head">Profile Awaiting Approval</h1>
							<h4 className="db-firstuser-para">Thank you for your patience. Our team is carefully reviewing your profile and will notify you once it’s approved. </h4>
							<p className="db-firuser-line">If you have any questions, please don’t hesitate to contact us at </p>
							<div className="info-btn">
								<a href="mailto:info@axipays.com">
									info@axipays.com<Icon name="mail" height={20} width={20} color="#fff" />
								</a>
							</div>

						</div>

						<div className="firstuserimg">
							{/* <img src={firstUserimg} alt="" /> */}
						</div>
					</div>

					<div className="first-user-db">
						<div className="firstuser-heading">
							<h1>Axipays Dashboard</h1>
							<h1>Your One-Stop Solution for Smarter Payment Management</h1>
						</div>
						<div className="first-user-boxes">
							<span>
								<h1 className="db-firstuser-para">1.Comprehensive Transaction Filters</h1>
								<p className="db-firuser-line">Quickly find and organize transactions by date, currency, status, </p>
							</span>

							<span>
								<h1 className="db-firstuser-para">2.Real-Time Transaction Monitoring</h1>
								<p className="db-firuser-line">tay on top of your business with a live table view that updates transactions </p>
							</span>

							<span>
								<h1 className="db-firstuser-para">3.Informative Data Visualization</h1>
								<p className="db-firuser-line">Leverage detailed graphs to track and analyze transaction trends </p>
							</span>
						</div>

						<div className="first-user-db-demo">
							<img src={dashboardimage} alt="" />

						</div>
					</div>
					<div className="footer-text-column">
						<div className="footer-text">
							<span data-title="P">P</span>
							<span data-title="r">r</span>
							<span data-title="o">o</span>
							<span data-title="c">c</span>
							<span data-title="e">e</span>
							<span data-title="s">s</span>
							<span data-title="s">s</span>
							<span data-title="&#x25A0;" className="square" style={{ fontSize: '50px' }}>&#x25A0;</span>
							<span></span>
						</div>
						<div className="footer-text-inline">
							<div className="footer-text">
								<span data-title="T">T</span>
								<span data-title="r">r</span>
								<span data-title="a">a</span>
								<span data-title="c">c</span>
								<span data-title="k">k</span>
								<span data-title="&#x25A0;" className="square" style={{ fontSize: '50px' }}>&#x25A0;</span>
							</div>

							<div className="footer-text">

								<span data-title="G">G</span>
								<span data-title="r">r</span>
								<span data-title="o">o</span>
								<span data-title="w">w</span>
								<span data-title="&#x25A0;" className="square" style={{ fontSize: '50px' }}>&#x25A0;</span>
							</div>
						</div>
						<img src={footerimage} alt="footer-img" />

						<p className="footer-tag-line"> ©{currentYear} Axipays. All rights reserved. </p>
					</div>
				</div>
			</>
		);
	}
}

export default Dashboard;