'use client'
import { useRouter } from "next/navigation";

interface NewModalLoginProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    primaryButtonOnClick?: () => void;
    showButtons?: boolean;
    successModal?: boolean;
}

export default function NewModalLogin({ isOpen, message, onClose, primaryButtonText = 'लॉगिन करें', primaryButtonLink = '/login', secondaryButtonText = 'बंद करें', secondaryButtonLink = '/', showButtons = true, primaryButtonOnClick, successModal = false }: NewModalLoginProps) {
    const router = useRouter();


    const handlePrimaryButtonClick = () => {
        if (primaryButtonOnClick) {
            primaryButtonOnClick?.();
        }
        else {
            router.push(primaryButtonLink ? primaryButtonLink : '/login');
        }
    }
    if (!isOpen) return null;
    return (
        <div className="z-[9999] fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="relative p-4 w-full max-w-md max-h-full my-auto mx-auto">
                <div className="relative bg-white rounded-lg shadow-sm">

                    {/* Modal content */}
                    <div className="p-4 md:p-5 text-center">
                        {successModal ? <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div> : <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>}

                        <h3 className="mb-5 text-lg font-normal text-gray-500">{message}</h3>

                        {/* Action buttons */}
                        {showButtons && <>
                            <button
                                type="button"
                                className="text-white bg-[#273F4F] hover:bg-[#1e2f3a] focus:ring-4 focus:outline-none focus:ring-[#273F4F] font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                                onClick={handlePrimaryButtonClick}
                            >
                                {primaryButtonText}
                            </button>
                            <button
                                type="button"
                                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                                onClick={onClose}
                            >
                                {secondaryButtonText}
                            </button>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    );
}
