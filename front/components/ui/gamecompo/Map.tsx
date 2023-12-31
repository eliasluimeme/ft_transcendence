"use client";
import React, { useState } from "react";
import Image from "next/image";

type MapProps = {
  mapId: string;
};

const MapButton: React.FC<
  MapProps & {
    selectedMap: string | null;
    setSelectedMap: React.Dispatch<React.SetStateAction<string | null>>;
  }
> = ({ mapId, selectedMap, setSelectedMap }) => {
  const handleMapSelect = () => {
    if (selectedMap !== mapId) {
      setSelectedMap(mapId);
    } else {
      setSelectedMap(null);
    }
  };

  return (
    <button
      className={`relative h-full w-[90%] ${
        selectedMap === mapId ? "" : "opacity-50"
      }`}
      onClick={handleMapSelect}
    >
      <Image
        className="rounded-lg border"
        src={`game/${mapId}.svg`}
        alt=""
        fill
      ></Image>
    </button>
  );
};

const Map: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<string | null>(null);

  return (
    <div className="w-full h-full grid grid-rows-2">
      <div className="row-start-1 relative w-full h-full">
        <div className="w-full h-full flex justify-center">
          <MapButton
            mapId="map1"
            selectedMap={selectedMap}
            setSelectedMap={setSelectedMap}
          />
        </div>
      </div>
      <div className="row-start-2 relative w-full h-full">
        <div className="w-full h-full flex justify-center">
          <MapButton
            mapId="map2"
            selectedMap={selectedMap}
            setSelectedMap={setSelectedMap}
          />
        </div>
      </div>
    </div>
  );
};

export default Map;
