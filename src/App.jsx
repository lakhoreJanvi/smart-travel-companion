// src/App.jsx
import NetworkStatus from './components/NetworkStatus';
import LocationTracker from './components/LocationTracker';
import CanvasMap from './components/CanvasMap';
import './index.css';

export default function App() {
  return (
    <div className="container">
      <h1>Smart Travel Companion</h1>
        <NetworkStatus />
        <CanvasMap />
        <LocationTracker />
    </div>
  );
}
