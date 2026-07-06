// トークン表示用の要素を作成
const badge = document.createElement('div');
badge.id = 'token-counter-badge';
badge.innerText = 'Tokens: 0';
document.body.appendChild(badge);

function estimateTokenCount(text) {
    if (!text) return 0;
    const latinCharacters = text.match(/[\x00-\x7F]/g) || [];
    const nonLatinCharacters = text.match(/[^\x00-\x7F]/g) || [];
    // 近似計算: 英数字は3.5文字で1、日本語は1文字で1.2〜2トークン程度
    return Math.ceil(latinCharacters.length / 3.5 + nonLatinCharacters.length * 1.2);
}

function updateCounter() {
    const editor = document.querySelector('#prompt-textarea');
    if (editor) {
        const text = editor.innerText || editor.value || "";
        const count = estimateTokenCount(text);
        badge.innerText = `Tokens: ${count}`;
        badge.style.backgroundColor = count > 1000 ? '#ef4444' : '#10b981';
    }
}
setInterval(updateCounter, 500);
