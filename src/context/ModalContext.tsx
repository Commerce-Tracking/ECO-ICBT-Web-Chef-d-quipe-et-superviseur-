// src/contexts/ModalContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

type ModalProps = {
    title?: string;
    description?: string;
    content: ReactNode;
};

type ModalContextType = {
    openModal: (modalProps: ModalProps) => void;
    closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalContent, setModalContent] = useState<ModalProps | null>(null);

    const openModal = (props: ModalProps) => {
        setModalContent(props);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {/* Modal UI */}
            {modalContent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl max-w-[700px] w-full m-4 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✖
                        </button>
                        {modalContent.title && (
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                {modalContent.title}
                            </h4>
                        )}
                        {modalContent.description && (
                            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                {modalContent.description}
                            </p>
                        )}
                        <div>{modalContent.content}</div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

export const useCustomModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used within a ModalProvider");
    return context;
};
