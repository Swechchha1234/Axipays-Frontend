import React, { useState, useEffect} from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";

import { Input } from "../components/utilitis/Input";
import Button from "../components/utilitis/Button.jsx";
import Icon from "../media/icon/icons";
import Heading,{headings} from "../components/utilitis/Heading.jsx";

import { apiRequest } from "../services/apiService";


import "../styles/pages.css";
import MerchantTable from "../components/MerchantTable.jsx";

function ManageSettlement() {
  const fetchmiddata = "api/v1/mid/mapping";
  const currentYear = new Date().getFullYear(); 

  const [headerLabels] = useState([
        { id: 1, heading: "Clients", label: "clients" },
        { id: 2, heading: "Status", label: "status" },
        { id: 3, heading: "Type", label: "type" },
        { id: 4, heading: "Issued On", label: "issued_date" },
        { id: 5, heading: "Rates", label: "rates" },
    ]);

  useEffect(() => {
    fetchTableData();
  });

  //.......fetch function for table
  const fetchTableData = async () => {
    try {
      const response = await apiRequest(fetchmiddata, "GET");

      if (response.data) {
      } else {
        console.error("Data not available");
      }
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  return (
    <>
      <Sidebar />
      <Header />

      <div className="main-screen dashboard">
      <Heading heading={headings.msettlement} />

        <div className="manageMid-row1">
          <div className="managesettle-details">
            <div>
                <h4>Clients</h4>
                <p>52</p>
            </div>
          <div className="sapration-line"></div>
          <div>
                <h4>Invoice</h4>
                <p>52</p>
            </div>
          </div>
          <div className="manageMid-functionality">
            <div className="input-grp">
              <div className="ic">
                <Icon name="search" width={22} height={22} color="black" />
              </div>
              <Input type="text" placeholder="Search" />
            </div>
            <Button className="btn-medium" backgroundcolor="#003366" size="medium">
              <Icon name="post_add" color="#fff" width={20} height={20}></Icon>
              Create Invoice
            </Button>
          </div>
        </div>

        <div className="manageMid-row2">
          <MerchantTable headerLabels={headerLabels} />
        </div>
        <div className="footer-section">
					<p>©{currentYear} Axipays. All rights reserved.</p>
				</div>
      </div>
    </>
  );
}

export default ManageSettlement;
