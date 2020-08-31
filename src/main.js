"use strict";
// Получаем app
const app = document.getElementById("app");
// Создаем таблицу

const table = document.createElement("table");
app.appendChild(table);
// Изменяем переменную data для сортировки


// Получаем данные и передаем их в переменную data
const xhr = new XMLHttpRequest();
xhr.open('GET', 'src/default.json', false);
xhr.send();
let data = JSON.parse(xhr.responseText);

//перерисовка таблицы
const rerenderTable = (newData, parent) => {
    const tbody = document.querySelector("tbody");
    tbody.remove();
    createBodyTable(newData, parent)
};

// Фильтрация по клику на кнопку "isActive"
const filterIsActive = () => {
    const select = document.getElementById("isActive");
    select.addEventListener("change", () => {
        switch (select.value) {
            case `true`: {
                const newData = data.filter(el => el.isActive === true);
                rerenderTable(newData, table);
                break;
            }
            case `false`: {
                const newData = data.filter(el => el.isActive === false);
                rerenderTable(newData, table);
                break;
            }
            default:
                rerenderTable(data, table);
        }
    })
};

// Находим дочерний элемент родителя
const searchChild = (parent) => {
    const child = data.filter(el => parent.id === el.parentId);
    return child;


};

// Создаем дочерний элемент
const createChild = (keys, values, parent) => {
    let isOpen = false;
    parent.addEventListener("click", () => {
        let childArr = searchChild(values);
        if (childArr.length === 0) {
            if (!isOpen) {
                isOpen = true;
                const trn = document.createElement("tr");
                trn.classList.add("tr__no-children--open");
                trn.innerHTML = "-";
                parent.insertAdjacentElement("afterEnd", trn);

            } else {
                isOpen = false;
                document.querySelectorAll('.tr__no-children--open').forEach(e => e.remove());
            }
        } else {
            if (!isOpen) {
                isOpen = true;

                childArr.forEach(child => {
                    const trn = document.createElement("tr");
                    trn.classList.add("tr__children--open");
                    keys.forEach(key => {
                        const td = document.createElement("td");
                        td.innerHTML = child[key];
                        trn.appendChild(td)
                    });
                    parent.insertAdjacentElement("afterEnd", trn);
                })
            } else {
                isOpen = false;
                document.querySelectorAll('.tr__children--open').forEach(e => e.remove());
            }
        }

    });
};

// Создаем оглавление таблицы по ключам и создаем кнопку по ключу "isActive"
const createHeader = (dataElementKeys, parent) => {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const fragment = document.createDocumentFragment();
    dataElementKeys.forEach(key => {
        let th = document.createElement("th");
        th.innerHTML = key;
        if (key === "isActive") {
            th = document.createElement("th");

            const select = document.createElement("select");
            select.id = "isActive";

            const optionIsActive = document.createElement("option");
            const optionFalse = document.createElement("option");
            const optionTrue = document.createElement("option");

            optionIsActive.innerHTML = "isActive";
            optionTrue.innerHTML = true;
            optionFalse.innerHTML = false;

            select.appendChild(optionIsActive);
            select.appendChild(optionTrue);
            select.appendChild(optionFalse);
            th.appendChild(select)
        }
        fragment.appendChild(th)
    });
    tr.appendChild(fragment);
    thead.appendChild(tr);
    parent.appendChild(thead);
};

// Создаем тело таблицы
const createBodyTable = (newData, parent) => {
    const tbody = document.createElement("tbody");
    newData.forEach(values => {
        const tr = document.createElement("tr");
        const fragment = document.createDocumentFragment();
        const keys = Object.keys(data[0]);
        keys.forEach(key => {
            const td = document.createElement("td");
            td.innerHTML = values[key];
            fragment.appendChild(td);
        });
        createChild(keys, values, tr);

        tr.appendChild(fragment);
        tbody.appendChild(tr);
        parent.appendChild(tbody);
    })
};


// вызов таблицы
createHeader(Object.keys(data[0]), table);
createBodyTable(data, table);

filterIsActive();

