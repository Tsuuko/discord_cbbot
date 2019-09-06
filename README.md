# discord_cbbot
クラバト凸管理用DiscordBOT

- discord_server
  - DiscordBOTの本体です。
  - [Glitch](https://www.google.co.jp/)というサービスで動かしています。
  - https://glitch.com/~discord-cbbot

- GAS
  - スプレッドシート連携用のAPIを立ててます。
  - 本当はNode.js側で操作したかったのですが非同期処理に苦しめられたのでこうなりました…

## discord_server

環境変数に登録されている下記の情報を取得しています。

```
DISCORD_BOT_TOKEN=DiscordBOT作成時に発行されるトークン

GAS_ENDPOINT=GASウェブアプリケーションURL
```

### Glitch

一定時間アクセスがないとスリープしてしまうためUptimeRobotを使用して定期アクセスしてますが、自身からのGETリクエストでもスリープしないことを発見したので使わなくても解決できそうです。

## GAS
アクセス時のログイン要求をなくすために、GCEにプロジェクトを作ってAPIを許可、発行されたメールアドレスをスプレッドシートのアクセスできるユーザーに追加する必要があるかもしれないです（ないかも）


# TODO
- [ ] 日付変更をGASのトリガーではなくBOT側で行うように変更
  - node-cronというパッケージでできそう
- [ ] 定時にスプレッドシートのキャプチャを撮って送信
  - 直接BOT側で撮ろうとすると日本語が文字化けするため[screenshotlayer](https://screenshotlayer.com)というサービスを利用
- [ ] WakeLockをUptimeRobotに頼らずBOT自身で完結させる
  - BOTのLiveAppURLに定期的にBOTからGETリクエストを送ればいい
  - node-cronというパッケージでできそう
