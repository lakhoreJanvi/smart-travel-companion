import { useEffect, useRef, useState } from 'react';

export default function CanvasMap() {
  const canvasRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [error, setError] = useState(null);
  const animationRef = useRef(null);

  // Resize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, []);

  // Watch position
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setOrigin((prev) => prev || { latitude, longitude });
        setPositions((prev) => [...prev, { latitude, longitude }]);
      },
      (err) => setError('Location error: ' + err.message),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Animate draw
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !origin) return;

    const scale = 100000;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 1; i < positions.length; i++) {
        const prev = positions[i - 1];
        const curr = positions[i];

        const prevX = offsetX + (prev.longitude - origin.longitude) * scale;
        const prevY = offsetY - (prev.latitude - origin.latitude) * scale;
        const currX = offsetX + (curr.longitude - origin.longitude) * scale;
        const currY = offsetY - (curr.latitude - origin.latitude) * scale;

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw current position
      const last = positions[positions.length - 1];
      if (last) {
        const x = offsetX + (last.longitude - origin.longitude) * scale;
        const y = offsetY - (last.latitude - origin.latitude) * scale;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [positions, origin]);

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setPositions([]);
    setOrigin(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ paddingLeft: '34px' }}>Canvas Location Tracker</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '400px',
          border: '1px solid black',
          display: 'block',
          marginBottom: '1rem',
        }}
      />
      <button onClick={handleReset} style={{ padding: '0.5rem 1rem', marginLeft: '33px' }}>
        Reset Path
      </button>
    </div>
  );
}
