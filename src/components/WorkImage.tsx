import { useState, useRef } from "react";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Work.css";

interface WorkImageProps {
  image: string;
  alt: string;
  video?: string;
  link?: string;
  title: string;
  category: string;
}

const WorkImage = ({
  image,
  alt,
  video,
  link,
  title,
  category,
}: WorkImageProps) => {
  const [imgError, setImgError] = useState(false);
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (video && videoRef.current && isVideoAvailable) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      className="work-image-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="work-image-link"
        data-cursor="disable"
      >
        <div className="work-image-container">
          {!imgError ? (
            <img
              src={image}
              alt={alt}
              loading="lazy"
              className="work-media-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="work-image-fallback">
              <div className="fallback-glow"></div>
              <div className="fallback-content">
                <span className="fallback-category">{category}</span>
                <h4 className="fallback-title">{title}</h4>
              </div>
            </div>
          )}

          {/* Optional WebM video on hover */}
          {video && (
            <video
              ref={videoRef}
              src={video}
              muted
              loop
              playsInline
              className={`work-media-video ${
                isHovered && isVideoAvailable ? "active" : ""
              }`}
              onCanPlay={() => setIsVideoAvailable(true)}
              onError={() => setIsVideoAvailable(false)}
            />
          )}

          {/* Hover Arrow Button animates in */}
          <div className="work-image-arrow">
            <MdArrowOutward />
          </div>
        </div>
      </a>
    </div>
  );
};

export default WorkImage;
