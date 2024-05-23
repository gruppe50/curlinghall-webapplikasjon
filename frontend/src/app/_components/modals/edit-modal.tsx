'use client';
import { useModalContext } from "@/_lib/context/modal-context";
import { useEffect, useState } from "react";

type EditModalProps = {
  heading:  string;
  children: React.ReactNode;
  cancelFunction: () => void;
  saveFunction: (event: React.FormEvent<HTMLFormElement>) => Promise<boolean>;
  deleteFunction: (id: number) => Promise<boolean>;
  idToDelete: number;
};

const EditModal: React.FC<EditModalProps> = ({heading, children, cancelFunction, saveFunction, deleteFunction, idToDelete, }) => {
  const { isEditModalOpen, setIsEditModalOpen } = useModalContext();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  const animationDuration: number = 300;

  const toggleModal = () => {
    if (!isEditModalOpen) {
      setIsEditModalOpen(true);
    } else {
      setIsModalVisible(false);
      setTimeout(() => setIsEditModalOpen(false), animationDuration);
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

  const handleDelete = async () => {
    let response = await deleteFunction(idToDelete);
    if (response === true) {
      toggleModal();
      setDeleteMode(false);
    }
  }

  useEffect(() => {
    if (isEditModalOpen) {
      setIsModalVisible(true);
    }
  }, [isEditModalOpen]);

  return (
    <>
      {/* Main modal */}
      {isEditModalOpen && (
        <div
          tabIndex={-1}
          data-modal-backdrop="static"
          className={`fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-50
            ${isModalVisible ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-${animationDuration}`}
        >
          {!deleteMode
            ? (
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
                    <div className="flex justify-between p-4 md:p-5 border-t border-gray-200 rounded-b bg-gray-50">
                      <div className="flex items-center space-x-5">
                        <a 
                          className="underline text-red-600 hover:text-red-800 cursor-pointer ml-2"
                          onClick={() => {setDeleteMode(true)}}
                        >
                          Slett&nbsp;test
                        </a>
                      </div>
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
                          Lagre
                        </button>  
                      </div>                
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                  <form onSubmit={handleSubmit} className="p-4 md:p-5 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-600">Er du sikker på at du vil slette denne testen?</h3>
                    <button 
                      type="button"
                      onClick={handleDelete}
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg inline-flex items-center px-5 py-2.5 text-center"
                    >
                      <span>Slett i vei!</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setDeleteMode(false)}
                      className="py-2.5 px-5 ms-3 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                    >
                      <span>Nei, avbryt</span>
                    </button>
                  </form>
                </div>
              </div>
            )
          }
        </div>
      )}
    </>
  );
};

export default EditModal;