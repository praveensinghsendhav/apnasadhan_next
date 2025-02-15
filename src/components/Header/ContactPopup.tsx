import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const ContactPopup = ({ toggleContactPopup, isOpen }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        toggleContactPopup();
      }
    };


    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleContactPopup]);

  return (
    <div
      ref={popupRef}
      className={`fixed top-1/4 right-0 z-50 w-64 bg-white shadow-lg transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} dark:bg-gray-800 rounded-lg`}
      style={{ transition: 'transform 0.3s ease-in-out' }}
    >
      <div className="p-4">
        <button
          onClick={toggleContactPopup}
          className="mb-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          Close
        </button>
        <div className="flex flex-col space-y-4">
          <Link href="https://wa.me/7225955494" className="flex items-center space-x-2">
            <Image src="/images/icons/wp.png" alt="WhatsApp" width={24} height={24} />
            <span>WhatsApp</span>
          </Link>
          <Link href="tel:9827217315" className="flex items-center space-x-2">
            <Image src="/images/icons/call.png" alt="Direct Call" width={24} height={24} />
            <span>Direct Call</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPopup; 