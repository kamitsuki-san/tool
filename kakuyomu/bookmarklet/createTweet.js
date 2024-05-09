// kakuyomu エピソード編集ページ（https://kakuyomu.jp/my/works/xxxx/episodes/xxxx）から、ツイート用テキストを作成する
javascript:
(() => {
    /** メイン処理 */
    function __main () {
        /** 結果を設定する先の親要素セレクタ */ 
        const RESULT_PARENT = "#contentAside-inner";
        /** 結果HTMLのテンプレート（xxxxを置き換え） */
        const RESULT_HTML_TEMPLATE = `<div style="border:1px solid black;">xxxx</div>`;
    
        const workTitle = document.getElementById("workTitle-title").getAttribute("title");
        const episodeTitle = document.getElementById("contentMainHeader-pageTitle-episodeTitle").innerText;
        const url = document.location.href.replace("/my/", "/");

        const postMain = `「${workTitle}」<br>${episodeTitle}<br><br><br>` + 
        `#narou #小説家になろう https://ncode.syosetu.com/xxxx<br>` + 
        `#kakuyomu #カクヨム ${url}`;
        const post = RESULT_HTML_TEMPLATE.replace("xxxx", postMain);

        let div = document.createElement('div');
        div.innerHTML = post;
        document.querySelector(RESULT_PARENT).appendChild(div);
    };

    /****** 実行 *****/
    __main();
})();

// https://crocro.com/tools/item/gen_bookmarklet/
// javascript:!function(){const e='<div style="border:1px solid black;">xxxx</div>',t=`「${document.getElementById("workTitle-title").getAttribute("title")}」<br>${document.getElementById("contentMainHeader-pageTitle-episodeTitle").innerText}<br><br><br>#narou #小説家になろう https://ncode.syosetu.com/xxxx<br>#kakuyomu #カクヨム ${document.location.href.replace("/my/","/")}`,n=e.replace("xxxx",t);let o=document.createElement("div");o.innerHTML=n,document.querySelector("#contentAside-inner").appendChild(o)}();void(0);