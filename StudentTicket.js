const axios = require('axios');
const { WebClient } = require('@slack/web-api');


exports.handler = async (ev, ctx) => {
  const { route, emit } = ctx;

  const SLACK_BOT_TOKEN = ''
  const SLACK_WEBHOOK_URL = ''

  const slackClient = new WebClient(SLACK_BOT_TOKEN);

  if (ev.body.type === 'url_verification') {
    // Respond to the URL verification challenge
    emit('response', { statusCode: 200, body: ev.body.challenge });
  }
  else if (ev.body.event.type === 'message' && ev.body.event.channel_type === 'im') {
    // If the event is a direct message, post it to another channel
    const message = ev.body.event.text;
    const sender = ev.body.event.user;

    // Fetch user info using API Call
    /*
    const usersResponse = await axios.post('https://slack.com/api/users.info', {
      user: sender
    }, {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`
      }
    });
    */

    // Fetch user info using WebClient
    const usersResponse = await slackClient.users.info({ user: ev.body.event.user });

    if (usersResponse.ok) {
      const senderName = usersResponse.user.profile.real_name;
    } 
    else {
      console.error('Error fetching user information:', usersResponse.error);
    }
    
    if (usersResponse.ok) {
      const senderName = usersResponse.user.profile.real_name;

      // Post the message to the other channel
      const postResponse = await axios.post(SLACK_WEBHOOK_URL, {
        text: `New direct message from ${senderName} on ${new Date().toLocaleString()}:\n\n${message}`
      });

      console.log(postResponse);
    } else {
      console.log(usersResponse);
    }
  }

  // Emit response right away to Slack
  emit('response', { statusCode: '200'});

  // route the event object to the next node
  route(ev);
};
