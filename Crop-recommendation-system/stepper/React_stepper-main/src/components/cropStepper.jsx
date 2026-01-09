import React, { useState, useEffect } from "react";
import "./stepperc.css";
import { TiTick } from "react-icons/ti";
import axios from "axios";

const cropSteps = {
  apple: ["Land Preparation", "Planting", "Irrigation", "Harvesting"],
  bajra: ["Soil Preparation", "Seed Sowing", "Weeding", "Harvesting"],
  banana: ["Land Preparation", "Sucker/Seedling Planting", "Fertilizing", "Bunch Covering"],
  barley: ["Field Preparation", "Seed Treatment", "Irrigation", "Harvesting"],
  blackgram: ["Soil Preparation", "Seed Sowing", "Pest Control", "Harvesting"],
  cabbage: ["Nursery Bed", "Transplanting", "Fertilizing", "Harvesting"],
  chickpea: ["Land Tillage", "Sowing", "Fertilizing", "Harvesting"],
  coconut: ["Site Selection", "Planting", "Mulching", "Harvesting"],
  coffee: ["Land Clearing", "Transplanting", "Shading", "Picking"],
  corn: ["Field Tillage", "Seed Sowing", "Irrigation", "Harvesting"],
  cotton: ["Soil Preparation", "Seed Sowing", "Pest Management", "Harvesting"],
  grapes: ["Land Preparation", "Grafting", "Training", "Harvesting"],
  greengram: ["Soil Preparation", "Seed Sowing", "Weed Control", "Harvesting"],
  jowar: ["Field Tilling", "Direct Seeding", "Fertilizing", "Harvesting"],
  jute: ["Soil Conditioning", "Sowing", "Roguing", "Retting & Harvesting"],
  kidneybeans: ["Land Tillage", "Seed Sowing", "Weeding", "Harvesting"],
  ladyfinger: ["Land Prep", "Direct Sowing", "Weed Control", "Harvesting"],
  lentil: ["Soil Tilling", "Seed Sowing", "Fertilizing", "Harvesting"],
  maize: ["Soil Preparation", "Sowing", "Irrigation", "Harvesting"],
  mango: ["Land Prep", "Grafting", "Irrigation", "Harvesting"],
  mothbeans: ["Tillage", "Sowing", "Fertilizer Application", "Harvesting"],
  mungbean: ["Land Prep", "Seed Treatment", "Sowing", "Harvesting"],
  muskmelon: ["Soil Preparation", "Sowing", "Irrigation", "Harvesting"],
  onion: ["Nursery Bed", "Transplanting", "Bulb Formation", "Harvesting"],
  orange: ["Land Selection", "Planting", "Manuring", "Harvesting"],
  papaya: ["Pit Preparation", "Planting", "Fertilizing", "Harvesting"],
  pigeonpeas: ["Soil Prep", "Sowing", "Interculture", "Harvesting"],
  pomegranate: ["Soil Preparation", "Planting", "Pruning", "Harvesting"],
  potato: ["Field Prep", "Seed Planting", "Mounding", "Harvesting"],
  ragi: ["Soil Preparation", "Sowing", "Irrigation", "Harvesting"],
  rice: ["Land Tillage", "Paddy Transplant", "Irrigation", "Harvesting"],
  soybeans: ["Field Prep", "Sowing", "Weed Management", "Harvesting"],
  sugarcane: ["Ridge Making", "Setts Planting", "Earthing Up", "Harvesting"],
  tur: ["Soil Preparation", "Seed Treatment", "Irrigation", "Harvesting"],
  turmeric: ["Land Prep", "Rhizome Planting", "Fertilizing", "Harvesting"],
  wheat: ["Tillage", "Sowing", "Irrigation", "Harvesting"],
  watermelon: ["Soil Preparation", "Seed Sowing", "Fertilizing", "Harvesting"]
};

const Stepper = ({ crop }) => {
  const steps = cropSteps[crop?.toLowerCase()] || [
    "Soil Testing",
    "Seed Selection",
    "Sowing",
    "Harvesting"
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/get_progress?crop=${crop}`, {
          credentials: "include"
        });
        const data = await response.json();

        if (data && data.currentStep) {
          setCurrentStep(data.currentStep);
          if (data.currentStep > steps.length) setComplete(true);
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      }
    };

    if (crop) {
      fetchProgress();
    }
  }, [crop, steps.length]);

  const handleNext = async () => {
    const nextStep = currentStep + 1;

    try {
      await fetch("http://localhost:3000/api/update_progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ crop, currentStep: nextStep })
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }

    if (nextStep > steps.length) {
      setComplete(true);
    } else {
      setCurrentStep(nextStep);
    }
  };

  return (
    <>
      <div className="flex justify-between gap-2 flex-wrap">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 ? "active" : ""} ${(i + 1 < currentStep || complete) ? "complete" : ""}`}
          >
            <div className="step">
              {(i + 1 < currentStep || complete) ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500 text-center">{step}</p>
          </div>
        ))}
      </div>

      {!complete && (
        <button className="btn" onClick={handleNext}>
          {currentStep === steps.length ? "Finish" : "Next"}
        </button>
      )}
    </>
  );
};

export default Stepper;
