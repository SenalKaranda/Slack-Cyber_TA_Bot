exports.handler = async(ev, ctx) => {
  const { route, emit } = ctx;

  // Emit response right away to Slack
  emit('response', { statusCode: '200'});

  ev.responseURL = ev.body.response_url;
  ev.message = ev.body.text;

  // route the event object to the next node
  route(ev);
};
