import Papa from 'papaparse';
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQD9u94BuNw_qkDjTHRl_gGcXkTPzEBQ3yWy1KoPPMjNabL5A6G7lsYgB3jZCqRIlms-MQ3tQCZO588/pub?output=csv")
  .then(r => r.text())
  .then(text => {
    const results = Papa.parse(text, { header: true, skipEmptyLines: true });
    if (results.data.length > 0) {
      const row = results.data[0] as any;
      const normalizedRow: any = {};
      Object.keys(row).forEach(key => {
        normalizedRow[key.toLowerCase().trim()] = row[key];
      });

      const name = normalizedRow['adı'] || normalizedRow['isim'] || 'Bilinmeyen Klinik';
      const district = normalizedRow['i̇lçe adı'] || normalizedRow['ilçe adı'] || normalizedRow['ilçe'] || '-';
      
      let lat = 0;
      let lng = 0;
      if (normalizedRow['enlem/boylam']) {
        const coords = normalizedRow['enlem/boylam'].split(',');
        lat = parseFloat(coords[0]);
        lng = parseFloat(coords[1]);
      }
      
      console.log({
        name,
        district,
        lat,
        lng,
        address: normalizedRow['adres']
      });
    }
  });
