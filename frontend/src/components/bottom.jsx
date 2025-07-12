import React from "react";




const Bottom = ({ onNext, onPrevious }) => {
  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={onPrevious}
        className="!bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition duration-200"
      >
        ← Previous
      </button>

      <div className="flex space-x-4">
        <button
          onClick={() => alert("Draft saved!")}
          className="!bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition duration-200"
        >
          Save draft
        </button>
        <button
          onClick={() => alert("Entry submitted!")}
          className="!bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition duration-200"
        >
          Submit entry
        </button>
      </div>

      <button
        onClick={onNext}
        className="!bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition duration-200"
      >
        Next →
      </button>
    </div>
  );
};

export default Bottom;
