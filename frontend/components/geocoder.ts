export async function getCoordinatesForPlace(placeName: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`,
    {
      headers: {
        "User-Agent": "LocateIt_App/1.0"
      }
    }
  );
  
  const data = await response.json();
  
  if (!data || data.length === 0) {
    throw new Error(`Could not find geographic coordinates for landmark: "${placeName}"`);
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}