import React from 'react';
import './ParkingStatus.css';

const ParkingStatus = ({ freeSpots, onFreeSpot }) => {
  const totalSpots = 5; // Asumiendo que hay 5 estacionamientos
  const spots = Array.from({ length: totalSpots }, (_, i) => i + 1);

  return (
    <div className="parking-status-container">
      {spots.map(spot => {
        const isFree = freeSpots.some(freeSpot => freeSpot.id === spot);
        return (
          <div key={spot} className={`parking-spot ${isFree ? 'free' : 'occupied'}`}>
            Estacionamiento {spot}
            {!isFree && (
              <button onClick={() => onFreeSpot(spot)} className="free-button">
                Liberar Estacionamiento
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParkingStatus;

