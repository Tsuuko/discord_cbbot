var request = require('request-promise');
exports.discord_bot = function (message) {
  var URL = process.env.GAS_ENDPOINT
  // help
  var print_help = function () {
    message.channel.send("\
  ---  ヘルプ ---\n\
  ・起動コマンド（必ず入力）：'!cb' \n\
  ・オプション\コマンド\n\n\
      ・挨拶（テスト用）\n\
        [ BOTが挨拶してくれます。 ]\n\
          ・'hello'\n\n\
      ・ユーザー登録（初回のみ）\n\
        [ スプレッドシートにユーザー情報が登録されます。 ]\n\
          ・本人：'regist'\n\
          ・ユーザー指定：'regist -u ユーザー名 回数'\n\n\
      ・ユーザー削除（除名時のみ）\n\
        [ スプレッドシートからユーザー情報を削除します。 ]\n\
          ・本人：'delete'\n\
          ・ユーザー指定：'delete -u ユーザー名'\n\n\
      ・クラバト開催状況&日数設定\n\
        [ クラバト開催状況と日数を設定します。 ]\n\
          ・'setstatus 状況（開催中：true 非開催中:false） 総日数'\n\
            例1）'!cb setstatus true 10'：クラバト開催中＆10日間開催\n\
            例2）'!cb setstatus false'：クラバト非開催中\n\n\
      ・クラバト凸登録\n\
        [ クラバトの凸状況を設定します。 ]\n\
        [ 後から設定できないのでその日のうちに設定してください。 ]\n\
          ・本人：'attack 回数'\n\
          ・ユーザー指定：'attack -u ユーザー名 回数'\n\n\
      ・全ユーザー凸情報クリア\n\
        [ 全ユーザーの凸情報をクリアします。 ]\n\
          ・'clearall'\n\
  ");
  }

  //////////////////////////////////
  // クラバト開催状況設定 [setstatus]
  /////////////////////////////////
  var cb_update_status = function (message) {
    if (cb_command.length === 4) {
      if (cb_command[2] == "true") {
        var day = Number(cb_command[3]);
        cb_update_status_post(1, day);
        return;
      }
    }
    if (cb_command.length === 3) {
      if (cb_command[2] == "false") {
        var day = null
        cb_update_status_post(0, day);
        return;
      }
      else {
        message.reply("開催ステータス登録失敗！\n[ trueの場合は開催日を入力する必要があります。 ]")
      }
    }

    function cb_update_status_post(status, day) {
      if (day == null) {
        var options = {
          url: URL + '?mode=updatecbstatus&status=' + status,
          method: 'GET',
          json: true
        }
      }
      else {
        var options = {
          url: URL + '?mode=updatecbstatus&status=' + status + "&day=" + cb_command[3],
          method: 'GET',
          json: true
        }
      }

      request(options)
        .then(function (body) {
          //message.reply(body["result"]);
          if (body["result"] == "success") {
            message.reply(body["message"]);
            return;
          }
          else {
            message.reply(body["message"]);
            return;
          }
        })
        .catch(function (err) {
          message.reply(err);
        });
    }
  }



  //////////////////////////////////
  // クラバトユーザー登録 [regist]
  /////////////////////////////////
  var cb_regist = function (message) {
    if (cb_command.length === 4 && cb_command[2] === "-u") {
      cb_regist_post(cb_command[3]);
      return;
    }
    else {
      cb_regist_post(message.member.nickname);
      return;
    }


    function cb_regist_post(user) {
      var options = {
        url: URL + '?mode=cbregist&user=' + encodeURIComponent(user),
        method: 'GET',
        json: true
      }
      request(options)
        .then(function (body) {
          //message.reply(body["result"]);
          if (body["result"] == "success") {
            message.reply(body["message"]);
            return;
          }
          else {
            message.reply(body["message"]);
            return;
          }
        })
        .catch(function (err) {
          message.reply(err);
        });
    }
  }

  //////////////////////////////////
  // クラバトユーザー削除 [delete]
  /////////////////////////////////
  var cb_delete = function (message) {
    if (cb_command.length === 4 && cb_command[2] === "-u") {
      cb_delete_post(cb_command[3]);
      return;
    }
    else {
      cb_delete_post(message.member.nickname);
      return;
    }

    function cb_delete_post(user) {
      var options = {
        url: URL + '?mode=cbdelete&user=' + encodeURIComponent(user),
        method: 'GET',
        json: true
      }
      request(options)
        .then(function (body) {
          if (body["result"] == "success") {
            message.reply(body["message"]);
            return;
          }
          else {
            message.reply(body["message"]);
            return;
          }
        })
        .catch(function (err) {
          message.reply(err);
        });
    }
  }

  /////////////////////////////////
  // クラバトスプレッドシート凸情報クリアコマンド [clearall]
  /////////////////////////////////
  var cb_clearall = function (message) {
    cb_clearall_post();
    return;

    function cb_clearall_post() {
      var options = {
        url: URL + '?mode=cbclearall',
        method: 'GET',
        json: true
      }
      request(options)
        .then(function (body) {
          if (body["result"] == "success") {
            message.reply(body["message"]);
            return;
          }
          else {
            message.reply(body["message"]);
            return;
          }
        })
        .catch(function (err) {
          message.reply(err);
        });
    }
  }

  //////////////////////////////////
  // クラバト凸コマンド [attack]
  /////////////////////////////////
  var cb_attack = function (message) {
    if (cb_command.length === 5 && cb_command[2] === "-u") {
      cb_attack_post(cb_command[3], cb_command[4]);
      //message.channel.send("ゆーざーおぷしょんあたっく！" + String(cb_command[3]) + "さん" + String(cb_command[4]) + "凸！");
      return;
    }
    else {
      cb_attack_post(message.member.nickname, cb_command[2]);
      //message.channel.send("あたっく！ " + String(cb_command[2]) + "凸！");
      return;
    }

    // クラバト凸登録
    function cb_attack_post(user, assault) {
      var options = {
        url: URL + '?mode=cbattack&user=' + encodeURIComponent(user) + '&assault=' + assault,
        method: 'GET',
        json: true
      }
      request(options)
        .then(function (body) {
          if (body["result"] == "success") {
            message.reply(body["message"] + " [ " + body["user"] + " さん " + body["assault"] + "凸 ]");
            return;
          }
          else {
            message.reply(body["message"]);
            return;
          }
        })
        .catch(function (err) {
          message.reply(err);
        });
    }
  }

  /////////////////////////////////
  // クラバトスプレッドシートキャプチャコマンド [capture]
  /////////////////////////////////
  function capture() {
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
        message.channel.send('', { file: { attachment: body } });
      })
      .catch(function (err) {
        message.reply("err");
      });
  }



  if (message.content === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('pong', { file: { attachment: '/app/a.png' } });
  }
  if (message.author.bot) return;
  if (message.content.startsWith("!cb")) {
    // コマンドをスペースで切り出し
    var cb_command = message.content.split(" ");
    // 起動コマンドのみ
    if (cb_command.length === 1) {
      //message.reply(message.member.nickname)
      print_help();
    }
    // こんにちは
    if (cb_command[1] === "hello") {
      message.reply("Hello!");
    }
    // クラバト凸コマンド
    else if (cb_command[1] === "attack") {
      cb_attack(message);
    }
    // クラバトユーザー登録コマンド
    else if (cb_command[1] === "regist") {
      cb_regist(message);
    }
    // クラバトユーザー削除コマンド
    else if (cb_command[1] === "delete") {
      cb_delete(message);
    }
    // クラバトスプレッドシート凸情報クリアコマンド
    else if (cb_command[1] === "clearall") {
      cb_clearall(message);
    }
    // クラバト開催状況設定コマンド
    else if (cb_command[1] === "setstatus") {
      cb_update_status(message);
    }
    // スプレッドシートURL表示
    else if (cb_command[1] === "url") {
      message.reply("https://docs.google.com/spreadsheets/d/" + process.env.SPREADSHEET_ID + "/edit");
    }
    // スプレッドシートキャプチャ
    else if (cb_command[1] === "capture") {
      capture();
    }
  }
}

