import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumbs";
import Button from "../../components/buttons/Buttons";

export default function AccountDeletion() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0 shrink-0">
        <Breadcrumb titles={["Account Deletion Policy"]} />
        <Button
          onClick={() => navigate("/account-deletion/edit")}
          className="px-4 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base"
        >
          <svg
            
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536M16 11l-8 8H4v-4l8-8z"
            />
          </svg>
          Edit
        </Button>
      </div>

      <div
        className="max-h-[65vh] overflow-y-auto text-gray-700 whitespace-pre-line bg-white rounded-md px-4 sm:px-6 py-4 border border-gray-200 
shadow-[4px_0_6px_-4px_rgba(0,0,0,0.1),-4px_0_6px_-4px_rgba(0,0,0,0.1),0_6px_12px_-2px_rgba(0,0,0,0.15)]"
      >
        We are a team of creative visionaries and dedicated professionals,
        deeply committed to the art and science of designing extraordinary
        digital experiences. With a focus on mobile applications and website
        design, we specialize in turning complex ideas into elegant, functional,
        and visually stunning realities. Our mission is to empower businesses
        and individuals by crafting designs that are not only aesthetically
        captivating but also intuitively user-friendly and purpose-driven. At
        the heart of our process lies an unwavering commitment to excellence and
        innovation. We begin every project by immersing ourselves in your
        vision, understanding your goals, audience, and brand identity. This
        deep collaboration ensures that every design decision we make aligns
        perfectly with your objectives, creating a seamless synergy between form
        and function. Whether it's a sleek, minimalist mobile app or a
        feature-rich website, our designs are tailored to captivate your target
        audience while delivering a seamless user experience. Our expertise is
        amplified by the use of cutting-edge tools like Figma, which allows
        us...
      </div>
    </div>
  );
}
