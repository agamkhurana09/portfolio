import { useState, useRef, useEffect } from "react";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Work.css";

interface WorkImageProps {
  image: string;
  alt: string;
  video?: string;
  link?: string;
  title: string;
  category: string;
  isCardHovered?: boolean;
}

const WorkImage = ({
  image,
  alt,
  video,
  link,
  title,
  category,
  isCardHovered = false,
}: WorkImageProps) => {
  const [imgError, setImgError] = useState(false);
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeHover = isHovered || isCardHovered;

  useEffect(() => {
    if (activeHover && video && videoRef.current && isVideoAvailable) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else if (!activeHover && videoRef.current) {
      videoRef.current.pause();
    }
  }, [activeHover, video, isVideoAvailable]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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
        draggable={false}
      >
        <div className="work-image-container">
          {!imgError ? (
            <img
              src={image}
              alt={alt}
              loading="lazy"
              draggable={false}
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
                activeHover && isVideoAvailable ? "active" : ""
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
