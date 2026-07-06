
// 既存の同名要素があれば削除（重複防止）
const old = document.getElementById('ts-robust-container');
if (old) old.remove();

const container = document.createElement('div');
container.id = 'ts-robust-container';
// バッジの中に説明を入れる
container.innerHTML = `<div id="ts-main-badge">Tokens: 0 <span style="font-size:9px; opacity:0.8; margin-left:5px;">(Click to Save)</span></div>`;
document.body.appendChild(container);

function estimateToken(text) {
    if (!text) return 0;
    const latin = text.match(/[\x00-\x7F]/g) || [];
    const nonLatin = text.match(/[^\x00-\x7F]/g) || [];
    return Math.ceil(latin.length / 3.8 + nonLatin.length * 1.3);
}

function compress(text) {
    let res = text.normalize('NFKC');
    res = res.replace(/(お疲れ様です|お世話になっております|よろしくお願いします|お願いいたします)[。、！]*/g, '');
    res = res.replace(/を確認してください/g, 'を確認せよ').replace(/だと思います/g, 'だ');
    res = res.replace(/[ 　]+/g, ' ').replace(/\n\s*\n/g, '\n');
    return res.trim();
}

// バッジをクリックした時に節約を実行
container.addEventListener('click', () => {
    const selectors = ['#prompt-textarea', '[contenteditable="true"]', 'textarea', '.ProseMirror', '.exabase-input'];
    let target = document.activeElement;
    
    // 入力エリアを再検索
    let found = false;
    const allPossible = document.querySelectorAll(selectors.join(','));
    
    // 最も文字が入っている、または表示されている要素を探す
    let bestTarget = null;
    allPossible.forEach(el => {
        if (el.getBoundingClientRect().height > 0) {
            bestTarget = el;
        }
    });
    
    const finalTarget = (target && (target.tagName === 'TEXTAREA' || target.isContentEditable)) ? target : bestTarget;

    if (finalTarget) {
        let original = finalTarget.tagName === 'TEXTAREA' ? finalTarget.value : finalTarget.innerText;
        let result = compress(original);
        
        if (finalTarget.tagName === 'TEXTAREA') {
            finalTarget.value = result;
        } else {
            finalTarget.innerText = result;
        }
        finalTarget.dispatchEvent(new Event('input', { bubbles: true }));
        
        // 成功通知（一瞬バッジを光らせる）
        container.style.transform = 'scale(1.2)';
        setTimeout(() => container.style.transform = 'scale(1)', 200);
    }
});

function update() {
    const selectors = ['#prompt-textarea', '[contenteditable="true"]', 'textarea', '.ProseMirror'];
    let text = "";
    document.querySelectorAll(selectors.join(',')).forEach(el => {
        if (el.getBoundingClientRect().height > 0) {
            text = el.innerText || el.value || "";
        }
    });
    
    const count = estimateToken(text.trim());
    const badge = document.getElementById('ts-main-badge');
    if (badge) {
        badge.childNodes[0].nodeValue = `Tokens: ${count} `;
        container.style.background = count > 1000 ? '#ef4444' : '#10b981';
    }
}

setInterval(update, 1000);
