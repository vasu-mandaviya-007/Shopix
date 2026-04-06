import React from "react";

const ConfirmDialog = ({
    open,
    title = "Confirm Action",
    message = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 animate-scaleIn">
                <h2 className="text-lg font-semibold text-gray-800">
                    {title}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 cursor-pointer  border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 cursor-pointer  bg-primary text-white hover:bg-blue-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
