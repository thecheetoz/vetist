import Papa from 'papaparse';
import { VetClinic } from '../types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQD9u94BuNw_qkDjTHRl_gGcXkTPzEBQ3yWy1KoPPMjNabL5A6G7lsYgB3jZCqRIlms-MQ3tQCZO588/pub?output=csv';

export const fetchVetData = async (): Promise<VetClinic[]> => {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Map the CSV data to our internal VetClinic type
        // This handles potential variations in column names
        const clinics: VetClinic[] = results.data.map((row: any) => {
          // Normalizing keys to lowercase for robust lookup
          const normalizedRow: any = {};
          Object.keys(row).forEach(key => {
            normalizedRow[key.toLowerCase().trim()] = row[key];
          });

          // Determine name
          const name = normalizedRow['adı'] || normalizedRow['isim'] || normalizedRow['klinik adı'] || normalizedRow['name'] || 'Bilinmeyen Klinik';
          // Determine district
          const district = normalizedRow['i̇lçe adı'] || normalizedRow['ilçe adı'] || normalizedRow['ilçe'] || normalizedRow['ilce'] || normalizedRow['district'] || '-';
          
          let lat = 0;
          let lng = 0;
          
          if (normalizedRow['enlem/boylam']) {
            const coords = normalizedRow['enlem/boylam'].split(',');
            if (coords.length >= 2) {
              lat = parseFloat(coords[0].trim());
              lng = parseFloat(coords[1].trim());
            }
          } else {
            lat = parseFloat(normalizedRow['lat'] || normalizedRow['latitude'] || '0');
            lng = parseFloat(normalizedRow['lng'] || normalizedRow['longitude'] || '0');
          }

          return {
            name,
            district,
            address: normalizedRow['adres'] || normalizedRow['address'] || 'Adres bilgisi yok',
            phone: normalizedRow['telefon'] || normalizedRow['phone'] || '-',
            lat,
            lng,
          };
        }).filter(c => c.lat !== 0 && c.lng !== 0);

        resolve(clinics);
      },
      error: (error: any) => {
        console.error('CSV Parsing Error:', error);
        reject(error);
      }
    });
  });
  } catch (error) {
    console.error('Failed to fetch CSV:', error);
    return [];
  }
};
