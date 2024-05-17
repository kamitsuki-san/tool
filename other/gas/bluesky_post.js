const did = "did:plc:XXXXXXXXXX"; // TODO: Settings -> Change my handle -> "I have my own domain" 
let linkCardURLRegex = null;
let linkCardURL = null;
let linkCardImgURL = null;
let linkTitle = null;
const SHEET_ID = "";    // TODO: SpreadSheetのURLから
const SHEET_NAME = "data";

const IDENTIFIER = "";  // TODO: mail address
const PASSWORD = "";    // TODO: app password
const FEED_URL = "";    // TODO: https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed?actor=【@ユーザ】.bsky.social&limit=10

function getParam(table, rowIndex) {
  // ISO8601形式に変換（1995-12-17T03:24:00）
  let dateStr = String(table[rowIndex][0]).replace(/\//g, "-") + "T" + table[rowIndex][1];
  if(dateStr.length != "1995-12-17T03:24:00".length){
    return {};
  }
  const date = new Date(dateStr);

  const data = {
    // 投稿日時
    date: date,
    // 本文
    text: table[rowIndex][2],
    // タイトル
    linkTitle: table[rowIndex][3],
    // リンクカードのリンクURL
    linkCardImgURL: table[rowIndex][4],
    // リンクカードのリンクURLを検索する文字列
    linkCardURLRegex: table[0][4],
  }
  console.log(JSON.stringify(data));
  return data;
}

function doGet(e) {
  // Spreadsheetファイルを開く
  const spreadSheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadSheet.getSheetByName(SHEET_NAME);
  const table = sheet.getDataRange().getValues();

  let accessJwt = accessJwt取得処理();
  AuthorFeed取得処理(accessJwt);
  const curDate = new Date();

  const delList = [];
  let isLoop = true;
  table.forEach((row, index) => {
    if(index < 2){
      return;
    }
    if(!isLoop){
      return;
    }

    const data = getParam(table, index);
    if(!data.date || curDate.getTime() < data.date.getTime()){
      // まだ投稿日時でない
      return;
    }

    const text = data.text;
    if(!text || !text.trim()){
      isLoop = false;
      return;
    }
    linkCardURL = null;
    linkCardImgURL = data.linkCardImgURL;
    linkCardURLRegex = data.linkCardURLRegex;
    linkTitle = data.linkTitle;
  
    console.log("★投稿開始★\n" + text);
    tweet(accessJwt, text);
    delList.push(index);
  });

  // 削除
  delList.reverse();
  delList.forEach((index) => {
    const rowIndex = index + 1;
    console.log("削除行:" + rowIndex);
    sheet.deleteRow(rowIndex);
  });

  let out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  out.setContent(JSON.stringify({result: 0}));
  return out;
}

/** 
 * リンク用の文字列配列を取得
 */
function getFacetsLink(text) {
  // 日本語が3バイト分になるように
  const textEnc = encodeURI(text)
    .replace(/%0[aA]/g, "\n")
    .replace(/%20/g, " ")
    .replace(/%../g, "*");
  console.log("textEnc:" + textEnc);

  // リンク文字列を検索(httpから始まり、空白文字で終わる)
  return Array.from(textEnc.matchAll(/https?:\/\/\S*/g)).map((link) => {
      if(new RegExp(linkCardURLRegex).test(link[0])){
        linkCardURL = link[0];
      }
      return {
        "index": {
            "byteStart": link.index,
            "byteEnd": link.index + link[0].length
        },
        "features": [
            {
                "$type": "app.bsky.richtext.facet#link",
                "uri": link[0]
            }
        ]
      }
  });
}

/** 
 * Hashtag用の文字列配列を取得
 */
function getFacetsTag(text) {
  // 日本語が3バイト分になるように
  const textEnc = encodeURI(text)
    .replace(/%0[aA]/g, "\n")
    .replace(/%20/g, " ")
    .replace(/%../g, "*");

  // リンク文字列を検索(httpから始まり、空白文字で終わる)
  let index = 0;
  return Array.from(textEnc.matchAll(/#\S*/g)).map((link) => {
      const org = Array.from(text.matchAll(/#(\S*)/g))[index][1];
      index++;
      return {
        "index": {
            "byteStart": link.index,
            "byteEnd": link.index + 1 + link[0].length
        },
        "features": [
            {
                "$type": "app.bsky.richtext.facet#tag",
                "tag": org
            }
        ]
      }
  });
}

function getEmpbedImage(accessJwt, imgURL, cardURL, title) {
  let url = "https://bsky.social/xrpc/com.atproto.repo.uploadBlob";
  let blob = UrlFetchApp.fetch(imgURL).getBlob();

  const options = {
    "method": "post",
    "headers": {
      "Authorization": `Bearer ${accessJwt}`
    },
    "payload": blob,
  };

  let response = UrlFetchApp.fetch(url, options);
  let responseJSON = JSON.parse(response.getContentText());

  return {
    "$type": "app.bsky.embed.external",
    "external": {
      "uri": cardURL,
      "title": title,
      "description": "",
      "thumb": {
        "$type": "blob",
        "ref": {
          "$link": responseJSON.blob.ref.$link
        },
        "mimeType": responseJSON.blob.mimeType,
        "size": responseJSON.blob.size
      }
    }
  };
}

function tweet(accessJwt, text) {

  let url = "https://bsky.social/xrpc/com.atproto.repo.createRecord";

  // LINK
  let facets = getFacetsLink(text);
  // HASHTAG
  facets = facets.concat(getFacetsTag(text));

  // データ本体
  let data = {
    "repo": did,
    "collection": "app.bsky.feed.post",
    "record": {
      "text": text,
      "createdAt": (new Date()).toISOString(),
      "facets": facets,
    }
  };
  // リンクカード
  if(linkCardURL){
    data["record"]["embed"] = getEmpbedImage(accessJwt, linkCardImgURL, linkCardURL, linkTitle);
  }
  console.log("data:" + JSON.stringify(data));

  const options = {
    "method": "post",
    "headers": {
      "Authorization": `Bearer ${accessJwt}`,
      "Content-Type": "application/json; charset=UTF-8"
    },
    "payload": JSON.stringify(data),
  };
  let response = UrlFetchApp.fetch(url, options);
  return responseJSON = JSON.parse(response.getContentText());
}

function accessJwt取得処理() {
  let url = "https://bsky.social/xrpc/com.atproto.server.createSession";

  let data = {
    "identifier": IDENTIFIER,
    "password": PASSWORD
  };

  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    payload: JSON.stringify(data),
  };

  let response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText()).accessJwt;
}

function AuthorFeed取得処理(accessJwt) {
  let url = FEED_URL;

  const options = {
    "method": "get",
    "contentType": "application/json",
    "headers": {
      "Authorization": `Bearer ${accessJwt}`
    }
  };

  let response = UrlFetchApp.fetch(url, options);
  return responseJSON = JSON.parse(response.getContentText());
}