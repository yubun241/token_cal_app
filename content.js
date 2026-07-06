
const badge = document.createElement('div');
badge.id = 'token-counter-badge';
badge.innerText = 'Tokens: 0';
document.body.appendChild(badge);

// トークン推定ロジック (GPT-4o/Claude3系の多言語モデルを意識)
function estimateTokenCount(text) {
    if (!text) return 0;
    const latin = text.match(/[\x00-\x7F]/g) || [];
    const nonLatin = text.match(/[^\x00-\x7F]/g) || [];
    // 日本語は1文字 1.2〜1.5トークン、英字は約4文字で1トークン
    return Math.ceil(latin.length / 3.8 + nonLatin.length * 1.3);
}

function updateCounter() {
    // 主要AIサービスの入力欄を網羅するセレクタ
    const selectors = [
        '#prompt-textarea',           // ChatGPT
        '[contenteditable="true"]',    // Claude / ChatGPT
        'textarea',                    // Gemini / ExaBase
        '.ProseMirror',                // Claude / Notion系
        '.exabase-input'               // ExaBase想定
    ];
    
    let text = "";
    for (let s of selectors) {
        const el = document.querySelector(s);
        if (el && el.getBoundingClientRect().height > 0) {
            text = el.innerText || el.value || "";
            if (text.trim().length > 0) break;
        }
    }

    const count = estimateTokenCount(text.trim());
    badge.innerText = `Tokens: ${count}`;
    
    // トークン量に応じた色の変化（節約への意識付け）
    if (count > 2000) {
        badge.style.backgroundColor = '#ef4444'; // 赤（非常に多い）
    } else if (count > 800) {
        badge.style.backgroundColor = '#f59e0b'; // オレンジ（注意）
    } else {
        badge.style.backgroundColor = '#10b981'; // 緑（エコ）
    }
}

// 入力時やクリック時に更新
document.addEventListener('keyup', updateCounter);
document.addEventListener('mouseup', updateCounter);
setInterval(updateCounter, 1000);
