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
        let episodesInChapter = [];
        let sumAll = 0;
        // 全文字数
        const charAll = parseInt(document.querySelector("#summary-workInfo-characterCount-all").innerText.replace(/[^\d]/g, ""), 10);
        // 「章とエピソード」の各行に対して実行
        document.querySelectorAll(".isShown .episode, .isShown .chapter").forEach((element) => {
            if (element.classList.contains('chapter')) {
                // 章にあたった時点で、合計情報をリセット
                chapterElement = element;
                episodes = [];
                episodesInChapter.push(episodes);
                return;
            }
            // 以下、エピソードの行に対して処理
            const epiNum = parseInt(element.querySelector(".episode-characterCount").innerText.replace(/[^\d]/g, ""), 10);
            episodes.push(epiNum);
            const sum = episodes.reduce((a, b) => a + b, 0);
            sumAll += epiNum;
            const avg = parseInt(sum/episodes.length,10);
            const l = __rmvHazureVal(episodes);
            const avg2 = parseInt(l.reduce((a, b) => a + b, 0) / l.length, 10);
            // エピソード行処理するたび、毎回対応する章に合計を設定している（どのエピソードが章の最後かは意識しない）
            chapterElement.querySelector(SUM_IN_CHAPTER).innerText=  `合計${sum}`;
            chapterElement.querySelector(AVG_IN_CHAPTER).innerText = `平均${avg}`;
            chapterElement.querySelector(AVG2_IN_CHAPTER).innerText = `外れ値除外平均${avg2}`;
            // 各エピソード行に設定
            const percent = (sumAll/charAll);
            element.style.backgroundColor = `rgb(255, 0, 0, ${percent})`;
            element.querySelector(`.episode-feedback-cheerComment`).innerText = `${sumAll}(${(percent*100).toFixed(1)}%)`;
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
        // 各行
        log += "各行\n";
        let sum = 0;
        episodesInChapter.forEach((episodes, chapter) => {
            episodes.forEach((epiCharNum, epiNum) => {
                sum += epiCharNum;
                log += `${chapter+1}\t${epiNum+1}\t${epiCharNum}\t${sum}\n`;
            });
        });
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
// javascript:!function(){const e="td:nth-child(5)",t="td:nth-child(6)",r="td:last-child";let n=null,c=[],o=[],l=0;const s=parseInt(document.querySelector("#summary-workInfo-characterCount-all").innerText.replace(/[^\d]/g,""),10);document.querySelectorAll(".isShown .episode, .isShown .chapter").forEach((a=>{if(a.classList.contains("chapter"))return n=a,c=[],void o.push(c);const i=parseInt(a.querySelector(".episode-characterCount").innerText.replace(/[^\d]/g,""),10);c.push(i);const u=c.reduce(((e,t)=>e+t),0);l+=i;const h=parseInt(u/c.length,10),d=(S=(S=c).sort()).slice(parseInt(S.length/3,10),-parseInt(S.length/3,10)),p=parseInt(d.reduce(((e,t)=>e+t),0)/d.length,10);var S;n.querySelector(e).innerText=`合計${u}`,n.querySelector(t).innerText=`平均${h}`,n.querySelector(r).innerText=`外れ値除外平均${p}`;const $=l/s;a.style.backgroundColor=`rgb(255, 0, 0, ${$})`,a.querySelector(".episode-feedback-cheerComment").innerText=`${l}(${(100*$).toFixed(1)}%)`}));let a=0,i="";document.querySelectorAll(".isShown .chapter").forEach(((n,c)=>{const o=parseInt(n.querySelector(e).innerText.replace(/[^\d]/g,""),10),l=parseInt(n.querySelector(t).innerText.replace(/[^\d]/g,""),10),s=parseInt(n.querySelector(r).innerText.replace(/[^\d]/g,""),10);i+=`${c+1}\t${o}\t${l}\t${s}\n`,a+=o})),i="全合計"+a+"\n"+i,i+="各行\n";let u=0;o.forEach(((e,t)=>{e.forEach(((e,r)=>{u+=e,i+=`${t+1}\t${r+1}\t${e}\t${u}\n`}))})),console.log(i)}();void(0);