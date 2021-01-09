(function () {
    fetch('js/questions.json')
        .then(res => res.json())
        .then(data => {
            //問題に関するデータをjsonから取得
            const question = data;

            //解答者の解答を入れる配列インスタンスを作成
            let yourAnswer = new Array();

            //完了した問題を入れる配列インスタンスを作成
            let endAnswer = new Array();
            
            //スタートボタンを取得
            const startBtn = document.getElementById('push');

            //ページの初期表示に対して行う対応
            function greeting() {
                //冒頭の文章を作成。
                const greet = document.getElementById('greet');
                //ローカルストレージから前回の解答状況を取得
                let greetText;
                if (localStorage.getItem('previousPoints')) {
                    //前回の点数を表示する
                    greetText = 'あなたの前回の点数は' + localStorage.getItem('previousPoints') + '点でした。下のボタンを押して再チャレンジ！';
                } else {
                    //前回解答がなければ初期挨拶を表示
                    greetText = 'ようこそクイズルームへ！下のボタンを押してクイズにチャレンジしてみてください！';
                }
                const greetTextOuter = document.createTextNode(greetText);
                greet.appendChild(greetTextOuter);
            }
            greeting();

            //画面の初期化：スタートボタンを押して、スタートボタンや表示テキストを削除する
            function init() {
                //スタートボタンを押して処理開始
                startBtn.addEventListener('click', () => {
                    //#root内の要素を全て削除する
                    const root = document.getElementById('root')
                    while (root.children[0]) {
                        root.removeChild(root.children[0]);
                    }
                    //解答者の解答を初期化する。ランダムな問題と答えはデータをjsonデータに返してから初期化する。
                    yourAnswer = new Array();
                    question.push(...endAnswer);
                    endAnswer = new Array();
                    //問題文を表示する処理を行う。
                    dispQuestion();
                });
            }
            init();

            //問題文を表示する
            function dispQuestion() {
                const root = document.getElementById('root');
                const div = document.createElement('div');
                div.setAttribute('id', 'question');
                const p = document.createElement('p');
                p.classList.add('q-text')

                //画面表示の初期化：表示されている問題があれば削除する
                if (root.querySelector('#question') != null) {
                    root.removeChild(root.querySelector('#question'));
                }

                //問題文の配列からランダムに要素を取得
                const randomLenNum = Math.floor(Math.random() * question.length);
                const data = question[randomLenNum];

                //完了した問題配列が10件以上入っていないか確認
                if (endAnswer.length < 10) {
                    //表示した問題を、完了した問題配列にpushする
                    endAnswer.push(data);
                } else {
                    //問題終了後の処理
                    result();
                    return;
                }

                //問題の選択肢を生成
                const choiseBtns = document.createElement('div');
                choiseBtns.classList.add('choise-buttons')
                for (let i = 0; i < 3; i++) {
                    const button = document.createElement('button');
                    const choise = document.createTextNode(data.choise[i]);
                    button.setAttribute('data-value', i);
                    button.classList.add('qButton');
                    button.appendChild(choise);
                    choiseBtns.appendChild(button);
                }

                //出題された問題を配列から削除
                question.splice(randomLenNum, 1);
                //問題を表示
                const text = document.createTextNode('第' + endAnswer.length + '問：' + data.message);
                p.appendChild(text);
                div.appendChild(p);
                div.appendChild(choiseBtns);
                root.appendChild(div);

                //解答ボタンを押した際の処理
                decision();
            }

            //解答ボタンを押した際の処理
            function decision() {
                const qButton = document.getElementById('root').querySelectorAll('.qButton');
                const q = document.getElementById('root').querySelector('#question');
                for (let i = 0; i < qButton.length; i++) {
                    qButton[i].addEventListener('click', (e) => {
                        const attr = e.target.getAttribute('data-value');
                        yourAnswer.push(attr);
                        q.parentNode.removeChild(q);

                        //次の問題を表示
                        dispQuestion();
                    })
                }
            };

            //問題終了後の処理
            function result() {
                //解答と正答を比較して得点をつける
                let points = 0;
                for (let i = 0; i < 10; i++) {
                    const yours = Number(yourAnswer[i]);
                    const ends = Number(endAnswer[i].answer);
                    if (yours === ends) {
                        points = points + 10;
                    } else {
                        ;
                    }
                }
                //得点を表示する
                const root = document.getElementById('root');
                const div = document.createElement('div');
                div.setAttribute('id', 'points');
                const p = document.createElement('p');
                let innerText;
                if (points <= 50) {
                    innerText = 'あなたの点数は' + points + '点でした。<br>もう少し頑張りましょう。';
                } else if (points <= 70) {
                    innerText = 'あなたの点数は' + points + '点でした。<br>普通ですね。';
                } else if (points <= 90) {
                    innerText = 'あなたの点数は' + points + '点でした。<br>惜しい！あと少し！';
                } else if (points <= 100) {
                    innerText = 'あなたの点数は' + points + '点でした。<br>素晴らしい！';
                }
                p.innerHTML = innerText;
                div.appendChild(p);
                div.appendChild(startBtn);
                root.appendChild(div);
                //ローカルストレージに点数データを保存する
                localStorage.setItem('previousPoints', points);
                //問題履歴を表示
                history();
            }

            //問題履歴を表示
            function history() {
                const points = document.getElementById('points');
                const ul = document.createElement('ul');
                ul.classList.add('history__list')
                for (let i = 0; i < 10; i++) {
                    const li = document.createElement('li');
                    li.classList.add('history__list-item');
                    const endQuestion = endAnswer[i].message;
                    const yours = Number(yourAnswer[i]);
                    const ends = Number(endAnswer[i].answer);
                    let text, style;
                    if (yours === ends) {
                        text = '○';
                        style = 'green';
                    } else {
                        text = '×';
                        style = 'red';
                        li.classList.add('bad');
                    }
                    const correctAnswer = endAnswer[i].choise[ends];
                    const meAnswer = endAnswer[i].choise[yours];

                    const pQuestion = document.createElement('p');
                    pQuestion.classList.add('history__question');
                    const pCorrect = document.createElement('p');
                    pCorrect.classList.add('history__correct');
                    const pAnswer = document.createElement('p');
                    pAnswer.classList.add('history__answer');
                    const spanText = document.createElement('span');

                    pQuestion.innerHTML = '第' + (i + 1) + '問：' + endQuestion;
                    pCorrect.innerHTML = 'A: ' + correctAnswer;
                    spanText.style.color = style;
                    spanText.innerHTML = text;
                    pAnswer.appendChild(spanText);
                    const meText = document.createTextNode('あなたの解答は「' + meAnswer + '」でした');
                    pAnswer.appendChild(meText);

                    li.appendChild(pQuestion);
                    li.appendChild(pCorrect);
                    li.appendChild(pAnswer);
                    ul.appendChild(li);
                }
                points.appendChild(ul);
            }
        });
}());
