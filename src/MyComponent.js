import { useMapEvent } from 'https://cdn.esm.sh/react-leaflet/hooks'
const MyComponent = () => {
// function MyComponent() {
    const map = useMapEvent('click', () => {
      map.setView([50.5, 30.5], map.getZoom())
    })
    return null
  }
  export default MyComponent; 