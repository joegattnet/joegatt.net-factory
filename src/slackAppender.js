const request = require('request');

function slackAppender(config, layout) {
    return (loggingEvent) => {
        request.post(config.webhook, {
            json: { text: layout(loggingEvent, config.timezoneOffset) }
        }, (error, res, body) => {
            if (error) {
                console.error('log4js:slack - Error sending log to slack: ', err) //eslint-disable-line
                return
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body);
        })
    }
}

function configure(config, layouts) {
    let layout = layouts.basicLayout
    if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout)
    }
    return slackAppender(config, layout);
}

export default { configure: configure }
