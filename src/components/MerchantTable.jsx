import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/pages.css";
import Icon from "../media/icon/icons";
import Button from "./utilitis/Button";
// import ActivityGraph from "./ActivityGarph";
import nodata from "../media/image/no-data.webp";
import RefundModal from "./modals/refundmodal";

const MerchantTable = ({ filteredMerchants = [], setFilteredMerchants, headerLabels = [], approveClient, expandedRows = false, moreIcon = false }) => {

	const [filterText, setFilterText] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedRow, setExpandedRow] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null); 

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(Number(event.target.value));
		setCurrentPage(1);
	};

	const handleNextPageClick = () => {
		if (currentPage * rowsPerPage < filteredData.length) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const handlePrevPageClick = () => {
		if (currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	};

	const handleCopy = (value) => {
		navigator.clipboard.writeText(value);
		alert(`Copied: ${value}`);
	};

	const filteredData = filteredMerchants.filter((row) =>
		Object.values(row).some((val) =>
			val && String(val).includes(filterText)
		)
	);

	const startIndex = (currentPage - 1) * rowsPerPage;
	const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

	useEffect(() => {
		if (currentPage > Math.ceil(filteredData.length / rowsPerPage)) {
			setCurrentPage(1);
		}
	}, [filteredData, currentPage, rowsPerPage]);

	const getStatusDisplay = (status) => {
		let className = "status-pending";
		let displayText = "Pending";

		switch (status?.toLowerCase()) {
			case "active":
				className = "status-success";
				displayText = "Active";
				break;
			case "inactive":
				className = "status-failed";
				displayText = "Inactive";
				break;
			case "pending":
				className = "status-pending";
				displayText = "Pending";
				break;
			default:
				className = "status-pending";
				displayText = "Draft";
				break;
		}

		return { className, displayText };
	};

	const getTransactionStatus = (transactionstatus) => {
		let iconName = "paid";
		let displayText = "Paid";
		let iconColor = "#339900"

		switch (transactionstatus?.toLowerCase()) {
			case "success":
				iconName = "check_circle";
				displayText = "Success";
				iconColor = "#339900"
				break;
			case "pending":
				iconName = "radio_button";
				displayText = "Pending";
				iconColor = "#0066FF"
				break;
			case "fail":
				iconName = "cancel";
				displayText = "Fail";
				iconColor = "#CC0000"
				break;
			default:
				iconName = "delete";
				displayText = "Draft";
				iconColor = "#339900"
				break;
		}

		return { iconName, displayText, iconColor };
	};


	const toggleExpandRow = (rowId) => {
		setExpandedRow(expandedRow === rowId ? null : rowId);
	};

	const handleDelete = (rowId) => {
		const updatedData = filteredMerchants.filter((row) => row.id !== rowId);
		setFilteredMerchants(updatedData);
	};

	const openModal = (row) => {
		setModalData(row);
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setModalData(null); 
		setIsModalOpen(false);
	};

	return (
		<>
			<RefundModal
				isOpen={isModalOpen}
				onClose={closeModal}
				merchantData={modalData} 
			/>
			<div className="merchanttable-container">
				<div className="table-Body">
					<table className="transaction-table merchants-table">
						<thead className="merchants-table-head">
							<tr>
								<th className="p1">S. No.</th>
								{headerLabels.map((item, index) => (
									<th key={index} className="p1">
										{item.heading}
									</th>
								))}
								<th className="p1">Actions</th>
							</tr>
						</thead>
						<tbody className="merchant-table-body">
							{paginatedData.length > 0 ? (
								paginatedData.map((row, index) => (
									<React.Fragment key={row.id || index}>
										<tr className={expandedRow === row.id ? "expanded-parent" : ""}>
											<td className={expandedRow === row.id ? "remover" : ""}>{startIndex + index + 1}</td>
											{headerLabels.map((item, index) => (
												<td key={index} className={expandedRow === row.id ? "remover" : ""}>
													{item.label === "status" ? (
														<span className={`status-column ${getStatusDisplay(row.status).className}`}>
															<div className={`bullet ${getStatusDisplay(row.status).className}`}></div>
															{getStatusDisplay(row.status).displayText}
														</span>
													) : item.label === "skype_id" || item.label === "website_url" ? (
														<span className="copyable">
															{row[item.label]}
															<span
																className="copy-icon"
																onClick={() => handleCopy(row[item.label] || "")}
															>
																<Icon name="copy" width={16} height={16} />
															</span>
														</span>
													) : item.heading === "Activity" ? (
														<></>
														// <ActivityGraph />

													) : item.heading === "Transaction Status" ? (
														<span className="transaction-status">
															<div>
																<Icon name={getTransactionStatus(row.transactionstatus).iconName} color={getTransactionStatus(row.transactionstatus).iconColor} width={16} height={16} />
																{getTransactionStatus(row.transactionstatus).displayText}
															</div>
														</span>
													) : item.label === "totalAmount" ? (
														<span className="editable">
															{row[item.label]}
															<span
																className="edit-icon"
															>
																<Icon name="pencil" width={16} height={16} color="#626262" />
															</span>
														</span>
													) : (
														row[item.label]
													)}

												</td>
											))}

											<td className={expandedRow === row.id ? "remover" : ""}>
												<div className="actions-icons">
													{row.role === "firstUser" && (
														<Button backgroundcolor="#003366" size="small" onClick={() => approveClient(row.id)}>
															<Icon name="add_task" height={20} width={20} color="#ffffff" />
															Approve
														</Button>
													)}

													{row.role !== "firstUser" && (
														<>
															{!expandedRows && !moreIcon && (
																<div className="table-icon">
																	{/* <div
																		className="detail-icon"
																	>
																		<Icon
																			name="read_more"
																			width={20}
																			height={20}
																			color="#00264c"
																		/>
																	</div> */}

																	<div className="detail-icon">
																		<Link to={`/viewmerchant/${row.id}`}>
																			<Icon
																				name="user_fill"
																				width={20}
																				height={20}
																				color="#00264c"
																			/>
																		</Link>
																	</div>
																</div>
															)}

															{moreIcon && (
																<div className="table-icon">
																	<div
																		className="detail-icon"
																		onClick={() => handleDelete(index)}
																	>
																		<Icon
																			name="delete"
																			width={20}
																			height={20}
																			color="#626262"
																		/>
																	</div>

																	<div className="detail-icon" onClick={() => openModal(row)}>

																		<Icon
																			name="arrow_right"
																			width={20}
																			height={20}
																			color="#626262"
																		/>
																	</div>
																</div>
															)}
															{expandedRows && (
																<>
																	<div
																		className="detail-icon"
																		onClick={() => toggleExpandRow(row.id)}
																	>
																		<Icon
																			name={expandedRow === row.id ? "keyboard_arrow_up" : "keyboard_arrow_down"}
																			width={20}
																			height={20}
																			color="#00264c"
																		/>
																	</div>
																	<div className="detail-icon">
																		<Link to={`/viewuser/${row.id}`}>
																			<Icon
																				name="user_fill"
																				width={20}
																				height={20}
																				color="#00264c"
																			/>
																		</Link>
																	</div>
																</>
															)}

														</>
													)}
												</div>
											</td>
										</tr>
										{expandedRows && expandedRow === row.id && (
											<tr className="expanded-user-row">
												<td colSpan={headerLabels.length + 2}>
													<table className="expanded-table">
														<thead>
															<tr>
																<th className="p1">S. No.</th>
																<th>Company Name</th>
																<th>SubUser Name</th>
																<th>Role</th>
															</tr>
														</thead>
														<tbody>
															{[
																{ companyName: "Test Company 1", subUserName: "Test User 1", role: "Admin" },
																{ companyName: "Test Company 2", subUserName: "Test User 2", role: "Manager" },
																{ companyName: "Test Company 3", subUserName: "Test User 3", role: "User" }
															].map((data, idx) => (
																<tr key={idx} className="p2">
																	<td>{idx + 1}</td>
																	<td>{data.companyName}</td>
																	<td>{data.subUserName}</td>
																	<td>{data.role}</td>
																</tr>
															))}
														</tbody>
													</table>
												</td>
											</tr>
										)}

									</React.Fragment>

								))
							) : (
								<tbody className="merchant-table-body">
									<div className="no-data-aviliable">
										<img src={nodata} alt="No data available" />
									</div>
								</tbody>
							)}
						</tbody>
					</table>
				</div>

				<div className="pagination-info">
					<div className="page-info">
						<p className="page-info-text">Showing</p>
						<p>{Math.min(currentPage * rowsPerPage, filteredData.length)}</p>
						<p className="page-info-text">from</p>
						<p>{filteredData.length}</p> <p className="page-info-text">items</p>
					</div>

					<div className="pagination-buttons">
						<select
							className="rows-dropdown"
							onChange={handleRowsPerPageChange}
							value={rowsPerPage}
						>
							{[10, 20, 50, 100].map((rows) => (
								<option key={rows} value={rows}>
									{rows} rows
								</option>
							))}
						</select>

						<button
							className="btn-pagination"
							onClick={() => setCurrentPage(1)}
							disabled={currentPage === 1}
						>
							<Icon name="double_arrow_left" width={20} height={20} color="#000" />
						</button>

						<button
							className="btn-pagination"
							onClick={handlePrevPageClick}
							disabled={currentPage === 1}
						>
							<Icon name="arrow_left" width={20} height={20} color="#000" />
						</button>

						<button
							className="btn-pagination"
							onClick={handleNextPageClick}
							disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
						>
							<Icon name="arrow_right" width={20} height={20} color="#000" />
						</button>

						<button
							className="btn-pagination"
							onClick={() => setCurrentPage(Math.ceil(filteredData.length / rowsPerPage))}
							disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
						>
							<Icon name="double_arrow_right" width={20} height={20} color="#000" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default MerchantTable;
