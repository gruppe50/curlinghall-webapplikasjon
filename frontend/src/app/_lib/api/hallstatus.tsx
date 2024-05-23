'use client';
import { useState } from 'react';

type HallStatus = {
  bigLaneEndTemp:   number;
  bigLaneMidTemp:   number;
  smallLaneEndTemp: number;
  smallLaneMidTemp: number;
  hallTemp:         number;
  hallHumidity:     number;
}

const useHallStatus = () => {
  const [ hallStatus, setHallStatus ] = useState<HallStatus>({
    bigLaneEndTemp:   0.0,
    bigLaneMidTemp:   0.0,
    smallLaneEndTemp: 0.0,
    smallLaneMidTemp: 0.0,
    hallTemp:         0.0,
    hallHumidity:     0.0,
  });

  const fetchHallStatus = async () => {

    try {
      const response = await fetch('http://localhost:8080/status');
      const data = await response.json();
    
      let newStatus: HallStatus = {
        bigLaneEndTemp:   Number(data.bigLane_track_4_temp_end),
        bigLaneMidTemp:   Number(data.bigLane_track_4_temp_mid),
        smallLaneEndTemp: Number(data.smallLane_track_1_temp_end),
        smallLaneMidTemp: Number(data.smallLane_track_1_temp_mid),
        hallTemp:         Number(data.hall_temp),
        hallHumidity:     Number(data.hall_humidity),
      };

      setHallStatus(newStatus);
    } catch (error) {
      console.error('Error fetching hall status:', error);
    }
  };

  return { hallStatus, fetchHallStatus };
};

export default useHallStatus;