const { GoogleSpreadsheet } = require('google-spreadsheet');
const axios = require('axios');

exports.handler = async (ev, ctx) => {
  const { route } = ctx;

  // Replace with your own values
  const SERVICE_ACCOUNT_EMAIL = '';
  const PRIVATE_KEY = '';
  const SHEET_ID = '';
  const WEBHOOK_URL = '';

  // Authorize and load the Google Sheet
  const doc = new GoogleSpreadsheet(SHEET_ID);
  console.log('Authorizing Google Acc');
  await doc.useServiceAccountAuth({
    client_email: SERVICE_ACCOUNT_EMAIL,
    private_key: PRIVATE_KEY,
  });
  await doc.loadInfo();
  console.log('Loaded Doc');

  // Get the first sheet
  const sheet = doc.sheetsByIndex[0];
  console.log('Loaded Sheet');

  // Get the rows
  const rows = await sheet.getRows();
  console.log('Got Rows');

  // Convert the rows to a message
  let message = '';
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    message += row._rawData[0] + ': ' + row._rawData[1] + '\n';
    console.log('Added Row' + i.toString());
  }

  // Send the message to Slack
  try {
    await axios.post(WEBHOOK_URL, {
      text: message,
    });
    console.log('Slack message sent');
  } catch (err) {
    console.error('Failed to send Slack message:', err.message);
  }

  // Route the output data to the next node
  route(ev);
};
