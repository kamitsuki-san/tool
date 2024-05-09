// kakuyomu トップページ（https://kakuyomu.jp/my/works/xxxx）にて、各章の合計文字数などを表示する
javascript:
(() => {
    /** メイン処理（合計を計算、設定） */
    function __cnt () {
        // 結果を設定するセレクタ（「章とエピソード」の章の行配下）
        const SUM_IN_CHAPTER = "td:nth-child(5)";
        const AVG_IN_CHAPTER = "td:nth-child(6)";
        const AVG2_IN_CHAPTER = "td:last-child";
    
        let chapterElement = null;
        let episodes = [];
        // 「章とエピソード」の各行に対して実行
        document.querySelectorAll(".isShown .episode, .isShown .chapter").forEach((element) => {
            if (element.classList.contains('chapter')) {
                // 章にあたった時点で、合計情報をリセット
                chapterElement = element;
                episodes = [];
                return;
            }
            // 以下、エピソードの行に対して処理
            episodes.push(parseInt(element.querySelector(".episode-characterCount").innerText.replace(/[^\d]/g, ""), 10));
            const sum = episodes.reduce((a, b) => a + b, 0);
            const avg = parseInt(sum/episodes.length,10);
            const l = __rmvHazureVal(episodes);
            const avg2 = parseInt(l.reduce((a, b) => a + b, 0) / l.length, 10);
            // エピソード行処理するたび、毎回対応する章に合計を設定している（どのエピソードが章の最後かは意識しない）
            chapterElement.querySelector(SUM_IN_CHAPTER).innerText=  `合計${sum}`;
            chapterElement.querySelector(AVG_IN_CHAPTER).innerText = `平均${avg}`;
            chapterElement.querySelector(AVG2_IN_CHAPTER).innerText = `外れ値除外平均${avg2}`;
        });
    
        // 以下は、集計、検討用にコンソールに出力するための処理
        let allSum = 0;
        let log = "";
        document.querySelectorAll(".isShown .chapter").forEach((element, index) => {
            const sum = parseInt(element.querySelector(SUM_IN_CHAPTER).innerText.replace(/[^\d]/g, ""), 10);
            const avg = parseInt(element.querySelector(AVG_IN_CHAPTER).innerText.replace(/[^\d]/g, ""), 10);
            const avg2 = parseInt(element.querySelector(AVG2_IN_CHAPTER).innerText.replace(/[^\d]/g, ""), 10);
            log += (`${index+1}\t${sum}\t${avg}\t${avg2}\n`);
            allSum += sum;
        });
        log = ("全合計" + allSum + "\n") + log;
        console.log(log);
    };
    /** 引数の配列から、外れ値を除外した配列を返す */
    function __rmvHazureVal (numList) {
        numList = numList.sort();
        // 3分割して中央を取得
        const result = numList.slice(parseInt(numList.length/3, 10), -parseInt(numList.length/3, 10));
        return result;
    };

    /****** 実行 *****/
    __cnt();
})();

// https://crocro.com/tools/item/gen_bookmarklet/
// javascript:!function(){const e="td:nth-child(5)",t="td:nth-child(6)",r="td:last-child";let n=null,c=[];document.querySelectorAll(".isShown .episode, .isShown .chapter").forEach((l=>{if(l.classList.contains("chapter"))return n=l,void(c=[]);c.push(parseInt(l.querySelector(".episode-characterCount").innerText.replace(/[^\d]/g,""),10));const o=c.reduce(((e,t)=>e+t),0),s=parseInt(o/c.length,10),a=(h=(h=c).sort()).slice(parseInt(h.length/3,10),-parseInt(h.length/3,10)),i=parseInt(a.reduce(((e,t)=>e+t),0)/a.length,10);var h;n.querySelector(e).innerText=`合計${o}`,n.querySelector(t).innerText=`平均${s}`,n.querySelector(r).innerText=`外れ値除外平均${i}`}));let l=0,o="";document.querySelectorAll(".isShown .chapter").forEach(((n,c)=>{const s=parseInt(n.querySelector(e).innerText.replace(/[^\d]/g,""),10),a=parseInt(n.querySelector(t).innerText.replace(/[^\d]/g,""),10),i=parseInt(n.querySelector(r).innerText.replace(/[^\d]/g,""),10);o+=`${c+1}\t${s}\t${a}\t${i}\n`,l+=s})),o="全合計"+l+"\n"+o,console.log(o)}();void(0);