const list = document.getElementById("book-list");
const addBtn = document.getElementById("add-row");
const category = document.getElementById("category");

const bookFields = document.getElementById("book-fields");
const partFields = document.getElementById("part-fields");

// ジャンル切り替え
category.onchange = () => {
    if (category.value === "book") {
        bookFields.style.display = "block";
        partFields.style.display = "none";
    } else {
        bookFields.style.display = "none";
        partFields.style.display = "block";
    }
};

// データ読み込み
function loadItems() {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    list.innerHTML = "";

    items.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "book-card";

        if (item.category === "book") {
            card.innerHTML = `
                <p><strong>ジャンル:</strong> 本</p>
                <p><strong>日時:</strong> ${item.date}</p>
                <p><strong>タイトル:</strong> ${item.title}</p>
                <p><strong>出版社:</strong> ${item.publisher}</p>
                <p><strong>著者:</strong> ${item.author}</p>
                <button class="delete-btn" onclick="deleteItem(${index})">削除</button>
            `;
        } else {
            card.innerHTML = `
                <p><strong>ジャンル:</strong> 部品</p>
                <p><strong>部品名:</strong> ${item.partName}</p>
                <p><strong>型番:</strong> ${item.partModel}</p>
                <button class="delete-btn" onclick="deleteItem(${index})">削除</button>
            `;
        }

        list.appendChild(card);
    });
}

// 削除
function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    loadItems();
}

// 追加
addBtn.onclick = () => {
    const items = JSON.parse(localStorage.getItem("items") || "[]");

    if (category.value === "book") {
        const date = document.getElementById("date").value;
        const title = document.getElementById("title").value;
        const publisher = document.getElementById("publisher").value;
        const author = document.getElementById("author").value;

        if (!title) return alert("タイトルは必須です");

        items.push({
            category: "book",
            date, title, publisher, author
        });

    } else {
        const partName = document.getElementById("part-name").value;
        const partModel = document.getElementById("part-model").value;

        if (!partName) return alert("部品名は必須です");

        items.push({
            category: "part",
            partName,
            partModel
        });
    }

    localStorage.setItem("items", JSON.stringify(items));
    loadItems();
};

// 初期読み込み
loadItems();
