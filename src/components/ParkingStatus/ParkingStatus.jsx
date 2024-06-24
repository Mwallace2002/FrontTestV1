import React from 'react';
import './ParkingStatus.css';
import { useTranslation } from 'react-i18next';

const ParkingStatus = ({ freeSpots, onFreeSpot }) => {
  const { t } = useTranslation("global");
  const totalSpots = 5; // Asumiendo que hay 5 estacionamientos
  const spots = Array.from({ length: totalSpots }, (_, i) => i + 1);

  return (
    <div className="parking-status-container">
      {spots.map(spot => {
        const isFree = freeSpots.some(freeSpot => freeSpot.id === spot);
        return (
          <div key={spot} className={`parking-spot ${isFree ? 'free' : 'occupied'}`}>
            {t('parkingStatus.parkingSpot')} {spot}
            {!isFree && (
              <button onClick={() => onFreeSpot(spot)} className="free-button">
                {t('parkingStatus.freeButton')}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParkingStatus;


