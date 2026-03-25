
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function checkMetricas() {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const keyPath = path.join(process.cwd(), 'public', 'boxcrossfit-16547bd627eb.json');
  
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Metricas!A1:G20',
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }

    console.log('--- METRICAS PREVIEW ---');
    rows.forEach((row, i) => {
      console.log(`Row ${i}:`, JSON.stringify(row));
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
  }
}

checkMetricas();
