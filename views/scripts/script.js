const input = document.querySelector('#inputText');
const todoList = document.querySelector('#todoList');
const doneList = document.querySelector('#doneList');
const formData = new FormData();
var updatedTasks = ['sample'];
// fas 

function addList(text) {
    const checkButton = document.createElement('i');
    checkButton.className = "far fa-check-square";
    const trashIcon = document.createElement('i');
    trashIcon.className = "far fa-trash-alt";

    let icons = document.createElement('div');
    icons.className = 'icons';
    icons.appendChild(checkButton);
    icons.appendChild(trashIcon);

    let p = document.createElement('p');
    p.innerHTML = text;

    let li = document.createElement('li');
    li.className = 'item';
    li.appendChild(p);
    li.appendChild(icons);

    todoList.appendChild(li);
    updatedTasks.push(text);
}

function addDoneList(text) {
    let li = document.createElement('li');
    li.innerHTML = text;
    doneList.appendChild(li);
}

input.addEventListener('keydown', e => {
    let newitem;
    if (e.code === 'Enter' && input.value != "") {
        newitem = input.value;
        // Add to li
        addList(newitem);
        input.value = "";
    }
});

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}


todoList.addEventListener('click', e => {
    if (e.target.className === 'far fa-check-square') {
        let clickedLi = e.target.parentNode.parentNode;
        // move to done list
        let text = clickedLi.querySelector('p').textContent;
        console.log(text);
        clickedLi.remove();
        addDoneList(text);
        removeItemOnce(updatedTasks, text);
    }
    else if (e.target.className === 'far fa-trash-alt') {
        let currentLi = e.target.parentNode.parentNode;
        currentLi.remove();
        // delete from the list
    }
});

let updateDB = setInterval(() => {
    console.log(updatedTasks);
    fetch('https://personalplanner.harshbhagat1.repl.co/submit', {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(updatedTasks),
    }).then(response => { response.json(); console.log(response) })

}, 2000);