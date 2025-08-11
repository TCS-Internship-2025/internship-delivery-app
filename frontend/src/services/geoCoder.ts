import type { AddressData } from '@/apis/parcelGet';

interface GeocodingResponse {
  lat: number;
  lon: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

export async function getLonLat(address: AddressData): Promise<GeocodingResponse | null> {
  try {
    if (address.latitude !== null && address.longitude !== null) {
      return {
        lat: address.latitude,
        lon: address.longitude,
      };
    }

    const addressParts = [
      address.building,
      address.apartment,
      address.line1,
      address.line2,
      address.city,
      address.postalCode,
      address.country,
    ].filter((part) => part && part.trim() !== '');

    const addressString = addressParts.join(', ');

    if (!addressString.trim()) {
      return null;
    }

    const encodedAddress = encodeURIComponent(addressString);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TCS/SWIFTParcel/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as NominatimResult[];

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const result = data[0];
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return null;
    }

    return {
      lat,
      lon,
    };
  } catch (e) {
    throw new Error(e as string);
  }
}
