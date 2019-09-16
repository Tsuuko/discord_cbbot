const request = require('request-promise');
var URL = process.env.GAS_ENDPOINT
exports.capture = function (args) {
    /////////////////////////////////
    // クラバトスプレッドシートキャプチャコマンド [capture]
    /////////////////////////////////
    const CAPTURE_POST_TARGET = "623082136190320640"        // キャプチャ定期送信ターゲット（Channel ID）
    var options = {
        url: "http://api.screenshotlayer.com/api/capture",
        method: 'GET',
        encoding: null,
        qs: {
            "access_key": process.env.SCREENSHOTLAYER_APIKEY,
            "url": "https://docs.google.com/spreadsheets/d/" + process.env.SPREADSHEET_ID + "/edit",
            "delay": 2,
            "force": 1,
            "accept_lang": "ja-jp",
            "viewport": "1000x900",
            "fullpage": 1
        }
    }
    request(options)
        .then(function (body) {
            console.log(args.client);
            if (args.client != null) {
                args.client.channels.get(CAPTURE_POST_TARGET).send('', { file: { attachment: body } });
            }
            else if (args.message != null) {
                args.message.channel.send('', { file: { attachment: body } });
            }

        })
        .catch(function (err) {
            args.message.reply("error");
        });

}

exports.stepup_cbdate = function (message) {
    /////////////////////////////////
    // クラバトの日付を進める
    /////////////////////////////////
    var options = {
        url: URL + '?mode=stepupcbdate',
        method: 'GET'
    }
    request(options);

}

exports.cron = function (arg) {
    const cron = require('node-cron');
    cron.schedule('0 0,6,12,18 * * *', (client = arg) => {
        exports.capture({ "client": client });
    }, {
        scheduled: true,
        timezone: "Asia/Tokyo"
    });
    cron.schedule('0 5 * * *', () => {
        exports.stepup_cbdate();
    }, {
        scheduled: true,
        timezone: "Asia/Tokyo"
    });
}
