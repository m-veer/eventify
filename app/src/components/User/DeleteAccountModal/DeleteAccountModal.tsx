import React, { useRef, useState, useEffect  } from 'react';
import './DeleteAccountModal.css';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');
  const confirmText = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue('');
  }, [isOpen]);
  
  const handleSubmit = () => {
    if (inputValue === 'CONFIRM') {
      onConfirm();
      setInputValue('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Delete Account</h2>
        <p>This action cannot be undone. Please type 'CONFIRM' to delete your account.</p>
        <input
          type="text"
          ref={confirmText}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type CONFIRM"
          aria-label="Confirmation text"
        />
        <div className="modal-buttons">
          <button 
            onClick={handleSubmit}
            disabled={inputValue !== 'CONFIRM'}
            className="submit-button"
          >
            Delete Account
          </button>
          <button 
            onClick={() => {
              onClose();
              setInputValue('');
            }} 
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;