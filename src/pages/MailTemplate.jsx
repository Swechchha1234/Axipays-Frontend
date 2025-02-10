import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Heading, { headings } from "../components/utilitis/Heading";
import Button from "../components/utilitis/Button";
import EmailComponent from "./Email";

const MailTemplate = () => {
    const [activeTab, setActiveTab] = useState("Mail");

    return (
        <>
            <Header />
            <Sidebar />
            <div className="main-screen em-screen">
                <div className="em-head"> <Heading heading={headings.mail} /><div className="em-tabs">
                    <Button backgroundcolor="#003366" size="medium"
                        className={`tab-button ${activeTab === "Mail" ? "active" : ""}`}
                        onClick={() => setActiveTab("Mail")}
                    >
                        Mail
                    </Button>
                    <Button
                        backgroundcolor="#003366" size="medium"
                        className={`tab-button ${activeTab === "Referral Mail" ? "active" : ""}`}
                        onClick={() => setActiveTab("Referral Mail")}
                    >
                        Referral Mail
                    </Button>
                </div></div>
                {activeTab === "Mail" ? (
                    <>
                        <EmailComponent />
                    </>
                ) : (
                    <>
                        <EmailComponent>Referral</EmailComponent>
                    </>
                )}

            </div>
        </>
    );
};

export default MailTemplate;
