import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/component.css';
import Icon from "../media/icon/icons.jsx";
import AxipaysFull_log from '../media/image/axipays-full-logo.webp';

function Sidebar() {
    const role = sessionStorage.getItem('role');
    const clientId = sessionStorage.getItem('clientId');
    const location = useLocation();
    const [activeItem, setActiveItem] = useState("");
    const [openSubmenus, setOpenSubmenus] = useState({}); 

    useEffect(() => {
        const currentPath = location.pathname;

        const findActiveItem = (items) => {
            for (let section of items) {
                for (let item of section.items) {
                    if (item.link === currentPath) {
                        return item.name;
                    }
                    if (item.submenu) {
                        for (let subItem of item.submenu) {
                            if (subItem.link === currentPath) {
                                return subItem.name;
                            }
                        }
                    }
                }
            }
            return null;
        };

        const SidebarContent = 
  role === "admin" ? sidebarItems.admin : 
  role === "merchant" ? sidebarItems.merchant : 
  role === "employee" ? sidebarItems.employee : [];

        const active = findActiveItem(SidebarContent);
        if (active) setActiveItem(active);
    }, [location, role]);

    const handleItemClick = (itemName, hasSubmenu = false) => {
        if (hasSubmenu) {
            setOpenSubmenus((prev) => ({
                ...prev,
                [itemName]: !prev[itemName], 
            }));
        } else {
            setActiveItem(itemName); 
        }
    };

    const sidebarItems = {
        admin: [
            {
                section: "Dashboard",
                items: [{ name: "Overview", icon: "overview", link: "/home" }]
            },
            {
                section: "Management",
                items: [
                    { name: "Manage Merchant", icon: "person_book", link: "/managemerchant" },
                    { name: "Manage User", icon: "group", dropdown: false, link: "/manageuser" },
                    { name: "Manage Settlement", icon: "checkbook", link: "/managesettlement" },
                    { name: "Manage API Doc", icon: "apk_document", link: "/home", disabled: true },
                    { name: "Manage Mid", icon: "apk_document", link: "/midmanagment", target: "_self" }
                ]
            },
            {
                section: "Transactions",
                items: [
                    { name: "Payment Gateway", icon: "paymentgateway", link: "/home", disabled: true },
                    { name: "Transaction Monitoring", icon: "id_card", link: "/transactionmonitoring" },
                    {
                        name: "Refund & ChargeBacks",
                        icon: "payment",
                        dropdown: true,
                        submenu: [
                            { name: "Create Refund", link: "/refundandchargebacks" },
                            { name: "View Refund", link: "/refundandchargebacks", disabled: true },
                            { name: "View Chargeback", link: "/refundandchargebacks",disabled: true },
                        ]
                    },
                    { name: "Report", icon: "report", link: "/home", disabled: true }
                ]
            },
            {
                section: "Others",
                items: [
                    { name: "AQ Test", icon: "apps", link: "https://payopay.online/" },
                    { name: "API Doc", icon: "master_settings", link: "https://developers.axipays.com/" },
                    { name: "Master Setting", icon: "master_settings", link: "/home", disabled: true }
                ]
            }
        ],
        merchant: [
            {
                section: "Dashboard",
                items: [{ name: "Overview", icon: "overview", link: "/home" }]
            },
            {
                section: "Console",
                items: [
                    { name: "View Profile", icon: "person_book",  link: `/viewmerchant/${clientId}` },
                    { name: "View Sub-Users", icon: "group", dropdown: false, link: "/manageuser", disabled: true },
                    { name: "View Settlement", icon: "checkbook", link: "/managesettlement", disabled: true }
                ]
            },
            {
                section: "Transactions",
                items: [
                    { name: "Transaction Monitoring", icon: "id_card", link: "/transactionmonitoring" },
                    {
                        name: "Refund & ChargeBacks",
                        icon: "payment",
                        dropdown: true,
                        disabled: true,
                        submenu: [
                            { name: "Create Refund", link: "/refundandchargebacks" },
                            { name: "View Refund", link: "/refundandchargebacks",disabled: true },
                            { name: "View Chargeback", link: "/refundandchargebacks",disabled: true },
                        ]
                    },
                    { name: "Report", icon: "report", link: "/home", disabled: true }
                ]
            },
            {
                section: "Others",
                items: [
                    { name: "AQ Test", icon: "apps",link: "https://payopay.online/", disabled: true },
                    { name: "API Doc", icon: "master_settings", link: "https://developers.axipays.com/" },
                ]
            }
        ],
        employee: [
            {
                section: "Dashboard",
                items: [{ name: "Overview", icon: "overview", link: "/home" }]
            },
            {
                section: "Promotional Emailing",
                items: [
                    { name: "Email", icon: "person_book",  link: "/mailtemplate" },
                ]
            },
        ]
    };

    const SidebarItem = ({ item }) => {
        const handleClick = (e) => {
            if (item.disabled) {
                e.preventDefault(); 
            } else {
                handleItemClick(item.name, item.dropdown);
            }
        };
    
        return (
            <div>
                <Link
                    to={item.disabled ? "#" : item.link || "#"}
                    className={`sidebar-item ${activeItem === item.name ? "active" : ""} ${item.disabled ? "disabled" : ""} ${
                        item.dropdown ? "expandable" : ""
                    }`}
                    onClick={handleClick}
                >
                    <i className="icon">
                        <Icon name={item.icon} width={22} height={22} color={item.disabled ? "grey" : "black"} />
                    </i>
                    <span className={`sidebar-item-name ${item.disabled ? "disabled-text" : ""}`}>{item.name}</span>
                    {item.dropdown && (
                        <i className="icon icon2">
                            <Icon
                                name={openSubmenus[item.name] ? "keyboard_arrow_down" : "arrow_right"}
                                width={22}
                                height={22}
                                color={item.disabled ? "grey" : "black"}
                            />
                        </i>
                    )}
                </Link>
                {item.dropdown && openSubmenus[item.name] && !item.disabled && (
                    <div className="submenu">
                        {item.submenu.map((subItem) => (
                            <Link
                                key={subItem.name}
                                to={subItem.link || "#"}
                                className={`submenu-item ${activeItem === subItem.name ? "active" : ""}`}
                                onClick={() => handleItemClick(subItem.name, true)}
                            >
                                <span>{subItem.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };  

    const renderSidebarItems = (items) =>
        items.map((section) => (
            <div key={section.section} className="sidebar-section">
                <h4 className="section-title">{section.section}</h4>
                {section.items.map((item) => (
                    <SidebarItem key={item.name} item={item} />
                ))}
            </div>
        ));

    const SidebarContent = role === "admin" ? sidebarItems.admin : role === "client" ? sidebarItems.merchant : role === "employee"? sidebarItems.employee : [];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src={AxipaysFull_log} alt="Axipays full logo" />
            </div>
            <div className="sidebar-body">
                <div className="scrollable-content">{renderSidebarItems(SidebarContent)}</div>
            </div>
            <div className="sidebar-footer"></div>
        </div>
    );
}

export default Sidebar;
