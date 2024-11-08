// kakuyomu エピソード編集ページ（https://kakuyomu.jp/my/works/xxxx/episodes/xxxx）から、ツイート用テキストを作成する
javascript: (() => {
  /** メイン処理 */
  function __main() {
    /** 結果を設定する先の親要素セレクタ */
    const RESULT_PARENT = "#contentAside-inner";
    /** 結果HTMLのテンプレート（xxxxを置き換え） */
    const RESULT_HTML_TEMPLATE = `<div style="border:1px solid black;">xxxx</div>`;

    const workTitle = document
      .getElementById("workTitle-title")
      .getAttribute("title");
    const episodeTitle = document.getElementById(
      "contentMainHeader-pageTitle-episodeTitle"
    ).innerText;
    const url = document.location.href.replace("/my/", "/");
    const episodeNumber = document
      .getElementById("workTitle-episodeNumber")
      .innerText.replace(/[^\d]/g, "");

    const postMain =
      `「${workTitle}」<br>${episodeTitle}<br><br><br>` +
      `#narou #小説家になろう https://ncode.syosetu.com/xxxx  /${episodeNumber}<br>` +
      `#kakuyomu #カクヨム ${url}`;
    const post = RESULT_HTML_TEMPLATE.replace("xxxx", postMain);

    let div = document.createElement("div");
    div.innerHTML = post;
    document.querySelector(RESULT_PARENT).appendChild(div);
  }

  /****** 実行 *****/
  __main();
})();

// https://crocro.com/tools/item/gen_bookmarklet/
// javascript:!function(){const e='<div style="border:1px solid black;">xxxx</div>',t=document.getElementById("workTitle-title").getAttribute("title"),n=document.getElementById("contentMainHeader-pageTitle-episodeTitle").innerText,o=document.location.href.replace("/my/","/"),r=`「${t}」<br>${n}<br><br><br>#narou #小説家になろう https://ncode.syosetu.com/xxxx  /${document.getElementById("workTitle-episodeNumber").innerText.replace(/[^\d]/g,"")}<br>#kakuyomu #カクヨム ${o}%60,d=e.replace("xxxx",r);let i=document.createElement("div");i.innerHTML=d,document.querySelector("#contentAside-inner").appendChild(i)}();void(0);
