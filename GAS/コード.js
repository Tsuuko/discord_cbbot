var id = '1Ki5W3dAKFtJbZd7u1sMt8eMN3h8Ou6bLtabgHd1g4WQ'; // スプレッドシートID
var doc = SpreadsheetApp.openById(id);
var mainsheet = doc.getSheets()[0];
var infosheet = doc.getSheets()[1];

function doGet(e) {

  //JSONオブジェクト格納用の連想配列
  var rowData = {};

  if (e.parameter.mode == undefined) {
    //パラメータ不良の場合はundefinedで返す
    var getvalue = "undefined";
    rowData.value = getvalue;
    return return_output();
  }
  else if (e.parameter.mode == "cbattack") {
    return api_cbattack();
  }
  else if (e.parameter.mode == "cbregist") {
    return api_cbregist();
  }
  else if (e.parameter.mode == "cbdelete") {
    return api_cbdelete();
  }
  else if (e.parameter.mode == "cbclearall") {
    return api_cbclearall();
  }
  else if (e.parameter.mode == "updatecbstatus") {
    return api_update_cbstatus();
  }

  ////////////////////////////////////
  // クラバト開催状況設定＆レスポンス
  ////////////////////////////////////
  // e.parameter.mode = 種別
  // e.parameter.updatecbstatus = 開催ステータス
  // e.parameter.day = 総開催日 (開催中のみ)
  ////////////////////////////////////
  function api_update_cbstatus() {
    if(e.parameter.status==0){
      infosheet.getRange("B3").setValue(0); // 開催ステータス
      rowData.result = "success";
      rowData.message = "開催ステータス登録完了！\n[ 現在クランバトルは開催していません。 ]";
      return return_output();
    }
    else if(e.parameter.status==1){
      infosheet.getRange("B2").setValue(e.parameter.day); // 総開催日（合計日数）
      infosheet.getRange("B3").setValue(1); // 開催ステータス
      rowData.result = "success";
      rowData.message = "開催ステータス登録完了！\n[ 現在クランバトルは開催中です。 ]";
      return return_output();
    }
  }

  ////////////////////////////////////
  // クラバト凸情報書込み＆レスポンス
  ////////////////////////////////////
  // e.parameter.mode = 種別
  // e.parameter.user = ディスコニックネーム
  // e.parameter.assault = 凸数(int)
  ////////////////////////////////////
  function api_cbattack() {
    if (check_cbstatus()) {
      var infosheet = doc.getSheets()[1];
      var cb_now = infosheet.getRange("B1").getValue();
      var cb_total = infosheet.getRange("B2").getValue();
      row = findRow2(mainsheet, e.parameter.user, 1)
      if (row == 0) {
        rowData.result = "failure";
        rowData.message = "登録失敗!\n[ ユーザーが見つかりませんでした。 ]";
        return return_output();
      }
      mainsheet.getRange(row, cb_now + 1).setValue(e.parameter.assault + "凸");
      rowData.result = "success";
      rowData.message = "登録完了！";
      rowData.mode = e.parameter.mode;
      rowData.user = e.parameter.user;
      rowData.assault = e.parameter.assault;
      return return_output();
    }
    else {
      rowData.result = "failure";
      rowData.message = "登録失敗!\n[ クランバトル開催期間外もしくは開催が設定されていません。 ]";
      return return_output();
    }
  }

  ////////////////////////////////////
  // クラバトユーザー登録＆レスポンス
  ////////////////////////////////////
  // e.parameter.mode = 種別
  // e.parameter.user = ディスコニックネーム
  ////////////////////////////////////

  function api_cbregist() {
    if (findRow2(mainsheet, e.parameter.user, 1) != 0) {
      rowData.result = "failure";
      rowData.message = "登録失敗!\n[ 既に " + e.parameter.user + " さんは登録されています。 ]";
      return return_output();
    }
    else {
      target_row = mainsheet.getLastRow() + 1;
      mainsheet.appendRow([e.parameter.user, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "=COUNTA(B" + target_row + ":P" + target_row + ")"]);
      //mainsheet.getRange(target_row, 1).setValue(e.parameter.user);
      rowData.result = "success";
      rowData.message = "登録完了！\n[ " + e.parameter.user + " さんを" + target_row + "行目に登録しました。 ]";
      rowData.user = e.parameter.user;
      rowData.row = target_row;
      return return_output();
    }
  }

  ////////////////////////////////////
  // クラバトユーザー削除＆レスポンス
  ////////////////////////////////////
  // e.parameter.mode = 種別
  // e.parameter.user = ディスコニックネーム
  ////////////////////////////////////

  function api_cbdelete() {
    if (findRow2(mainsheet, e.parameter.user, 1) == 0) {
      rowData.result = "failure";
      rowData.message = "削除失敗!\n[ " + e.parameter.user + " さんは見つかりませんでした。]";
      return return_output();
    }
    else {
      target_row = findRow2(mainsheet, e.parameter.user, 1);
      mainsheet.deleteRow(target_row);
      rowData.result = "success";
      rowData.message = "削除完了！\n[ " + e.parameter.user + " さんを削除しました。 ]";
      rowData.user = e.parameter.user;
      return return_output();
    }
  }

  ////////////////////////////////////
  // クラバトスプレッドシート凸情報クリア＆レスポンス
  ////////////////////////////////////
  // e.parameter.mode = 種別
  ////////////////////////////////////

  function api_cbclearall() {
    var lastRow = mainsheet.getDataRange().getLastRow();
    var lastCol = 16;
    mainsheet.getRange(2, 2, lastRow - 1, lastCol - 1).clearContent();
    rowData.result = "success";
    rowData.message = "クリア完了！\n[ すべてのユーザーの凸情報をクリアしました。 ]";
    return return_output();
  }

  function return_output() {
    var result = JSON.stringify(rowData);
    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(result);
    return output;
  }
}

function findRow2(sheet, val, col) {
  var lastRow = sheet.getDataRange().getLastRow();
  for (var i = 1; i <= lastRow; i++) {
    if (sheet.getRange(i, col).getValue() === val) {
      return i;
    }
  }
  return 0;
}

////////////////////////////////////
// クラバトの日数を進める（トリガー：5時）
////////////////////////////////////
function stepup_cbdate() {
  if (check_cbstatus()) {
    if (infosheet.getRange("B2").getValue() - infosheet.getRange("B1").getValue() ==0) {
      infosheet.getRange("B1").setValue(1); // 現在の開催日（x日目）
      //infosheet.getRange("B2").setValue(0); // 総開催日（合計日数）
      infosheet.getRange("B3").setValue(0); // 開催ステータス
    }
    else {
      infosheet.getRange("B1").setValue(infosheet.getRange("B1").getValue() + 1);
    }
  }
}
// クラバトの開催状況確認
function check_cbstatus() {
  if (infosheet.getRange("B3").getValue() == 0) {
    return false;
  }
  else {
    return true;
  }
}

////////////////////////////////////
// クラバト開催日数以外の列を非表示（トリガー：変更時）
////////////////////////////////////
function hide_nocb_coulmn(){
  if (infosheet.getRange("B3").getValue()==1){
    var total=infosheet.getRange("B2").getValue(); // 総開催日（合計日数）
    var writed_days=15; // スプレッドシートに記載済みの日数（○日目）現在は15日目まで記載
    var target_column_start=total+2; //総開催日+1(名前分)+1(次の列から)
    var target_column_end=writed_days+2-target_column_start;
    var range=mainsheet.getRange(1,target_column_start,1,target_column_end);
    mainsheet.showColumns(2, writed_days+1);
    mainsheet.hideColumn(range);
  }
}
