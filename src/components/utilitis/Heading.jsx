import React from "react";
import { useNavigate } from "react-router-dom"; 
import Icon from "../../media/icon/icons";

export const headings = {
    dashboard: "Dashboard",
    mmerchant:"Manage Merchant",
    msettlement:"Manage Settlement",
    muser:"Manage User",
    mmid:"Manage Mid",
    crefund:"Create Refund",
    transaction: "Transaction Monitoring",
    vmerchant:"View Merchant",
    vuser:"View User"
};

const Heading = ({ heading }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); 
    };

    const validatedHeading = typeof heading === "string" ? heading : "Default Heading";

    return (
        <div className="manage-main-head">
            {validatedHeading !== headings.dashboard && ( 
                <div className="back-to-previous">
                    <Icon
                        name="back_arrow"
                        color="#00478f"
                        onClick={handleBack}
                        width={18}
                        height={18}
                    />
                </div>
            )}
            <h4>{validatedHeading}</h4>
        </div>
    );
};

export default Heading;
