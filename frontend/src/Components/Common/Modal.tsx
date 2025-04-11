import React, { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses: Record<string, string> = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className={`relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-scale-in`}>
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800" id="modal-title">
                        {title}
                    </h3>
                    <button
                        type="button"
                        className="text-slate-400 bg-transparent hover:bg-slate-100 hover:text-slate-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
