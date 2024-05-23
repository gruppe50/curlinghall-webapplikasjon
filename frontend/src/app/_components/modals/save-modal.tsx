'use client';
import { useModalContext } from "@/_lib/context/modal-context";
import { useEffect, useState } from "react";

type SaveModalProps = {
  heading:  string;
  children: React.ReactNode;
  cancelFunction: () => void;
  saveFunction: (event: React.FormEvent<HTMLFormElement>) => Promise<boolean>;
};

const SaveModal: React.FC<SaveModalProps> = ({heading, children, cancelFunction, saveFunction}) => {
  const { isSaveModalOpen, setIsSaveModalOpen } = useModalContext();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const animationDuration: number = 300;

  const toggleModal = () => {
    if (!isSaveModalOpen) {
      setIsSaveModalOpen(true);
    } else {
      setIsModalVisible(false);
      setTimeout(() => setIsSaveModalOpen(false), animationDuration);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let response = await saveFunction(event);
    if (response === true) {
      toggleModal();
    }
  }

  const handleCancel = () => {
    cancelFunction();
    toggleModal();
  }

  useEffect(() => {
    if (isSaveModalOpen) {
      setIsModalVisible(true);
    }
  }, [isSaveModalOpen]);

  return (
    <>
      {/* Main modal */}
      {isSaveModalOpen && (
        <div
          tabIndex={-1}
          data-modal-backdrop="static"
          className={`fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-50
            ${isModalVisible ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-${animationDuration}`}
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content */}
            <div className="relative rounded-lg shadow bg-gray-50">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  {heading}
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Lukk dialogboks</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {/* Modal body */}
                <div className="p-4 md:p-5 space-y-4 bg-gray-50">
                  {children}
                </div>
                {/* Modal footer */}
                <div className="flex justify-end p-4 md:p-5 border-t border-gray-200 rounded-b bg-gray-50">
                  <div className="w-2/4 flex items-center space-x-5">
                    <button
                      type="button"
                      onClick={() => handleCancel()}
                      className="w-1/2 py-2.5 px-5 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                    >
                      Avbryt
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center"
                    >
                      Save
                    </button>  
                  </div>                
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaveModal;