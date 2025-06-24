import { useEffect, useRef } from 'react';
import lottie from 'lottie-web/build/player/lottie_light.min'; // Lightweight version
import animationData from '../../assets/animations/loader.json';
import './CustomPageLoader.css';

const CustomPageLoader = ({ message = "Please wait, loading your content..." }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const instance = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => instance.destroy(); // Cleanup on unmount
  }, []);

  return (
    <div
      className="custom-loader-wrapper d-flex flex-column align-items-center justify-content-center"
      role="alert"
      aria-live="assertive"
      aria-busy="true"
      style={{ minHeight: '200px', padding: '1rem' }}
    >
      <div
        ref={containerRef}
        style={{ width: 120, height: 120 }}
      />
      <p className="mt-3 fw-semibold text-muted text-center small">
        {message}
      </p>
    </div>
  );
};

export default CustomPageLoader;
