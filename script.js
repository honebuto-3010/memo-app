const list = document.getElementById("book-list");
const addBtn = document.getElementById("add-row");
const category = document.getElementById("category");
const subcategorySelect = document.getElementById("subcategory");

const bookFields = document.getElementById("book-fields");
const partFields = document.getElementById("part-fields");

// ▼ サブカテゴリ一覧
const subcategories = {
    book: ["文庫", "新書", "専門書", "一般書", "雑誌"],
    part: ["家電", "ビス・ボルト", "家庭の消耗品", "その他"]
};

// ▼ サブカテゴリ生成（共通関数）
function updateSubcategories() {
    const selected = category.value;

    subcategorySelect.innerHTML = '<option value="">選択してください</option>';

    subcategories[selected].forEach(sc => {
        const option = document.createElement("option");
        option.value = sc;
        option.textContent = sc;
        subcategorySelect.appendChild(option);
    });
}

// ▼ ジャンル切り替え
category.onchange = () => {
    updateSubcategories();

    if (category.value === "book") {
        bookFields.style.display = "block";
        partFields.style.display = "none";
    } else {
        bookFields.style.display = "none";
        partFields.style.display = "block";
    }
};

// ▼ ページ読み込み時にもサブカテゴリをセット
window.addEventListener("DOMContentLoaded", () => {
    updateSubcategories();
});

// ▼ データ読み込み
function loadItems() {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    list.innerHTML = "";

    items.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "book-card";

        if (item.category === "book") {
            card.innerHTML = `
                <p><strong>ジャンル:</strong> 本</p>
                <p><strong>サブカテゴリ:</strong> ${item.subcategory}</p>
                <p><strong>日時:</strong> ${item.date}</p>
                <p><strong>タイトル:</strong> ${item.title}</p>
                <p><strong>出版社:</strong> ${item.publisher}</p>
                <p><strong>著者:</strong> ${item.author}</p>
                <button class="delete-btn" onclick="deleteItem(${index})">削除</button>
            `;
        } else {
            card.innerHTML = `
                <p><strong>ジャンル:</strong> 部品</p>
                <p><strong>サブカテゴリ:</strong> ${item.subcategory}</p>
                <p><strong>部品名:</strong> ${item.partName}</p>
                <p><strong>型番:</strong> ${item.partModel}</p>
                <button class="delete-btn" onclick="deleteItem(${index})">削除</button>
            `;
        }

        list.appendChild(card);
    });
}

// ▼ 削除
function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    loadItems();
}

// ▼ 追加
addBtn.onclick = () => {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    const subcategory = subcategorySelect.value;

    if (category.value === "book") {
        const date = document.getElementById("date").value;
        const title = document.getElementById("title").value;
        const publisher = document.getElementById("publisher").value;
        const author = document.getElementById("author").value;

        if (!title) return alert("タイトルは必須です");

        items.push({
            category: "book",
            subcategory,
            date,
            title,
            publisher,
            author
        });

    } else {
        const partName = document.getElementById("part-name").value;
        const partModel = document.getElementById("part-model").value;

        if (!partName) return alert("部品名は必須です");

        items.push({
            category: "part",
            subcategory,
            partName,
            partModel
        });
    }

    localStorage.setItem("items", JSON.stringify(items));
    loadItems();
};

const resetBtn = document.getElementById("reset-form");

resetBtn.onclick = () => {

    // ▼ 入力欄をクリア
    document.getElementById("date").value = "";
    document.getElementById("title").value = "";
    document.getElementById("publisher").value = "";
    document.getElementById("author").value = "";
    document.getElementById("part-name").value = "";
    document.getElementById("part-model").value = "";

    // ▼ ジャンルを初期化
    category.value = "book";

    // ▼ 表示切り替え
    bookFields.style.display = "block";
    partFields.style.display = "none";

    // ▼ サブカテゴリ再生成
    updateSubcategories();

    // ▼ ★ PWA描画バグ対策：強制リフロー
    bookFields.offsetHeight;  // ← これが超重要（高さを再計算させる）

    // ▼ ★ さらに1フレーム遅延して再描画
    requestAnimationFrame(() => {
        bookFields.style.display = "block";
    });
};


// ▼ 初期読み込み
loadItems();

