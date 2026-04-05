import React from "react";
import '../styles/confirm-modal.css';
const ConfirmModal = ({ isOpen, onConfirm, onCancel, message}) => {
    if(!isOpen) return null;
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <p className="modal-message">{message || 'Вы уверены?'}</p>
                <div className="modal-buttons">
                    <button className="modal-btn confirm-btn" onClick={onConfirm}>
                        Да
                    </button>
                    <button className="modal-btn cancel-btn" onClick={onCancel}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;