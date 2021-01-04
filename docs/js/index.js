const question = [
    {
        id: 1,
        message: 'アーモンドアイは？',
        choise: ['牡馬', '牝馬', '騸馬'],
        answer: 1,
    },
    {
        id: 2,
        message: '大泉洋は？',
        choise: ['北海道', '福岡', '東京'],
        answer: 0,
    },
    {
        id: 3,
        message: '野獣先輩は？',
        choise: ['男', '女の子', 'どちらでもない'],
        answer: 1,
    },
    {
        id: 4,
        message: 'ごはんは？',
        choise: ['どちらでもない', 'まずい！', 'おいしい！'],
        answer: 1,
    },
    {
        id: 5,
        message: '大丈夫？',
        choise: ['はい', 'そうでもない', 'いいえ'],
        answer: 2,
    },
    {
        id: 6,
        message: '汁なしカレーメシ。本当に汁がないのか？',
        choise: ['なくはないです...', 'わかりません...', 'はい'],
        answer: 0,
    },
    {
        id: 7,
        message: 'R指定の名前？',
        choise: ['野上くん', 'R殿！', 'R指亭恭平'],
        answer: 2,
    },
    {
        id: 8,
        message: '柳田悠岐は？',
        choise: ['広島', '福岡', '東京'],
        answer: 1,
    },
    {
        id: 9,
        message: '菅野美穂？',
        choise: ['菅野美穂', '缶飲み放題', 'どちらでもない'],
        answer: 0,
    },
    {
        id: 10,
        message: '俺だよ俺！',
        choise: ['ハンバーグだよ！', '誰だよ！', 'どちらでもない'],
        answer: 0,
    },
    {
        id: 11,
        message: 'トンボ？',
        choise: ['驕り昂り言語道断', '夏の虫', 'なにそれ？'],
        answer: 0,
    },
    {
        id: 12,
        message: 'ジョブズ？',
        choise: ['後ろ見とけハゲ', '俺チンカスだった...', 'あるある'],
        answer: 0,
    },
    {
        id: 13,
        message: '常田？',
        choise: ['長野', '福岡', '俺よ'],
        answer: 0,
    },
    {
        id: 14,
        message: 'アーチーチーアーチ？',
        choise: ['階段', '廊下', 'は？'],
        answer: 1,
    },
]

fetch('js/question.json')
    .then(res => res.json())
    .then(data => {
        const question = data;

    });

let myAnswer = new Array();



//ランダムに取得した要素を別の配列に並べるために、新しい配列を用意する（グローバルじゃなくてクロージャ？）
let endArr = new Array();

const copy = document.getElementById('push');

//画面の初期化：スタートボタンを削除する
function init() {
    copy.addEventListener('click', () => {
        const root = document.getElementById('root')
        while (root) {
            root.removeChild(root.children[0]);
            break;
        }
        myAnswer = new Array();
        question.push(...endArr);
        endArr = new Array();
        foo();
    });
}
init();


function foo() {
    const root = document.getElementById('root');
    const div = document.createElement('div');
    div.setAttribute('id', 'question');
    const p = document.createElement('p');

    //画面表示の初期化：表示されている問題を削除する
    if (root.querySelector('#question') != null){
        root.removeChild(root.querySelector('#question'));
    }

    //question配列のlengthからランダムに数値を取得
    const randomLenNum = Math.floor(Math.random() * question.length);

    //question配列からランダムに要素を取得
    const data = question[randomLenNum];

    //選択肢を生成
    const chos = document.createElement('div'); 
    for (let i = 0; i < 3; i++){
        const button = document.createElement('button');
        const cho = document.createTextNode(data.choise[i]);
        button.setAttribute('data-value', i);
        button.classList.add('qButton');
        button.appendChild(cho);
        chos.appendChild(button);
    }

    //別の配列が10件以上入っていないか確認
    if (endArr.length < 10) {
        //取得した要素を別の配列に並べる
        endArr.push(data);
    } else {
        bar();
        return;
    }

    //question配列から取得した要素を削除
    question.splice(randomLenNum, 1);

    const text = document.createTextNode(data.message);
    p.appendChild(text);
    div.appendChild(p);
    div.appendChild(chos);
    root.appendChild(div);

    decision();

}

const decision = () => {
    const qButton = document.getElementById('root').querySelectorAll('.qButton');
    const q = document.getElementById('root').querySelector('#question');
    for (let i = 0; i < qButton.length; i++) {
        qButton[i].addEventListener('click', (e) => {
            const attr = e.target.getAttribute('data-value');
            myAnswer.push(attr);
            q.parentNode.removeChild(q);
            foo();
        })
    }
};

// 回答と正答を比較する
function bar() {
    let points = 0;
    for (let i = 0; i < 10; i++) {
        const me = Number(myAnswer[i]);
        const you = Number(endArr[i].answer);
        if (me === you) {
            points = points + 10;
        } else {
            ;
        }
        console.log(me, you)
    }
    //得点を表示する
    const root = document.getElementById('root');
    const div = document.createElement('div');
    div.setAttribute('id', 'points');
    const p = document.createElement('p');
    let innerText;
    if (points <= 50) {
        innerText = 'あなたの点数は' + points + '点でした。<br>もう少し頑張りましょう。';
    } else if (points <= 70){
        innerText = 'あなたの点数は' + points + '点でした。<br>普通ですね。';
    } else if (points <= 90) {
        innerText = 'あなたの点数は' + points + '点でした。<br>惜しい！あと少し！';
    } else if (points <= 100) {
        innerText = 'あなたの点数は' + points + '点でした。<br>素晴らしい！';
    }
    p.innerHTML = innerText;
    div.appendChild(p);
    div.appendChild(copy);
    root.appendChild(div);
}