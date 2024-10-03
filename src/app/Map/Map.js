import { MapContainer, TileLayer, Polygon, Marker, Popup, SVGOverlay  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { center, cityBorderCoords, pointsOfInterest, markerBounds, defaultIcon } from '../constants/constants';
import DraggableMarker from '../DraggableMarker/DraggableMarker';
import L from 'leaflet';

const Map = () => {
  const [messages, setMessages] = useState([]);
  const [lastMessageTIme, setLastMessageTime] = useState(0)
  const [gateIcons, setGateIcons] = useState(Array(pointsOfInterest.length).fill(defaultIcon));

  let  messagesRef = useRef([]);
  let lastTimeStamp = useRef(0)
  let count = useRef(0)

    useEffect(() => {
      const updateGateIcon = (gateName, newIcon) => {
        console.log("entered updateGateIcon with getName: " + gateName)
        console.log("the new icon is: " + newIcon)
        setGateIcons((prevIcons) => prevIcons.map((icon, index) => pointsOfInterest[index].name === gateName ? newIcon :icon))
      }
        const getMarkerIconByColor = (color) => {
          return new L.Icon({
            iconUrl: require('leaflet/dist/images/marker-icon-' + color + '.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })

      };
    
      const fetchWithTimeout = (url, options, timeout = 5000) => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), timeout)
            )
        ]);
    };


    
      const fetchMarkerData = async () => {
        try {
          const response = await fetchWithTimeout('http://localhost:3001/' + lastTimeStamp.current, { method: 'GET' });
          const data = await response.json();
          messagesRef.current = [...messagesRef.current, ...data]

          lastTimeStamp.current = messagesRef.current[messagesRef.current.length - 1][0]
          updateGateIcon(pointsOfInterest[count.current %  pointsOfInterest.length].name, Math.floor((count.current / pointsOfInterest.length)) % 2 == 0 ?   getMarkerIconByColor('green') : getMarkerIconByColor('red'))

          count.current = count.current + 1

        } catch (error) {
          console.error('Error fetching markers:', error);
        }
      };
      fetchMarkerData();
  
      const intervalId = setInterval(() => {
        fetchMarkerData();
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, []);


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
        <Marker key={index} position={point.position} icon={gateIcons[index]}>
        <Popup>{point.name}</Popup>
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

