import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';

import MainLayout from '../layouts/MainLayout';
import UserLayout from '../layouts/UserLayout';
import VendorLayout from '../layouts/VendorLayout';
import AdminLayout from '../layouts/AdminLayout';

// Home Pages
import Home from '../pages/Home/Home';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import FeatureVendors from '../pages/Home/FeatureVendors';
import DiscoverCategories from '../pages/Home/DiscoverCategories';
import BrowserVenues from '../pages/WeddingVenues/BrowserVenues';
import VendorByCategory from '../pages/Home/VendorByCategory';
import ProjectList from '../pages/Home/ProjectList';
import SuccessfullEvents from '../pages/Home/SuccessfullEvents';
import Tesstimonials from '../pages/Home/Tesstimonials';
import HowItWorks from '../pages/Home/HowItWorks';

// User Auth
import UserLogin from '../pages/Auth/UserLogin';
import UserSignup from '../pages/Auth/UserSignup';
import VerifyOTP from '../pages/Auth/VerifyOTP';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import VerifyPasswordReset from '../pages/Auth/VerifyPasswordReset';
import ResetPassword from '../pages/Auth/ResetPassword';
import DeleteAccount from '../pages/Auth/DeleteAccount';
import EditProfile from '../pages/Auth/UserDashboad/EditProfile';
import UserDashboard from '../pages/Auth/UserDashboad/UserDashboard';
import Profile from '../pages/Auth/UserDashboad/UserProfile';
import GuestList from '../pages/Auth/UserDashboad/GuestList';
import Budget from '../pages/Auth/UserDashboad/Budget';
import Inquiry from '../pages/Auth/UserDashboad/Inquiry';
import SavedVendor from '../pages/Auth/UserDashboad/SavedVendor';
import CheckList from '../pages/Auth/UserDashboad/CheckList';

// Planning Tools
import PlanningTools from '../pages/PlanningTools/PlanningTools';
import WeddingWebsite from '../pages/PlanningTools/WeddingWebsite';
import Checklist from '../pages/PlanningTools/Checklist';
import Guests from '../pages/PlanningTools/Guests';
import WeddingBudget from '../pages/PlanningTools/WeddingBudget';
import HashtagGenerator from '../pages/PlanningTools/HashtagGenerator';

// Corporate
import Corporate from '../pages/Corporate/Corporate';

// Idea & Blogs
import IdeaBlog from '../pages/Idea&Blog/IdeaBlog';

// Wedding Venues
import WeddingVenues from '../pages/WeddingVenues/WeddingVenues';
import WeddingVenuesCity from '../pages/WeddingVenues/WeddingVenuesCity';
import BlueDimondVenue from '../pages/WeddingVenues/IneerPages/BlueDimondVenue';
import HotelPrinceInn from '../pages/WeddingVenues/IneerPages/HotelPrinceInn';
import HotelPrienceStay from '../pages/WeddingVenues/IneerPages/HotelPrienceStay';
import HotelCultureByDsy from '../pages/WeddingVenues/IneerPages/HotelCultureByDsy';

// Wedding Vendor
import WeedingVendor from '../pages/WeddingVendors/WeedingVendor';
import Photographers from '../pages/WeddingVendors/Photographers';
import Videography from '../pages/WeddingVendors/Videography';

// Vendor Auth
import VendorSignup from "../pages/Auth/VendorSignup";
import VendorVerifyOTP from "../pages/Auth/VendorVerifyOTP";
import VendorLogin from "../pages/Auth/VendorLogin";
import NotApproved from '../pages/Auth/VendorNotApproved';
import VendorForgotPassword from "../pages/Auth/VendorForgotPassword";
import VendorVerifyResetOTP from "../pages/Auth/VendorVerifyResetOTP";
import VendorResetPassword from "../pages/Auth/VendorResetPassword";

// Vendor Pages
import Dashboard from "../pages/Vendor/Dashboard";
import Inquiries from "../pages/Vendor/Inquiries/Inquiries";
import Reviews from "../pages/Vendor/Reviews";
import EditProfiles from '../pages/Vendor/EditProfiles';
import HiringVendors from '../pages/Vendor/HiringVendors';
import PackagesAndFaqs from '../pages/Vendor/PackagesAndFaqs';
import Portfolio from '../pages/Vendor/Portfolio';
import VendorBlog from '../pages/Vendor/VendorBlog';
import AddBlogPost from '../pages/Vendor/AddBlogPost';

//#################### Vendor Preview Profile components #########################
import PreviewProfile from '../pages/Vendor/PreviewProfile/PreviewProfile';
import PreviewProfileScreen from '../pages/Vendor/PreviewProfile/PreviewProfileScreen';
import SimilarVendors from '../pages/Vendor/PreviewProfile/SimilarVendors';
import CustomerReviews from '../pages/Vendor/PreviewProfile/CustomerReviews';
import FaqQuestions from '../pages/Vendor/PreviewProfile/FaqQuestions';

// Admin Dashboard 
import AdminLogin from '../pages/Auth/AdminLogin';
import AdminDashboard from '../pages/Admin/Dashboard';
import SubDashboard from '../pages/Admin/SubDashboard';
import UserManagement from '../pages/Admin/UserManagement';
import VendorManagement from '../pages/Admin/VendorManagement';
import PendingVendorApprovals from "../pages/Admin/PendingApprovals";
import ReviewModeration from "../pages/Admin/ReviewModeration";
import AdminBlogs from '../pages/Admin/AdminBlogs';
import CategoryManagement from '../pages/Admin/CategoryManagement';
import InquiryReply from '../pages/Vendor/Inquiries/InquiryReply';

// Location
import LocationVendors from '../pages/Location/LocationVendor';
import CategorySelector from '../pages/Location/CategorySelector';
import VendorListPage from '../pages/Location/VendorListPage';


const index = () => {
    return (
        <Router>
            <Routes>
                {/* Main public routes with MainLayout */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/navbar" element={<Navbar />} />
                    <Route path="/footer" element={<Footer />} />

                    {/* Planning Tools */}
                    <Route path='/planning-tools' element={<PlanningTools />} />
                    <Route path="/wedding-website" element={<WeddingWebsite />} />
                    <Route path="/wedding-checklist" element={<Checklist />} />
                    <Route path="/wedding-guests" element={<Guests />} />
                    <Route path="/wedding-budget" element={<WeddingBudget />} />
                    <Route path="/hashtag-generator" element={<HashtagGenerator />} />

                    {/* Idea Blog */}
                    <Route path="/IdeaBlog" element={<IdeaBlog />} />

                    {/* Corporate */}
                    <Route path="/corporate" element={<Corporate />} />

                    {/* Wedding Vendor public page */}
                    <Route path="/wedding-vendor" element={<WeedingVendor />} />
                    <Route path="/photographers" element={<Photographers />} />
                    <Route path="/videography" element={<Videography />} />

                    {/* Home additional pages */}
                    <Route path='/BrowserVenues' element={<BrowserVenues />} />
                    <Route path='/discoverCategories' element={<DiscoverCategories />} />
                    <Route path='/featurevendors' element={<FeatureVendors  showAll={true} />} /> {/* ✅ Fixed 'featureVendors' */}
                    <Route path='/HowItWorks' element={<HowItWorks />} />
                    <Route path='/ProjectList' element={<ProjectList />} />
                    <Route path='/SuccessfullEvents' element={<SuccessfullEvents />} />
                    <Route path='/Tesstimonials' element={<Tesstimonials />} />
                    <Route path='/VendorByCategory' element={<VendorByCategory />} />

                    {/* Wedding Venues */}
                    <Route path="Wedding_Venues" element={<WeddingVenues />} />
                    <Route path="Wedding_Venues_city" element={<WeddingVenuesCity />} />
                    <Route path="blue-dimond-venue" element={<BlueDimondVenue />} />
                    <Route path="Hotel-Prince-Inn-By" element={<HotelPrinceInn />} />
                    <Route path="Hotel-Prience-Stay" element={<HotelPrienceStay />} />
                    <Route path="Hotel-Culture-By-Dsy" element={<HotelCultureByDsy />} />

                    {/* Location */}
                    <Route path="locations/:city" element={<LocationVendors />} />
                    <Route path="category-selector" element={<CategorySelector />} />
                    <Route path="/vendors/:location/:category" element={<VendorListPage />} />


                    {/* User Auth Routes */}
                    <Route path="/user/signup" element={<UserSignup />} />
                    <Route path="verify-otp" element={<VerifyOTP />} />
                    <Route path="/user/login" element={<UserLogin />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="verify-password-reset" element={<VerifyPasswordReset />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="delete-account" element={<DeleteAccount />} />

                    {/* Vendor Auth Routes */}
                    <Route path="/not-approved" element={<NotApproved />} />
                    <Route path="/vendor-register" element={<VendorSignup />} />
                    <Route path="/vendor/verify-otp" element={<VendorVerifyOTP />} />
                    <Route path="/vendor/login" element={<VendorLogin />} />
                    <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
                    <Route path="/vendor/verify-password-reset" element={<VendorVerifyResetOTP />} />
                    <Route path="/vendor/reset-password" element={<VendorResetPassword />} />

                    {/* Admin Auth Route */}
                    <Route path="admin/login" element={<AdminLogin />} />
                </Route>

                {/* User Dashboard Protected Routes */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <UserLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="guest-list" element={<GuestList />} />
                    <Route path="budget" element={<Budget />} />
                    <Route path="inquiry" element={<Inquiry />} />
                    <Route path="saved-vendor" element={<SavedVendor />} />
                    <Route path="check-list" element={<CheckList />} />
                </Route>

                {/* Vendor Dashboard Protected Routes */}
                <Route
                    path="/vendor"
                    element={
                        <ProtectedRoute allowedRoles={['vendor']}>
                            <VendorLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="edit_profile" element={<EditProfiles />} />
                    <Route path="hiring_vendors" element={<HiringVendors />} />
                    <Route path="inquiries" element={<Inquiries />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="packages_and_faqs" element={<PackagesAndFaqs />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="preview_profile" element={<PreviewProfile />} />
                    <Route path="preview_profilescreen" element={<PreviewProfileScreen />} />
                    <Route path="similar_vendors" element={<SimilarVendors />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="customer_reviews" element={<CustomerReviews />} />
                    <Route path="faqs_Questions" element={<FaqQuestions />} />
                    <Route path="inquiry" element={<FaqQuestions />} />
                    <Route path="inquiryReply" element={<InquiryReply />} />
                    <Route path="blogs" element={<VendorBlog/>} />
                    <Route path="add-blog-post" element={<AddBlogPost/>} />
                </Route>

                {/* Admin Dashboard Protected Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="sub_dashboard" element={<SubDashboard />} />
                    <Route path="user_management" element={<UserManagement />} />
                    <Route path="vendor_management" element={<VendorManagement />} />
                    <Route path="pending_vendor_approvals" element={<PendingVendorApprovals />} />
                    <Route path="review_moderation" element={<ReviewModeration />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="category_management" element={<CategoryManagement />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default index;
