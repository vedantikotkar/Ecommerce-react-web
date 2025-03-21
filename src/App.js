import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Home from "./components/Home"
import TodaysDeals from "./components/TodaysDeals";
import Wishlist from "./components/Wishlist";
import "./App.css";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import Account from "./components/Account";
import ContactPage from "./components/ContactPage";
import ProductDetail from "./components/ProductDetailsPage";
import EmailOTPLogin from "./components/Verify";
import RecommendedProducts from "./components/RecommendedProducts";
import Orders from "./components/Orders";
import SearchResults from "./components/SearchResults";
import AddressForm from "./components/AddressForm";
import PaymentPage from "./components/PaymentPage";
import AddressPage from "./components/AddressPage";
import OrderSummary from "./components/OrderSummary";
import ProgressBar from "./components/ProgressBar";
import PaymentSuccess from "./components/PaymentSuccess";
import AboutPage from "./components/AboutPage";
import CategoryProducts from "./components/CategoryProducts";
import AllProducts from "./components/AllProducts";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import ForgetPassword from "./components/ForgetPassword";
import PaymentIntegration from "./components/PaymentIntegration";
import PaymentFailed from "./components/PaymentFailed";
function App() {
  const [userAddress, setUserAddress] = useState("");
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/todaysdeals" element={<TodaysDeals />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/productdetail/:productId" element={<ProductDetail />} />
          <Route path="/verify" element={<EmailOTPLogin />} />
          <Route path="/recommended" element={<RecommendedProducts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/address-form" element={<AddressForm />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/progress" element={<ProgressBar />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgetPassword/>} />
          <Route path="/payment-integration" element={<PaymentIntegration />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route
            path="/address"
            element={<AddressPage userAddress={userAddress} setUserAddress={setUserAddress} />}
          />
          <Route
            path="/order-summary"
            element={<OrderSummary userAddress={userAddress} />}
          />
          <Route path="/payment" element={<PaymentPage />} />


          <Route path="/category/:categoryId" element={<CategoryProducts />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
