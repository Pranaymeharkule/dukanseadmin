  import { useState } from "react";
  import { Routes, Route } from "react-router-dom";
  import Login from "../pages/auth/Login";
  import Reset from "../pages/auth/Reset";
  import Layout from "../components/layouts/Layout";
  import Dashboard from "../pages/Dashboard/Dashboard";
  import LogoutPage from "../pages/logout/LogoutPage";
  import PrivacyPolicy from "../pages/privacypolicy/PrivacyPolicy";
  import PrivacyPolicyEdit from "../pages/privacypolicy/PrivacyPolicyEdit";
  import Profile from "../pages/Profile/Profile";
  import ProfileEdit from "../pages/Profile/ProfileEdit";
  import Customer from "../pages/customer/Customer";
  import CustomerProfile from "../pages/customer/CustomerProfile";
  import ViewOrder from "../pages/customer/ViewOrder";
  import EditCustomer from "../pages/customer/EditCustomer";
  import Shop from "../pages/shop/Shop";
  import ViewShop from "../pages/shop/ViewShop";
  import EditShopInfo from "../pages/shop/EditShopInfo";
  import ViewRegisterShop from "../pages/shop/ViewRegisterShop";
  import NewRegister from "../pages/shop/NewRegister";
  import ProductList from "../pages/product/ProductList";
  import ProductDetails from "../pages/product/ProductDetai";
  import EditProduct from "../pages/product/EditProduct";
  import AddProduct from "../pages/product/AddProduct";
  import OrderList from "../pages/order/OrderList";
  import Refer from "../pages/referrals/Refer";
  import Gullak from "../pages/gullak/Gullak";
  import Payment from "../pages/payments/Payment";
  import ViewPayment from "../pages/payments/ViewPayment";
  import OfferList from "../pages/offer/OfferList";
  import TermsCondition from "../pages/terms/TermsCondition";
  import EditTermsCondition from "../pages/terms/EditTermsCondition";
  import ViewOffer from "../pages/offer/ViewOffer";
  import AllNotification from "../pages/notification/AllNotification";
  import AddNotificationForm from "../pages/notification/AddNotificationForm";
  import HelpSupport from "../pages/helpsupport/HelpSupport";
  import FaqEdit from "../pages/helpsupport/FaqEdit";
  import FaqView from "../pages/helpsupport/FaqView";
  import FaqAdd from "../pages/helpsupport/FaqAdd";
  import CustomerComplaints from "../pages/helpsupport/CustomerComplaints";
  import CustomerSupportNumber from "../pages/helpsupport/CustomerSupportNumber";
  import Faq from "../pages/helpsupport/Faq";
  import EditOffer from "../pages/offer/EditOffer";
  import AddOffer from "../pages/offer/AddOffer";
  import AddTermCondition from "../pages/offer/AddTermCondition";
  import EditOfferTerms from "../pages/offer/EditOfferTerms";
  import ViewTermCondition from "../pages/offer/ViewTermCondition";
  import OrderDetails from "../pages/order/OrderDetails";   
  import RiskMonitoring from "../pages/monitoring/RiskMonitoring";


  const AppRoutes = () => {
    const [activeTab, setActiveTab] = useState("/");
    return (
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/reset" element={<Reset />} />

        <Route
          path="/dashboard"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              {" "}
              <Dashboard />{" "}
            </Layout>
          }
        />

        <Route
          path="profile/edit"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ProfileEdit />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/customer"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Customer />
            </Layout>
          }
        />

        <Route
          path="/customer/profile/:customerId"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <CustomerProfile />
            </Layout>
          }
        />



        <Route
        path="/order/details/:orderId"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <OrderDetails />
          </Layout>
        }
      />





        <Route
          path="/customer/edit/:customerId"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <EditCustomer />
            </Layout>
          }
        />

        <Route
          path="/shop"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Shop />
            </Layout>
          }
        />

        <Route
          path="/shop/view/:id"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ViewShop />
            </Layout>
          }
        />
        <Route
          path="/shop/info/edit-seller"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <EditShopInfo />
            </Layout>
          }
        />

        <Route
          path="/shop/info/:shopId"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ViewShop />
            </Layout>
          }
        />

        <Route
          path="/shop/info/edit-seller/:shopId"
          element={<Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <EditShopInfo />
          </Layout>
          }
        />
        <Route
          path="/shop/registere/info/:shopId" // <-- The only change is here
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ViewRegisterShop />
            </Layout>
          }
        />



        <Route
          path="/shop/info/:shopId"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ViewShop />
            </Layout>} />



        <Route
          path="/shop/viewshop"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ViewShop />
            </Layout>
          }
        />
        <Route
          path="/shop/newregister"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <NewRegister />
            </Layout>
          }
        />

        <Route
          path="/product"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ProductList />
            </Layout>
          }
        />

        <Route
          // path="/product/detail"
          path="/product/details/:id"

          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ProductDetails />
            </Layout>
          }
        />

        <Route
          path="/product/detail/edit/:id"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <EditProduct />
            </Layout>
          }
        />

        <Route
          path="/product/product-add"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <AddProduct />
            </Layout>
          }
        />

        <Route
          path="/order"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <OrderList />
            </Layout>
          }
        />

        <Route
          path="/order/details/:orderId"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <OrderDetails />
            </Layout>
          }
        />

        <Route
          path="/View/Order/:orderId"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ViewOrder />
            </Layout>
          }
        />



        

        <Route
          path="/refer"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Refer />
            </Layout>
          }
        />

        <Route
          path="/gullak"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Gullak />
            </Layout>
          }
        />

        <Route
          path="/payment"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Payment />
            </Layout>
          }
        />

        <Route
          path="/payment/viewpayment/:orderId"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ViewPayment />
            </Layout>
          }
        />

        <Route
        path="/offer"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <OfferList />
          </Layout>
        }
      />
      <Route
        path="/offer/add"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <AddOffer />
          </Layout>
        }
      />
      <Route
        path="/offer/edit/:offerId"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <EditOffer />
          </Layout>
        }
      />
      <Route
        path="/offer/view/:offerId"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <ViewOffer />
          </Layout>
        }
      />
      <Route
        path="/offer/add-terms"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <AddTermCondition />
          </Layout>
        }
      />
      <Route
        path="/offer/edit-terms/:offerId"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <EditOfferTerms />
          </Layout>
        }
      />
      <Route
        path="/offer/view-terms/:offerId"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <ViewTermCondition />
          </Layout>
        }
      />

        <Route path="logout" element={<LogoutPage />} />

        <Route
          path="/privacy-policy"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <PrivacyPolicy />
            </Layout>
          }
        />

        <Route
          path="privacy-policy/edit"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <PrivacyPolicyEdit />{" "}
            </Layout>
          }
        />

        <Route
          path="/helpSupport/faq/add"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <FaqAdd />{" "}
            </Layout>
          }
        />




        <Route
          path="/send-notification"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <AllNotification />{" "}
            </Layout>
          }
        />
        <Route
          path="/send-notification/add"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <AddNotificationForm />
            </Layout>
          }
        />


        <Route
          path="/payment"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Payment />
            </Layout>
          }
        />


        <Route
          path="/payment/viewpayment/:orderId"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ViewPayment />
            </Layout>
          }
        />


        <Route
          path="/helpSupport"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <HelpSupport />
            </Layout>
          }
        />

        <Route
          path="/helpSupport/customer-complaints"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <CustomerComplaints />
            </Layout>
          }
        />

        <Route
          path="/helpSupport/customer-support-number"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <CustomerSupportNumber />
            </Layout>
          }
        />

        <Route
          path="/helpSupport/faq"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Faq />
            </Layout>
          }
        />
        
        
        <Route
          path="/faq/edit/:id"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <FaqEdit />
            </Layout>
          }
        />

        <Route
          path="/faq/view/:id"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <FaqView />
            </Layout>
          }
        />

        <Route
          path="/terms-condition"
          element={<Layout activeTab={activeTab} setActiveTab={setActiveTab}><TermsCondition /></Layout>}
        />

        <Route
          path="/terms-condition/edit"
          element={<Layout activeTab={activeTab} setActiveTab={setActiveTab}><EditTermsCondition /></Layout>}
        />

           <Route
        path="/monitoring"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <RiskMonitoring />
          </Layout>
        }
      />
      </Routes>

      
    );
  };

  export default AppRoutes;