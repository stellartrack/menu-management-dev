import Lottie from "lottie-react";
import animationData from "../../assets/animations/loader.json";
import "./CustomPageLoader.css";

const CustomPageLoader = ({ message = "Please wait, loading your content..." }) => {
  return (
    <div
      className="custom-loader-wrapper"
      role="alert"
      aria-live="assertive"
      aria-busy="true"
    >
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ height: 160 }} // Adjust height if needed
      />
      <p className="mt-3 fw-semibold text-muted text-center">
        {message}
      </p>
    </div>
  );
};

export default CustomPageLoader;
