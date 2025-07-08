import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

type ArrowButtonProps = {
  direction: "left" | "right";
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label: string;
  visible: boolean;
};

function ArrowButton({ direction, onClick, label, visible }: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      style={{
        position: "absolute",
        zIndex: 2,
        [direction === "left" ? "left" : "right"]: 15,
        top: "calc(50% - 20px)",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "50%",
        width: 40,
        height: 40,
        fontSize: 24,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: visible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label={label}
    >
      {direction === "left" ? "\u2190" : "\u2192"}
    </button>
  );
}

type onClickHandlerType = (e: React.MouseEvent<HTMLButtonElement>) => void;

const renderArrowPrev = (
  onClickHandler: onClickHandlerType,
  hasPrev: boolean,
  label: string,
) => (
  <ArrowButton
    direction="left"
    onClick={onClickHandler}
    label={label}
    visible={hasPrev}
  />
);

const renderArrowNext = (
  onClickHandler: onClickHandlerType,
  hasNext: boolean,
  label: string,
) => (
  <ArrowButton
    direction="right"
    onClick={onClickHandler}
    label={label}
    visible={hasNext}
  />
);

type ImageCarouselImplProps = {
  images: string[];
  alt?: string;
};

export function ImageCarouselImpl({
  images,
  alt = "",
}: ImageCarouselImplProps) {
  return (
    <Carousel
      showThumbs={true}
      showStatus={true}
      autoPlay
      swipeable
      emulateTouch
      infiniteLoop
      width={"75%"}
      renderArrowPrev={renderArrowPrev}
      renderArrowNext={renderArrowNext}
    >
      {images.map((src, i) => (
        <div key={i}>
          <img src={src} alt={alt} />
        </div>
      ))}
    </Carousel>
  );
}
