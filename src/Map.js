import { MapContainer, TileLayer, Polygon, Marker, Popup, SVGOverlay  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import L from 'leaflet';


const center = {
  lat: 32.0749462988577,
  lng: 34.78718205370926,
}


function DraggableMarker() {
  const [draggable, setDraggable] = useState(false)
  const [position, setPosition] = useState(center)
  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          console.log(marker.getLatLng())
          setPosition(marker.getLatLng())
        }
      },
    }),
    [],
  )
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={customIcon}>
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  )
}

const cityBorderCoords = [
  [32.07554717251997, 34.7844746812443],
  [32.07426118206054, 34.78471049206173],
  [32.07432467343758, 34.78597149842801],
  [32.07355655552431, 34.78596031280327],
  [32.07346556913161, 34.79019436511243],
  [32.07840195378189, 34.79290743074442],
];

const pointsOfInterest = [
  { position: [32.07548376066005,  34.79071337991549], name: "begin" },
  { position: [32.073674796781276,  34.78610477046914], name: "kaplan" },
  { position: [32.07612473234684,  34.787204873205205], name: "shaul" },
    { position: [32.07462023150681, 34.78471587382616], name: "leonardo" },];
const offset = 0.0009
const markerBounds = [
  { bounds: [pointsOfInterest[0].position, [pointsOfInterest[0].position[0] - offset, pointsOfInterest[0].position[1] + offset]], text: "begin" },
  { bounds: [pointsOfInterest[1].position, [pointsOfInterest[1].position[0] - offset, pointsOfInterest[1].position[1] + offset]], text: "kaplan" },
  { bounds: [pointsOfInterest[2].position, [pointsOfInterest[2].position[0] - offset, pointsOfInterest[2].position[1] + offset]], text: "shaul" },
  { bounds: [pointsOfInterest[3].position, [pointsOfInterest[3].position[0] - offset, pointsOfInterest[3].position[1] + offset]], text: "leonardo" },
]

const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const popupOpen = true



const Map = () => {

  return (
    <MapContainer
      center={[32.0749462988577, 34.78718205370926]}
      zoom={17}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polygon positions={cityBorderCoords} color="blue" fillColor="lightblue" fillOpacity={0.5} />
      {pointsOfInterest.map((point, index) => (
        <Marker key={index} position={point.position} icon={customIcon}>
          <Popup open={popupOpen}>{point.name}</Popup>
        </Marker>
        
      ))}
      {markerBounds.map((bounds, index) => (
      <SVGOverlay key={index} bounds={bounds.bounds}>
      <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
      <text x="10%" y="10%" stroke="blue">
        {bounds.text}
      </text>
    </SVGOverlay>
          ))}
    <DraggableMarker />
    </MapContainer>
  );
};

export default Map;
