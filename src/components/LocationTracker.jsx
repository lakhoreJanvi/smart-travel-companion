import { useEffect, useState } from 'react'

const LocationTracker = () => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      (err) => {
        setLocation({ error: err.message });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);


    return (
        <div className="location">
        {location?.error
            ? `Error: ${location.error}`
            : location
            ? `Latitude: ${location.latitude.toFixed(4)}, Longitude: ${location.longitude.toFixed(4)}`
            : 'Waiting for location...'}
        </div>
    );
}

export default LocationTracker