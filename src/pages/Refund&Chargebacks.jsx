import React, { useState, useEffect } from "react";

import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Table from "../components/MerchantTable.jsx";
import Icon from "../media/icon/icons.jsx";
import Button from "../components/utilitis/Button.jsx";
import { Input } from "../components/utilitis/Input.jsx";
import Heading,{headings} from "../components/utilitis/Heading.jsx";

import Loader from "../components/utilitis/Loader";

function ReefundAndChargebacks() {
    const currentYear = new Date().getFullYear();
    const [filters, setFilters] = useState({
        searchIds: "",
    });
    const [ids, setIds] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const [headerLabels] = useState([
        { id: 1, heading: "Transaction ID", label: "transactionId" },
        { id: 2, heading: "Amount", label: "totalAmount" },
        { id: 3, heading: "Currency", label: "currency" },
        { id: 4, heading: "Transaction Status", label: "transactionstatus" },
    ]);

    const [tableData, setTableData] = useState([]);
    const [dummyData, setDummyData] = useState([]);

    const fetchDummyData = async () => {
        setLoading(true);
        const data = [
            {
                transactionId: "TX123456789",
                merchantTxnId: "MTX0987654321",
                acquireId: "ACQ54321",
                customerName: "John Doe",
                merchantName: "Example Store",
                acquireName: "Acquirer Bank",
                customerEmail: "john.doe@example.com",
                transactionDate: "2024-12-30",
                cardNumber: "**** **** **** 1234",
                totalAmount: "100.00",
                refundAmount: "20.00",
                currency: "USD",
                transactionstatus: "success",
                refundStatus: "Pending",
            },
            {
                transactionId: "TX987654321",
                merchantTxnId: "MTX123456789",
                acquireId: "ACQ12345",
                customerName: "Jane Smith",
                merchantName: "Another Store",
                acquireName: "Another Bank",
                customerEmail: "jane.smith@example.com",
                transactionDate: "2024-12-31",
                cardNumber: "**** **** **** 5678",
                totalAmount: "200.00",
                refundAmount: "50.00",
                currency: "EUR",
                transactionstatus: "fail",
                refundStatus: "Refunded",
            },
        ];

        setTimeout(() => {
            setDummyData(data);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchDummyData();
    }, []);

    const handleInputChange = (filtersKey, value) => {
        if (filtersKey === "searchIds") {
            const newIds = value.trim().split(/\s+/).filter((id) => id);
            setIds(newIds);

            if (newIds.length <= 1) {
                setShowDropdown(false);
            }

            setFilters((prevData) => ({
                ...prevData,
                [filtersKey]: value,
            }));
        } else {
            setFilters((prevData) => ({
                ...prevData,
                [filtersKey]: value,
            }));
        }
    };

    const handleSearch = () => {
        if (!filters.searchIds.trim()) {
            setTableData([]);
            return;
        }

        const searchIds = filters.searchIds
            .trim()
            .split(/\s+/)
            .filter((id) => id);

        const filteredData = dummyData.filter((item) =>
            searchIds.includes(item.transactionId)
        );

        setTableData(filteredData);
    };

    const handleClear = () => {
        setFilters({
            searchIds: "",
        });
        setTableData([]);
        setShowDropdown(false);
        setIds(false);
    };


    return (
        <>
            <Header />
            <Sidebar />
            <div className="main-screen">
            <Heading heading={headings.crefund} />
                <div className="refundandchargeback">
                    <div className="id-search-row-div">
                        <div className="serachid-row">
                            <Input
                                label="Id"
                                id="searchIds"
                                value={filters.searchIds}
                                onChange={(value) =>
                                    handleInputChange("searchIds", value)
                                }
                                placeholder="Txn id / Merchant txn id"
                            />
                            {ids.length > 1 && (
                                <span
                                    className="dropdown-icon"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <Icon
                                        name={showDropdown ? "zoom_out" : "hide"}
                                        width={18}
                                        height={18}
                                        color="#dedddd"
                                    />
                                </span>
                            )}
                            {showDropdown && (
                                <div className="dropdown">
                                    {ids.map((id, index) => (
                                        <div key={index} className="dropdown-item">
                                            {id}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="search-clear-btn">
                            <Button
                                onClick={handleSearch}
                                className="btn-medium"
                                backgroundcolor="#003366"
                                size="medium"
                            >
                                {loading ? (
                                    <Loader
                                        strokeColor="#fafafa"
                                        width={20}
                                        height={20}
                                    />
                                ) : (
                                    <>
                                        <Icon
                                            name="search"
                                            width={20}
                                            height={20}
                                            color="#fff"
                                        />
                                    </>
                                )}
                                Search Now
                            </Button>
                            <Button
                                onClick={handleClear}
                                className="btn-secondary"
                                backgroundcolor="transparent"
                                size="medium"
                                textColor="#007bff"
                                border="#007bff"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                    <div className="manageuser-table">

                        <Table
                            headerLabels={headerLabels}
                            filteredMerchants={tableData}
                            moreIcon={true}
                        />

                    </div>
                </div>
                <div className="footer-section">
                    <p>©{currentYear} Axipays. All rights reserved.</p>
                </div>
            </div>
        </>
    );
}

export default ReefundAndChargebacks;
