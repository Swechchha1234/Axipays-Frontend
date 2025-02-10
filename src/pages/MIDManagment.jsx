import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";

import { Input, Select } from "../components/utilitis/Input";
import Button from "../components/utilitis/Button.jsx";
import Icon from "../media/icon/icons";

import ResponsiveModal from "../components/utilitis/Modal.jsx";
import { apiRequest } from "../services/apiService";

import visa from "../media/image/visa.webp";
// import mastercard from "../media/image/mastercard.webp";
// import americanexpress from "../media/image/Amex.webp";
// import rupay from "../media/image/RuPay.webp";
import Heading,{headings} from "../components/utilitis/Heading.jsx";

import "../styles/pages.css";

function MIDManagement() {
  const apiEndpoint = "api/v1/mid/create-mid-and-mapping";
  const fetchDistinctValuesEndpoint = "api/v1/utility/getmetadata";
  const fetchmiddata = "api/v1/mid/mapping";

  const [activeTab, setActiveTab] = useState("View MID");
  const [step, setStep] = useState(1);

  // create modal select data
  const [trafficOptions, setTrafficOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [paymentgatewayOptions] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const [cardTypeOptions, setCardTypeOptions] = useState([]);
  const [acquirerOptions, setAquirerOptions] = useState([]);

  const [modalType, setModalType] = useState("");
  const [selectedMid, setSelectedMid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    midname: "",
    merchant: [],
    middescription: "",
    paymentGateway: "",
    industry: "",
    traffic: "",
    cardtype: "",
    currency: "",
  });
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [selectedAcquirerId, setSelectedAcquirerId] = useState(null);

  const bankDropdownRef = useRef(null);
  const [openBankDropdown, setOpenBankDropdown] = useState(null);
  const [groupedTableData, setGroupedTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = groupedTableData.slice(indexOfFirstRow, indexOfLastRow);

  // for progress bar
  const handleCircleClick = (circleStep) => setStep(circleStep);
  const nextStep = () => step < 3 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);
  const getProgressPercentage = () => ((step - 1) / 2) * 100;

  // pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Buttons
  const tabs = [
    { name: "View MID", iconName: "view_icon" },
    { name: "Manage Mapping", iconName: "manage_icon" },
    // { name: "Option 3", iconName: "option_icon" },
  ];

  //Cards

  // const cardImages = {
  //   "visa": visa,
  //   "mastercard": mastercard,
  //   "american express": americanexpress,
  //   "rupay": rupay
  // };

  // Useeffect for tableddata ,handleclick outside in the modal(edit) and for fetch options data

  useEffect(() => {
    fetchTableData(); fetchDistinctValues();
    fetchData("company");
    fetchData("acquirer");
    const handleClickOutside = (event) => {
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(event.target)
      ) {
        setOpenBankDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  //.......fetch function for table
  const fetchTableData = async () => {
    try {
      const response = await apiRequest(fetchmiddata, "GET");

      if (response.data) {
        const groupedData = groupByMIDName(response.data);
        setGroupedTableData(groupedData);
      } else {
        console.error("Data not available");
      }
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  const groupByMIDName = (data) => {
    const groupedData = [];
    const midOrder = new Map();
    let serialNo = 1;

    data.forEach((item, index) => {
      if (!midOrder.has(item.mid_name)) {
        midOrder.set(item.mid_name, index);
      }
    });

    data.sort((a, b) => midOrder.get(a.mid_name) - midOrder.get(b.mid_name));

    data.forEach((item, index) => {
      if (index === 0 || data[index - 1].mid_name !== item.mid_name) {
        const rowSpanCounter = data.filter(
          (d) => d.mid_name === item.mid_name
        ).length;
        groupedData.push({ ...item, rowSpan: rowSpanCounter, serialNo });
        serialNo++;
      } else {
        groupedData.push({ ...item, rowSpan: 0 });
      }
    });

    return groupedData;
  };


  //.......fetchfunction foe modal window

  const fetchDistinctValues = async () => {
    try {
      const response = await apiRequest(fetchDistinctValuesEndpoint, "GET");

      if (response.status === "success" && response.data) {
        const metadata = response.data[0];

        setCurrencyOptions(metadata.currency || []);
        setIndustryOptions(metadata.industry || []);
        setCardTypeOptions(metadata.card_type || []);
        setTrafficOptions(metadata.traffic || []);
      }
    } catch (error) {
      console.error("Error fetching distinct values:", error);
    }
  };

  const fetchData = async (type) => {
    try {
      let endpoint = "";
      let mapper = null;

      if (type === "company") {
        endpoint = "api/v1/client/?detailed=false";
        mapper = (item) => ({
          id: item.id,
          company_name: item.company_name,
        });
      } else if (type === "acquirer") {
        endpoint = "api/v1/acquirer/?detailed=false";
        mapper = (item) => ({
          id: item.id,
          acquirer_name: item.acquirer_name,
        });
      } else {
        throw new Error("Invalid type specified");
      }

      const response = await apiRequest(endpoint, "GET");

      if (response.data) {
        const mappedData = response.data.map(mapper);
        if (type === "company") {
          setCompanyNames(mappedData);
        } else if (type === "acquirer") {
          setAquirerOptions(mappedData);
        }
      } else {
        console.error("No data available");
        return [];
      }
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return [];
    }
  };

  const handleSubmit = async () => {
    const requestBody = {
      name: formData.midname,
      description: formData.middescription,
      industry: [formData.industry],
      traffic: [formData.traffic],
      card_type: [formData.cardtype],
      currency: [formData.currency],
      client_ids: selectedCompanyIds,
      acquirer_id: selectedAcquirerId,
    };
    // console.log("requestdatasfds", requestBody)
    try {
      const response = await apiRequest(apiEndpoint, "POST", requestBody);

      if (response.ok) {
        const data = await response.json();
        // console.log("MID Created Successfully:", data);
        alert("MID Created Successfully!");
      } else {
        throw new Error("Failed to create MID");
      }
    } catch (error) {
      console.error("Error creating MID:", error);
    }
  };

  //......... handle Input and search
  const handleInputChange = (field, value) => {
    setFormData((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };


  //......... modal widown funtions
  const openModal = (type, midToCheck = null) => {
    if (type === "create") {
      setStep(1);
      setModalType("create");
      setIsModalOpen(true);
      return;
    }

    const midData = groupedTableData.find((item) => item.mid_name === midToCheck);

    if (!midData) {
      console.error("MID not found");
      return;
    }

    setModalType(type);
    setIsModalOpen(true);
    setSelectedMid(midData);
  };

  const closeModal = () => setIsModalOpen(false);

  const toggleBankDropdown = (index) => {
    setOpenBankDropdown((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSelect = (type, value, additionalValue = null) => {
    if (type === 'acquirer') {
      setSelectedAcquirerId(value); 
      setFormData((prevState) => ({
        ...prevState,
        paymentGateway: [additionalValue], 
      }));
    } else if (type === 'merchant') {
      setFormData((prevState) => ({
        ...prevState,
        merchant: [...prevState.merchant, value], 
      }));

      const selectedCompany = companyNames.find(
        (company) => company.company_name === value
      );

      if (selectedCompany && !selectedCompanyIds.includes(selectedCompany.id)) {
        setSelectedCompanyIds((prevIds) => [...prevIds, selectedCompany.id]);
      }
    }
  };

  const handleRemoveMerchant = (name) => {
    setFormData((prevState) => ({
      ...prevState,
      merchant: prevState.merchant.filter((merchant) => merchant !== name),
    }));

    const selectedCompany = companyNames.find(
      (company) => company.company_name === name
    );

    if (selectedCompany) {
      setSelectedCompanyIds((prevIds) =>
        prevIds.filter((id) => id !== selectedCompany.id)
      );
    }
  };

  return (
    <>
      <Sidebar />
      <Header />
      <ResponsiveModal
        isOpen={isModalOpen}
        onClose={closeModal}
        centered
        title={modalType === "edit" ? "Edit MID Details" : modalType === "create" ? "Create New MID" : selectedMid?.mid_name || "MID Details"}
        titleClassName="custom-title-class"
        modalheaderClassName="custom-header"
        content=""
        onCancel={closeModal}
        confirmText=""
        cancelText=""
        overlay
        showbuttons={false}
      >
        {modalType === "create" && (
          <div className="multi-step-form">
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${getProgressPercentage()}%` }}
              >
                <div className="progress-circles">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="circle-content">
                      <div
                        key={index}
                        className={`circle ${step > index ? "completed" : ""}`}
                        onClick={() => handleCircleClick(index + 1)}
                        style={{ left: `${(index / (3 - 1)) * 100}%` }}
                      >
                        {step > index ? (
                          <div>
                            <Icon
                              name="check"
                              color="#fff"
                              width={12}
                              height={12}
                            />{" "}
                          </div>
                        ) : (
                          <div className="blue-dot">
                            <Icon
                              name="ellipse"
                              color="#fff"
                              width={5}
                              height={15}
                            />{" "}
                          </div>
                        )}
                      </div>
                      <p
                        className={`p-tag ${step > index ? "completed-text" : ""
                          }`}
                      >
                        {
                          ["MID Details", "Merchant Names", "Add Bank Details"][
                          index
                          ]
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {step === 1 && (
              <>
                <div className="form-section">
                  <h4>Mid Details</h4>
                  <div className="form-section-container">
                    <div className="mid-inputs">
                      <Input
                        id="midname"
                        value={formData.midname}
                        onChange={(value) =>
                          handleInputChange("midname", value)
                        }
                        placeholder="Mid Name"
                        className="serachid-input"
                      />
                      <Input
                        id="middiscription"
                        value={formData.middescription}
                        onChange={(value) =>
                          handleInputChange("middescription", value)
                        }
                        placeholder="Mid Description"
                        className="serachid-input"
                      />
                    </div>

                    <div className="managemid-modal-selects">
                      <Select
                        name="Industry"
                        id="industry"
                        value={formData.industry}
                        options={industryOptions}
                        onChange={(value) =>
                          handleInputChange("industry", value)
                        }
                      />
                      <Select
                        name="Traffic"
                        id="traffic"
                        value={formData.traffic}
                        options={trafficOptions}
                        onChange={(value) =>
                          handleInputChange("traffic", value)
                        }
                      />
                      <Select
                        name="CardType"
                        value={formData.cardtype}
                        id="cardtype"
                        options={cardTypeOptions}
                        onChange={(value) =>
                          handleInputChange("cardtype", value)
                        }
                      />
                      <Select
                        name="Currency"
                        value={formData.currency}
                        id="currency"
                        options={currencyOptions}
                        onChange={(value) =>
                          handleInputChange("currency", value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="button-group">
                  <Button onClick={nextStep} backgroundcolor="#003366" size="small">
                    <Icon
                      name="forward_arrow"
                      color="#fff"
                      width={15}
                      height={15}
                    />
                    Next{" "}
                  </Button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="form-section">
                  <h4>Merchant Names</h4>

                  <div className="selected-merchants">
                    {formData.merchant.length > 0 && (
                      <>
                        {formData.merchant.map((name, index) => (
                          <Button key={index} size="small" backgroundcolor='#D6EBFF8C'>
                            {name}
                            <span
                              type="button"
                              onClick={() => handleRemoveMerchant(name)}
                              className="remove-merchant-btn"
                            >
                              x
                            </span>
                          </Button>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="form-section-container">
                    <div className="input-grp">
                      <Icon
                        name="search"
                        width={22}
                        height={22}
                        color="#002966"
                      />
                      <Input
                        type="text"
                        placeholder="Search"
                        value={formData.merchant}
                        onChange={(value) =>
                          handleInputChange("merchant", value)
                        }
                      />
                    </div>
                    <ul className="merchant-options-list">
                      {companyNames.map((name, index) => (
                        <li key={index} onClick={() => handleSelect('merchant', name.company_name)}>{name.company_name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="button-group">
                  <Button onClick={prevStep} size="small"
                    backgroundcolor="transparent"
                    border="#c5c4c4dd"
                    textColor="#9e9999dd">
                    <Icon
                      name="back_arrow"
                      color="#888"
                      width={15}
                      height={15}
                    />{" "}
                    Back
                  </Button>
                  <Button onClick={nextStep} backgroundcolor="#003366" size="small">
                    <Icon
                      name="forward_arrow"
                      color="#fff"
                      width={15}
                      height={15}
                    />
                    Next{" "}
                  </Button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="form-section">
                  <h4>Add Bank Details</h4>
                  <div className="selected-merchants">
                    {selectedAcquirerId && (
                      <Button size="small" backgroundcolor='#D6EBFF8C'>{formData.paymentGateway[0]}
                        <span
                          type="button"
                          onClick={() => {
                            setSelectedAcquirerId(null);
                            setFormData((prevState) => ({
                              ...prevState,
                              paymentGateway: [],
                            }));
                          }}
                          className="remove-acquirer-btn"
                        >
                          x
                        </span>
                      </Button>
                    )}
                  </div>
                  <div className="form-section-container">
                    <div className="input-grp">
                      <Icon
                        name="search"
                        width={22}
                        height={22}
                        color="#002966"
                      />
                      <Input
                        type="text"
                        placeholder="Search"
                        value={formData.paymentGateway}
                        onChange={(value) =>
                          handleInputChange("paymentGateway", value)
                        }
                      />
                    </div>
                    <ul className="merchant-options-list">
                      {acquirerOptions.map((acquirer, index) => (
                        <li key={index} onClick={() => handleSelect('acquirer', acquirer.id, acquirer.acquirer_name)}> {acquirer.acquirer_name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="button-group">
                  <Button onClick={prevStep} size="small"
                    backgroundcolor="transparent"
                    border="#c5c4c4dd"
                    textColor="#9e9999dd">
                    <Icon
                      name="back_arrow"
                      color="#888"
                      width={15}
                      height={15}
                    />{" "}
                    Back
                  </Button>
                  <Button onClick={handleSubmit} backgroundcolor="#003366" size="small">
                    <Icon name="post_add" color="#fff" width={15} height={15} />{" "}
                    Create
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
        {modalType === "edit" && selectedMid && (
          <div className="edit-mid-form">
            <div className="modal-mid-name">
              MID Name
              <p className="modal-head-mid-name"> {selectedMid.mid_name}</p>
            </div>

            <h5>Added Merchant</h5>
            <div className="form-section-container grouped-mids">
              {groupedTableData
                .filter((item) => item.mid_name === selectedMid.mid_name)
                .map((item, index) => (
                  <div key={index} className="mid-item">
                    <p>{item.client_name}</p>
                    <div>
                      <span
                        onClick={() => toggleBankDropdown(index)}
                        className="bank-item"
                      >
                        {item.acquirer_name}
                        <Icon
                          name="keyboard_arrow_down"
                          width={20}
                          height={20}
                        ></Icon>
                      </span>

                      {openBankDropdown === index && (
                        <div className="bank-dropdown" ref={bankDropdownRef}>
                          <ul>
                            {paymentgatewayOptions.length > 0 ? (
                              paymentgatewayOptions.map((gateway, index) => (
                                <li key={index}>{gateway}</li>
                              ))
                            ) : (
                              <li>No payment gateways found</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div className="button-group">
              <Button onClick={closeModal} backgroundcolor="#003366" size="small">
                <Icon
                  name="edit_pen"
                  color="#fff"
                  width={20}
                  height={20}
                ></Icon>
                Edit
              </Button>
            </div>
          </div>
        )}

        {modalType === "details" && selectedMid && (
          <div className="mid-merchant-details">
            <div className="transaction-detail mid-merchant-description">
              <span className="view-transaction-head">Description</span>
              <span className="view-transaction-value">{selectedMid.description || "Description for merchant"}</span>
            </div>
            <div className="transaction-row mid-merchant-row">
              <div className="left-column">
                <div className="transaction-detail">
                  <span className="view-transaction-head">Industry</span>
                  <span className="view-transaction-value">{selectedMid.industry || "Gaming"}</span>
                </div>
                <div className="transaction-detail">
                  <span className="view-transaction-head">Traffic</span>
                  <span className="view-transaction-value">{selectedMid.traffic || "Trusted"}</span>
                </div>
              </div>

              <div className="sapration-line"></div>

              <div className="right-column">
                <div className="transaction-detail">
                  <span className="view-transaction-head">CardType</span>
                  <span className="view-transaction-value"> <img
                    src={visa}
                    alt="Card Type"
                    className="card-image"
                  />{selectedMid.cardtype || "VISA"}</span>
                </div>
                <div className="transaction-detail">
                  <span className="view-transaction-head">Currency</span>
                  <span className="view-transaction-value">{selectedMid.currency || "EUR"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </ResponsiveModal>

      <div className="main-screen dashboard">
      <Heading heading={headings.mmid} />

        <div className="manageMid-row1">
          <div className="manageMid-actions">
            {tabs.map((tab) => (
              <div
                key={tab.name}
                className={`tab-item ${activeTab === tab.name ? "active-mid-btn" : ""
                  }`}
                onClick={() => setActiveTab(tab.name)}
              >
                <Icon
                  name={tab.iconName}
                  color={activeTab === tab.name ? "#fff" : "#888"}
                  width={20}
                  height={20}
                />{" "}
                {tab.name}
              </div>
            ))}
          </div>
          <div className="manageMid-functionality">
            <div className="input-grp">
              <div className="ic">
                <Icon name="search" width={22} height={22} color="black" />
              </div>
              <Input type="text" placeholder="Search" />
            </div>
            <Button className="btn-medium" onClick={() => openModal("create")} backgroundcolor="#003366" size="medium">
              <Icon name="post_add" color="#fff" width={20} height={20}></Icon>
              Create New MID
            </Button>
          </div>
        </div>

        <div className="manageMid-row2">
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>MID Name</th>
                <th>Merchant</th>
                <th>Bank</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => (
                <tr key={index}>
                  {row.rowSpan > 0 && (
                    <td rowSpan={row.rowSpan}>{row.serialNo}</td>
                  )}
                  {row.rowSpan > 0 && (
                    <td rowSpan={row.rowSpan} ><div onClick={() => openModal("details", row.mid_name)} className="mid-name-row">{row.mid_name}</div></td>
                  )}
                  <td>{row.client_name}</td>
                  <td>{row.acquirer_name}</td>
                  {row.rowSpan > 0 && (
                    <td rowSpan={row.rowSpan}>
                      <div className="detail-icon-div">
                      <div
                        className="detail-icon"
                        onClick={() => openModal("edit", row.mid_name)}
                      >
                        <Icon
                          name="edit_pen"
                          width={20}
                          height={20}
                          color="#002966"
                        />
                      </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="tableEnd">
            <div className="pagination-info">
              <div className="page-info">
                <p className="page-info-text">Showing</p>{" "}
                <p>{currentRows.length}</p>{" "}
                <p className="page-info-text">from</p>{" "}
                <p>{groupedTableData.length}</p>{" "}
                <p className="page-info-text">items</p>
              </div>

              <div className="pagination-buttons">
                <select className="rows-dropdown" value="10">
                  {[10, 20, 50, 100].map((rows) => (
                    <option key={rows} value={rows}>
                      {rows} rows
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handlePageChange(1)}
                  className="btn-pagination"
                >
                  <Icon
                    name="double_arrow_left"
                    width={20}
                    height={20}
                    color="#000"
                  />
                </button>

                <button
                  className="btn-pagination"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <Icon name="arrow_left" width={20} height={20} color="#000" />
                </button>

                <button
                  className="btn-pagination"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <Icon
                    name="arrow_right"
                    width={20}
                    height={20}
                    color="#000"
                  />
                </button>

                <button
                  className="btn-pagination"
                  onClick={() =>
                    handlePageChange(
                      Math.ceil(groupedTableData.length / rowsPerPage)
                    )
                  }
                >
                  <Icon
                    name="double_arrow_right"
                    width={20}
                    height={20}
                    color="#000"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="footer-section">
                <p>©2024 Axipays. All rights reserved.</p>
            </div>
        </div>
      </div>
    </>
  );
}

export default MIDManagement;
