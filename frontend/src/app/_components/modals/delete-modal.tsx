'use client';
import { useModalContext } from "@/_lib/context/modal-context";
import { useEffect, useState } from "react";

type DeleteModalProps = {
  whatToDelete: string;
  deleteFunction: (id: number) => void;
  idToDelete: number;
};

const DeleteModal: React.FC<DeleteModalProps> = ({whatToDelete, deleteFunction, idToDelete}) => {
  const { isDeleteModalOpen, setIsDeleteModalOpen } = useModalContext();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const animationDuration: number = 300;

  const toggleModal = () => {
    if (!isDeleteModalOpen) {
      setIsDeleteModalOpen(true);
    } else {
      setIsModalVisible(false);
      setTimeout(() => setIsDeleteModalOpen(false), animationDuration);
    }
  };

  const handleCancel = () => {
    toggleModal();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteFunction(idToDelete);
    toggleModal();
  }

  useEffect(() => {
    if (isDeleteModalOpen) {
      setIsModalVisible(true);
    }
  }, [isDeleteModalOpen]);

  return (
      <>
        {isDeleteModalOpen && (
          <div 
            id="popup-modal" 
            tabIndex={-1} 
            className={`fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-50
            ${isModalVisible ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-${animationDuration}`}
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow">
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="absolute top-3 end-2.5 text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Lukk dialogboks</span>
                </button>
                <form onSubmit={handleSubmit} className="p-4 md:p-5 text-center">
                  <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-600">Er du sikker på at du vil slette {whatToDelete.toLowerCase()}?</h3>
                  <button 
                    type="submit" 
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg inline-flex items-center px-5 py-2.5 text-center"
                  >
                    <span>Slett i vei!</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="py-2.5 px-5 ms-3 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                  >
                    <span>Nei, avbryt</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }
  </>
  );
};

export default DeleteModal;