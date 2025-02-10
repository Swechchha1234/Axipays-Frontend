import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// css
import './styles/global.css';

// components
// import FullScreenLoader from './components/FullScreenLoader.jsx';
import NotFound from "./components/404NotFound";

// pages
import Auth from './pages/Auth.jsx';
// import Website from './pages/website/Landing.jsx';

import Dashboard from "./pages/Dashboard.jsx";
import ManageMerchant from "./pages/ManageMerchant.jsx";
import ManageUser from "./pages/ManageUser.jsx";
import ViewMerchant from "./pages/ViewMerchant.jsx";
import ViewUser from "./pages/ViewUser.jsx";
import TransactionMonitoring from "./pages/TransactionMonitoring.jsx";

import MIDManagment from "./pages/MIDManagment.jsx";

import AddAcquirer from "./pages/AddAcquirer.jsx";
import PaymentDetails from "./pages/PaymentForm.jsx";
import ManageSettlement from "./pages/ManageSettlement.jsx";
import RefundAndChargebacks from "./pages/Refund&Chargebacks.jsx";
import Calendar from "./components/utilitis/Calender.jsx";
import MailTemplate from "./pages/MailTemplate.jsx";

// lazy loading
// const Website = React.lazy(() => import("./pages/website/Landing.jsx"));
// const ComingSoon = React.lazy(() => import("./pages/website/comingSoon/ComingSoon"));

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					{/* <Route 
						path="/" 
						element={
							<Suspense fallback={< FullScreenLoader />}>
								<ComingSoon />
							</Suspense>
						} 
					/> */}
					{/* <Route 
						path="/" 
						element={
							<Suspense fallback={< FullScreenLoader />}>
								<Website />
							</Suspense>
						} 
					/>
					<Route 
						path="/web" 
						element={
							<Suspense fallback={< FullScreenLoader />}>
								<Website />
							</Suspense>
						} 
					/> */}
					<Route path="/" element={<Auth />} />
					<Route path="/auth" element={<Auth />} />
					<Route path="/home" element={<Dashboard />} />
					<Route path="/addacquirer" element={<AddAcquirer />} />
					<Route path="/managemerchant" element={<ManageMerchant />} />
					<Route path="/manageuser" element={<ManageUser/>} />
					<Route path="/viewmerchant/:userId" element={<ViewMerchant />} />
					<Route path="/viewuser/:clientId" element={<ViewUser />} />
					<Route path="/transactionmonitoring" element={<TransactionMonitoring />} />

					<Route path="/midmanagment" element={<MIDManagment />} />
					<Route path="/paymentform" element={<PaymentDetails />} />
					<Route path="/managesettlement" element={<ManageSettlement />} />
					<Route path="/refundandchargebacks" element={<RefundAndChargebacks />} />

					<Route path="/calendar" element={<Calendar />} />
					<Route path="/mailtemplate" element={<MailTemplate/>}/>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
