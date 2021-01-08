fetch('js/questions.json')
    .then(res => res.json())
    .then(data => {
        const question = data;

        let myAnswer = new Array();

        //ランダムに取得した要素を別の配列に並べるために、新しい配列を用意する（グローバルじゃなくてクロージャ？）
        let endArr = new Array();

        //初期表示に対して行う対応
        function init0(){
            const greet = document.getElementById('greet');
            let greetText;
            if (localStorage.getItem('previousPoints')) {
                greetText = 'あなたの前回の点数は' + localStorage.getItem('previousPoints') + '点でした。下のボタンを押して再チャレンジ！';
            } else {
                greetText = 'ようこそクイズルームへ！下のボタンを押してクイズにチャレンジしてみてください！';
            }
            const greetText2 = document.createTextNode(greetText);
            greet.appendChild(greetText2);
        }
        init0();

        //画面の初期化：スタートボタンを削除する
        const copy = document.getElementById('push');
        function init() {
            copy.addEventListener('click', () => {
                const root = document.getElementById('root')
                while (root) {
                    root.removeChild(root.children[0]);
                    if (!root.children[0]) {
                        break;
                    }
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
            if (root.querySelector('#question') != null) {
                root.removeChild(root.querySelector('#question'));
            }

            //question配列のlengthからランダムに数値を取得
            const randomLenNum = Math.floor(Math.random() * question.length);

            //question配列からランダムに要素を取得
            const data = question[randomLenNum];

            //選択肢を生成
            const chos = document.createElement('div');
            for (let i = 0; i < 3; i++) {
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

            const text = document.createTextNode('第' + endArr.length + '問：' +data.message);
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
            div.appendChild(copy);
            root.appendChild(div);

            //ローカルストレージに点数データを保存する
            localStorage.setItem('previousPoints', points);

            history();

            //PHPにデータを送る準備
            const postData = new FormData;
            postData.set('previousPoints', points);

            /*fetch('./test.php', {
                method: 'POST',
                body: postData
            })
                .then(res => res.text())
                .then(data => {
                    console.log();
                    //location.href = 'test.php'
                })
                .catch(console.error);*/
        }

        //問題履歴を表示
        function history() {
            const points = document.getElementById('points');
            const ul = document.createElement('ul');
            ul.classList.add('history__list')
            for (let i = 0; i < 10; i++){
                const endQuestion = endArr[i].message;
                const me = Number(myAnswer[i]);
                const you = Number(endArr[i].answer);
                let text, style;
                if (me === you) {
                    text = '○';
                    style = 'green';
                } else {
                    text = '×';
                    style = 'red';
                }
                const correctAnswer = endArr[i].choise[you];
                const meAnswer = endArr[i].choise[me];

                const li = document.createElement('li'); //liはブロックスコープによりfor文の外側から参照できない。
                li.classList.add('history__list-item');
                const pQuestion = document.createElement('p');
                pQuestion.classList.add('history__question');
                const pCorrect = document.createElement('p');
                pCorrect.classList.add('history__correct');
                const pAnswer = document.createElement('p');
                pAnswer.classList.add('history__answer');
                const spanText = document.createElement('span');

                pQuestion.innerHTML = '第'+(i+1)+'問：'+endQuestion;
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
