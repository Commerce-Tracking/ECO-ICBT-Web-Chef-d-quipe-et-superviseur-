// react plugin for creating vector maps
import { VectorMap } from "@react-jvectormap/core";
import { worldMill} from "@react-jvectormap/world";

// Define the component props
interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markerStyle={{
        initial: {
          fill: "#00277F", // Bleu principal de la nouvelle charte
          r: 4, // Custom radius for markers
        } as never, // Type assertion to bypass strict CSS property checks
      }}
      markersSelectable={true}
      markers={[
        {
          latLng: [6.129459, 1.216008],
          name: "Lomé",
          style: {
            fill: "#00277F", // Bleu principal de la nouvelle charte
            borderWidth: 1,
            borderColor: "white",
            stroke: "#374854", // Gris foncé de la nouvelle palette
          },
        },
        {
          latLng: [10.859451, 0.200145],
          name: "Dapaong",
          style: { fill: "#00277F", borderWidth: 1, borderColor: "white" }, // Bleu principal
        },
        {
          latLng: [12.413628, -1.598340],
          name: "Ougadougou",
          style: { fill: "#00277F", borderWidth: 1, borderColor: "white" }, // Bleu principal
        },
        {
          latLng: [6.444744, 2.354654],
          name: "Calavi",
          style: {
            fill: "#00277F", // Bleu principal de la nouvelle charte
            borderWidth: 1,
            borderColor: "white",
            strokeOpacity: 0,
          },
        },
      ]}
      zoomOnScroll={true}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      regionsSelectable={true}
      zoomStep={2.0}
      regionStyle={{
        initial: {
          fill: mapColor || "#D0D5DD",
          fillOpacity: 1,
          fontFamily: "DM Sans",
          stroke: "none",
          strokeWidth: 0,
          strokeOpacity: 0,
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#00277F", // Bleu principal de la nouvelle charte
          stroke: "none",
        },
        selected: {
          fill: "#00277F", // Bleu principal de la nouvelle charte
        },
        selectedHover: {},
      }}
      regionLabelStyle={{
        initial: {
          fill: "#1b2e3b", // Gris sombre de la nouvelle palette
          fontWeight: 500,
          fontSize: "13px",
          stroke: "none",
        },
        hover: {},
        selected: {},
        selectedHover: {},
      }}
    />
  );
};

export default CountryMap;
