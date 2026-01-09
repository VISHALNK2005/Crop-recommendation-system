import React from 'react';
import Stepper from "./components/cropStepper.jsx";

const App = () => {
  // Extract `crop` from the URL query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const crop = queryParams.get('crop');  // e.g., ?crop=potato

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">
        Cultivation Steps for:{" "}
        <span className="text-green-600 capitalize">{crop || "Unknown Crop"}</span>
      </h1>
      <Stepper crop={crop} />
    </div>
  );
};

export default App;
