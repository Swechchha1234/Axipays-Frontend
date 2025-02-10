import React, {useState} from "react";

import "../styles/pages.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {Input} from "../components/utilitis/Input";

function AddAcquirer() {

    // Initial state for the form fields
    const [formData, setFormData] = useState({
        name: '',
        currency: '',
        cardTypes: '',
        countriesAccepted: '',
        countriesBlacklisted: '',
        dailyLimit: '',
        monthlyLimit: '',
        perTxnAmountLimit: '',
        perCardVelocityLimit: '',
        perCardDeclinedTxnLimit: '',
        apiDocLink: '',
        apiCredentials: '',
        loginAccountLink: ''
    });

    // Handle Input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(formData);
    };

  return (
    <>
      <Header />
      <Sidebar />

      <div className="main-screen add-acquirer">
        <h2>Add Acquirer</h2>
        <form onSubmit={handleSubmit}>
            {/* Acquirer Name */}
            <div className="add-acquirer-input-group">
                <label htmlFor="name">Name</label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            {/* Currency */}
            <div>
                <label htmlFor="currency">Currency</label>
                <Input
                    type="text"
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    placeholder="e.g., USD, EUR"
                />
            </div>

            {/* Card Types (Multi-select) */}
            <div>
                <label htmlFor="cardTypes">Card Types</label>
                <Input
                    type="text"
                    id="cardTypes"
                    name="cardTypes"
                    value={formData.cardTypes}
                    onChange={handleChange}
                    placeholder="e.g., Visa, Mastercard"
                />
            </div>

            {/* Countries Accepted */}
            <div>
                <label htmlFor="countriesAccepted">Countries Accepted</label>
                <Input
                    type="text"
                    id="countriesAccepted"
                    name="countriesAccepted"
                    value={formData.countriesAccepted}
                    onChange={handleChange}
                    placeholder="Comma-separated country codes, e.g., US, CA, UK"
                    required
                />
            </div>

            {/* Countries Blacklisted */}
            <div>
                <label htmlFor="countriesBlacklisted">Countries Blacklisted</label>
                <Input
                    type="text"
                    id="countriesBlacklisted"
                    name="countriesBlacklisted"
                    value={formData.countriesBlacklisted}
                    onChange={handleChange}
                    placeholder="Comma-separated country codes, e.g., IR, SY"
                />
            </div>

            {/* Daily Limit */}
            <div>
                <label htmlFor="dailyLimit">Daily Limit</label>
                <Input
                    type="text"
                    id="dailyLimit"
                    name="dailyLimit"
                    value={formData.dailyLimit}
                    onChange={handleChange}
                    placeholder="e.g., 10000"
                />
            </div>

            {/* Monthly Limit */}
            <div>
                <label htmlFor="monthlyLimit">Monthly Limit</label>
                <Input
                    type="text"
                    id="monthlyLimit"
                    name="monthlyLimit"
                    value={formData.monthlyLimit}
                    onChange={handleChange}
                    placeholder="e.g., 300000"
                />
            </div>

            {/* Per Transaction Amount Limit */}
            <div>
                <label htmlFor="perTxnAmountLimit">Per Transaction Amount Limit</label>
                <Input
                    type="text"
                    id="perTxnAmountLimit"
                    name="perTxnAmountLimit"
                    value={formData.perTxnAmountLimit}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                />
            </div>

            {/* Per Card Velocity Limit */}
            <div>
                <label htmlFor="perCardVelocityLimit">Per Card Velocity Limit</label>
                <Input
                    type="text"
                    id="perCardVelocityLimit"
                    name="perCardVelocityLimit"
                    value={formData.perCardVelocityLimit}
                    onChange={handleChange}
                    placeholder="e.g., 5 transactions per day"
                />
            </div>

            {/* Per Card Declined Transaction Limit */}
            <div>
                <label htmlFor="perCardDeclinedTxnLimit">Per Card Declined Transaction Limit</label>
                <Input
                    type="text"
                    id="perCardDeclinedTxnLimit"
                    name="perCardDeclinedTxnLimit"
                    value={formData.perCardDeclinedTxnLimit}
                    onChange={handleChange}
                    placeholder="e.g., 3 declined transactions per day"
                />
            </div>

            {/* API Documentation Link */}
            <div>
                <label htmlFor="apiDocLink">API Documentation Link</label>
                <Input
                    type="url"
                    id="apiDocLink"
                    name="apiDocLink"
                    value={formData.apiDocLink}
                    onChange={handleChange}
                    placeholder="https://example.com/api-docs"
                />
            </div>

            {/* API Credentials */}
            <div>
                <label htmlFor="apiCredentials">API Credentials</label>
                <Input
                    id="apiCredentials"
                    name="apiCredentials"
                    value={formData.apiCredentials}
                    onChange={handleChange}
                    placeholder="Enter API credentials (key, secret, etc.)"
                />
            </div>

            {/* Login Account Link */}
            <div>
                <label htmlFor="loginAccountLink">Login Account Link</label>
                <Input
                    type="url"
                    id="loginAccountLink"
                    name="loginAccountLink"
                    value={formData.loginAccountLink}
                    onChange={handleChange}
                    placeholder="https://example.com/login"
                />
            </div>

            {/* Submit Button */}
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
      </div>
    </>
  );
}

export default AddAcquirer;