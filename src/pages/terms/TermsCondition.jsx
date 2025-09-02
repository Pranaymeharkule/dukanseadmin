import React, { useEffect, useState } from "react";
// Assuming useNavigate is needed for the edit functionality.
import { useNavigate } from "react-router-dom";

// ============================================================================
// Presentational Component
// This component is only responsible for displaying the UI.
// It receives all data and functions as props.
// ============================================================================
const TermsContent = ({ isLoading, term, onEdit }) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>Loading...</p>
      </div>
    );
  }

  if (!term) {
    return (
      <p className="text-center text-gray-500 py-10">
        No Terms & Conditions found.
      </p>
    );
  }

  return (
    <>
      {/* Dynamically inserted HTML content */}
      <div
        className="prose prose-base max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: term.description }}
      />
      {/* Centered Edit Button */}
      <div className="text-center mt-10">
        <button
          onClick={onEdit}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm px-12 py-3 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-60"
        >
          Edit
        </button>
      </div>
    </>
  );
};

// ============================================================================
// Container Component
// This component is responsible for state management and data fetching.
// ============================================================================
export default function TermsCondition() {
  const navigate = useNavigate();
  const [term, setTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTerms() {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://dukanse-be.onrender.com/api/settings/getUserTerms"
        );
        const result = await response.json();
        if (result.success && result.termsAndCondition) {
          setTerm(result.termsAndCondition);
        } else {
          // Set a default term object if the API returns nothing, to match the image
          setTerm({
            description: `
               <p class="mb-4"><strong>Effective Date: 1st January, 2025</strong></p>
               <p class="mb-4">Welcome to [Your Business/Service Name]. By accessing or using our website, mobile application, or services, you agree to comply with these Terms and Conditions. These terms govern your use of our platform and outline the legal obligations and responsibilities between you and [Your Business/Service Name]. By registering, accessing, or using any part of our platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you must refrain from using our services.</p>
               <p class="mb-4">To use our platform, you must be at least 18 years of age and provide accurate and up-to-date information during registration and throughout your interactions with us. You are responsible for maintaining the confidentiality of your account credentials and for all activities carried out under your account. Any misuse, fraudulent behavior, or violation of these terms may result in the suspension or termination of your account. You are strictly prohibited from engaging in any illegal or unauthorized activities, including attempts to bypass security measures or interfere with the operation of our platform.</p>
               <p class="mb-4">Our platform provides access to various services, including but not limited to financial tools, loans, and other digital offerings. Loan applications are subject to verification and eligibility criteria as outlined by [Your Business/Service Name] and our partner institutions. While we strive to ensure that eligibility information is clearly communicated, approval of loans is at our sole discretion. Meeting eligibility criteria does not guarantee loan approval. Details such as interest rates, repayment terms, and applicable fees will be disclosed during the loan application process. It is your responsibility to review and accept these terms before proceeding with any transactions.</p>
               <p class="mb-4">Using our platform may involve certain fees and charges, which will always be transparently communicated to you before completion of any service. Processing fees, late payment penalties, or other applicable charges may apply, and failure to meet repayment obligations could result in additional penalties or negatively impact your credit score. We strongly encourage you to review all financial terms carefully to ensure they align with your capacity to meet repayment deadlines.</p>
               <p class="mb-4">By using our services, you consent to the collection, storage, and processing of your personal data in accordance with our Privacy Policy. We are committed to safeguarding your data and ensuring that it is not shared with unauthorized third parties. However, certain third-party service providers may require access to your information to facilitate our services. In such cases, these parties are bound by confidentiality agreements to protect your data.</p>
               <p>All content on our platform, including text, images, graphics, designs, and software, is either owned by or licensed to [Your Business/Service Name]. Unauthorized reproduction, distribution, or modification of any materials on the platform is strictly prohibited and may result in legal action. While we make reasonable efforts to ensure that all information on our platform is accurate, we do not warrant the completeness, reliability, or timeliness of the content provided.</p>
            `,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // Set a default term object on error to display something to the user
        setTerm({
          description: `<p><strong>Effective Date: 1st January, 2025</strong></p><p>Error loading terms and conditions. Please try again later.</p>`,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTerms();
  }, []);

  const handleEdit = () => {
    navigate("/terms-condition/edit");
  };

  return (
    // Main container with a light gray background and padding
    <div className="min-h-screen w-full bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header section styled to match the image */}
        <div className="flex items-center mb-4 bg-white p-4 md:p-5 rounded shadow">
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-semibold">
              Terms and Condition
            </h2>
          </div>
        </div>

        {/* Content Section - Renders the presentational component */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
          <TermsContent isLoading={isLoading} term={term} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}
