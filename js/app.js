/*
1. Глобальные константы (html элементы)
======================================================
*/
const page = document.querySelector('.page');
const body = document.querySelector('body');
const pathsContainer = document.querySelector('.todo__header__menu');
const addNewPathBtn = document.querySelector('.todo__header__cross');

const addTaskBtn = document.querySelector('#addTaskBtn');
const addTaskInput = document.querySelector('#addTaskInput');
const todoContainer = document.querySelector('.todo__tasklist');
const allTasks = document.querySelector('#allTasks');

const modal = document.querySelector('#modal');
const modalInput = document.querySelector('.modal__inner_input');
const modalClose = document.querySelector('.modal__inner_cross');
const modalButton = document.querySelector('.modal__inner_button');

const menu = document.querySelector('.menu');

const allTasksPath = `<li class="active" id="allTasks">
        <span>Все задачи</span>
    </li>`;

const dayInMiliseconds = 1000 * 60 * 60 * 24;
let todayDate = new Date().toISOString().slice(0, 10);
let todayDateMiliseconds = Date.parse(todayDate);
let weekFromTodayInMiliseconds = todayDateMiliseconds + 7 * dayInMiliseconds;

/*
2. Служебные серверные функции
======================================================
*/
//LOCAL STORAGE IMPORT EXPORT FUNCTIONS
const importPathsFromLocal = function () {
    console.log('importPathsFromLocal run');
    paths = JSON.parse(localStorage.getItem('paths'));
};

//Импортирует объект todo из локального хранилища
const importTodoFromLocal = function () {
    console.log('importTodoFromLocal run');
    todo = JSON.parse(localStorage.getItem('todo'));
};

//Импортирует объект все из локального хранилища
const importLocal = () => {
    console.log('importLocal run');
    paths = JSON.parse(localStorage.getItem('paths'));
    todo = JSON.parse(localStorage.getItem('todo'));
};

//Экспортирует данные в локальное хранилище
const updateLocal = () => {
    localStorage.setItem('paths', JSON.stringify(paths));
    localStorage.setItem('todo', JSON.stringify(todo));
};

/*
3. Различные служебные функции
======================================================
*/
//Функция, которая устанавливает path, к которому принедлежит данное todo
function setTodoPathName() {
    console.log('setTodoPathName run');
    let listName = findActivePath().querySelector('span').textContent;
    if (listName === 'Все задачи') {
        listName = 'Без списка';
    }
    return listName;
}

//Переключает активный класс path при переходе из адной path в другой
const toggleActiveClassList = (path) => {
    console.log('toggleActiveClassList is running');

    if (findActivePath() == null) {
        switchOnAllTasksPath();
    } else {
        findActivePath().classList.toggle('active');
        path.classList.toggle('active');
    }
};

const toggleActiveMenuPoint = function (newActive) {
    const activeMenuPoint = menu.querySelector('.active');
    activeMenuPoint.classList.toggle('active');
    newActive.classList.toggle('active');
};

//Обновляет список задач в текущем окне
const refreshTodoList = function (arr) {
    console.log('refreshTodoList run');
    todoContainer.innerHTML = '';
    createTodoList(arr);
};

//Создает ID
function createId() {
    return String(Math.floor(Math.random() * 1000000000));
}

//Просто включает active на allTasks
const switchOnAllTasksPath = function () {
    const active = findActivePath();
    const allTasks = pathsContainer.querySelector('#allTasks');
    console.log('switchOnAllTasksPath is running');
    allTasks.className = 'active';
    active.classList.toggle('active');
};

//Открывает/закрывает всплывающее окно
const togglePopupWindow = function () {
    console.log('togglePopupWindow run');
    page.classList.toggle('noscroll');
    modal.classList.toggle('show');
};

/*
4. Фильтры, поиск и обработчики
======================================================
*/
//Находит активную в настоящий момент path
const findActivePath = function () {
    console.log('findActivePath run');
    console.log('active path = ' + pathsContainer.querySelector('.active'));
    return pathsContainer.querySelector('.active');
};

//Находит индекс по ID
function findIndexById(id, arr) {
    console.log('findIndexById run');
    return arr.findIndex((el) => el.id === id);
}
//Ищет индекс по ID Дом, в котором содержится 'id***' (плюс переводит id дом в id объекта)
function findIndexByDomId(id, arr) {
    console.log('findIndexByDomId run');
    return arr.findIndex((el) => 'id' + el.id === id);
}

//Сортировка todo листа по умолчанию
const sortTodoListByDefault = function () {
    console.log('sortTodoListByDefault run');
    const parse = function (a) {
        return Date.parse(a);
    };
    todo = todo.sort(function (a, b) {
        if (parse(a.deadline) == parse(b.deadline)) {
            if (Date.parse(a.deadline) > Date.parse(a.deadline)) {
                return 1;
            }
            if (a.todoName > b.todoName) {
                return 1;
            }
            if (a.todoName < b.todoName) {
                return -1;
            }
            return 0;
        }
        if (b.deadline == 'Без даты') {
            return -1;
        }
        if (parse(a.deadline) > parse(b.deadline)) {
            return 1;
        }
        if (parse(a.deadline) < parse(b.deadline)) {
            return -1;
        }
    });
    updateLocal();
    return todo;
};

const sortTodoListByDefaultNew = function () {
    let result = todo.sort(function (a, b) {
        if (a.deadline === b.deadline) {
            return a.todoName > b.todoName;
        } else {
            if (Date.parse(a.deadline) == NaN) {
                return 1;
            } else {
                return Date.parse(a.deadline) > Date.parse(b.deadline);
            }
        }
    });
    updateLocal();
    return todo;
};

//Обновляет все todo удаленного path, устанавливает им listName без списка
const updateTodoDeletedPath = function (delPathName) {
    todo.forEach(function (el, ind, arr) {
        if ((el['listName'] = delPathName)) {
            el['listName'] = 'Без списка';
        }
    });
};

//Универсальный фильтр любого объекта по любому ключу и значние
const filterArrByObjValue = (arr, key, val) => {
    return arr.filter((el) => el[key] == val);
};

//Фильтрует todo лист по значению и создает новый todoList
const filterAndCreateTodoList = (arr, key, val) => {
    sortTodoListByDefault();
    const arrFiltered = filterArrByObjValue(arr, key, val);
    createTodoList(arrFiltered);
};
//Фильтрует массив по значению сегодняшней даты
function filterIfToday(arr) {
    let today = new Date().toISOString().slice(0, 10);
    let newArr = arr.filter((el) => el.deadline != 'Без даты');
    newArr = newArr.filter(
        (el) =>
            new Date(el['deadline']).toISOString().slice(0, 10) <=
            new Date(today).toISOString().slice(0, 10)
    );
    return newArr;
}

//Фильтрует массив по диапозону дат (даты передаются в милисекундах)
function filterTimePeriod(arr, start, end) {
    console.log(start);
    console.log(end);
    return arr.filter(function (el) {
        return (
            Date.parse(new Date(el.deadline)) >= start && Date.parse(new Date(el.deadline)) <= end
        );
    });
}

//Фильтрует массив на ближайшую неделю
function filterNextWeek(arr) {
    return filterTimePeriod(arr, todayDateMiliseconds, weekFromTodayInMiliseconds);
}

/*
5. Конструкторы объектов и элеменетов
======================================================
*/

//Конструктор todo
function Todo(todoName, deadline, listName) {
    this.id = createId();
    this.todoName = todoName;
    this.deadline = deadline;
    this.listName = listName;
    this.listId = '';
    this.plannedDate = '';
    this.completed = false;
}

//HTML template TODO
function todoTemplate(newTask) {
    return `<div class="todo__tasklist__box" id="id${newTask.id}">
        <div>
            <input class="todo__tasklist__box_checkbox" type="checkbox" />
            <div id='todoPathAndNameDiv'>

            </div>
        </div>
        <div id='todoDateAndCrossPath'>
            
            <a class="todo__tasklist__box_cross" href="">
                <div></div>
                <div></div>
            </a>
        </div>
    </div>`;
    /*<a id='todoPathName'href="">${newTask.listName}</a>*/
    /*<a href="">
                    <h3>${newTask.todoName}</h3>
                </a>*/
    /*<a class="todo__tasklist__box_date" href="">
                ${newTask.deadline}
            </a>*/
}

//Создает одно todo в HTML
function createTodoBox(obj) {
    todoContainer.insertAdjacentHTML('beforeend', todoTemplate(obj));
    const id = `#id${obj.id}`;
    const todoBox = document.querySelector(id);
    const cross = todoBox.querySelector('.todo__tasklist__box_cross');
    const chBox = todoBox.querySelector('.todo__tasklist__box_checkbox');
    const todoPathName = todoBox.querySelector('#todoPathName');
    const divForNameAndPathName = todoBox.querySelector('#todoPathAndNameDiv');
    const divForDateAndCross = todoBox.querySelector('#todoDateAndCrossPath');

    createPathLinkInTodoBox(divForNameAndPathName, obj);
    createTodoNameLinkInTodoBox(divForNameAndPathName, obj);
    createDateLinkInTodoBox(divForDateAndCross, obj);

    if (obj.completed) {
        todoBox.classList.toggle('todocompleted');
        chBox.checked = 'On';
    }
    cross.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        deleteTodo(obj, todoBox);
    });

    chBox.addEventListener('change', (event) => {
        event.stopPropagation();
        toggleTodoCompeted(event, todoBox);
        sortTodoListByDefault();
    });
}

const createTodoNameLinkInTodoBox = function (div, obj) {
    const todoName = document.createElement('a');
    const h3 = document.createElement('h3');
    h3.textContent = obj.todoName;
    todoName.id = 'todoName';
    todoName.appendChild(h3);
    div.prepend(todoName);
    todoName.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const input = document.createElement('input');
        const inputDiv = document.createElement('div');
        inputDiv.style.diplay = 'block';
        input.setAttribute('value', `${obj.todoName}`);
        todoName.parentNode.removeChild(todoName);
        input.id = 'inputTodoName';
        input.style.textDecoration = 'none';
        input.style.display = 'inline-block';
        inputDiv.prepend(input);
        div.prepend(inputDiv);
        input.focus();
        input.setSelectionRange(0, obj.todoName.length);

        input.addEventListener('keydown', (event) => {
            if (event.keyCode === 13) {
                if (input.value == '') {
                    createTodoNameLinkInTodoBox(div, obj);
                } else {
                    const ind = paths.findIndex((el) => el.id == obj.id);
                    obj.todoName = input.value;
                    paths[ind] = obj;
                    createTodoNameLinkInTodoBox(div, obj);
                }
                input.parentNode.removeChild(input);
                updateLocal();
            }
        });
    });
};

//Создает название path в todo со ссылкой
function createPathLinkInTodoBox(div, obj) {
    //const az = `<a id='todoPathName'href="">${obj.listName}</a>`;
    console.log('createPathLinkInTodoBox(div, obj) run');
    const a = document.createElement('a');
    a.id = 'todoPathName';
    a.textContent = obj.listName;
    div.append(a);
    const indexOfTodo = todo.indexOf(obj);
    a.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const parent = a.parentNode;
        a.parentNode.removeChild(a);
        const select = document.createElement('select');
        parent.appendChild(select);
        createPathsOptionList(select);
        select.addEventListener('input', (event) => {
            event.preventDefault();
            event.stopPropagation();
            todo[indexOfTodo]['listName'] = event.target.value;
            createPathLinkInTodoBox(div, obj);
            select.parentNode.removeChild(select);
            findActivePath();
            filterAndCreateTodoList(todo, 'listName', findActivePath().textContent);
            updateLocal();
        });
    });
}

// Создает выпадающий список для todo при клике на название path
function createPathsOptionList(select) {
    console.log('createPathsOptionList started');
    const activeId = findActivePath().id;
    const optionAllTasks = document.createElement('option');
    optionAllTasks.textContent = 'Без списка';
    optionAllTasks.setAttribute('value', 'Без списка');
    optionAllTasks.id = 'AllTasks';
    select.appendChild(optionAllTasks);

    paths.forEach(function (el) {
        const option = document.createElement('option');
        option.textContent = el.listName;
        option.setAttribute('value', el.listName);
        option.id = 'id' + el.id;
        if (option.id == activeId) {
            option.setAttribute('selected', '');
        }

        select.appendChild(option);
    });
}

function createDateLinkInTodoBox(div, obj) {
    const date = document.createElement('a');
    const indexOfTodo = todo.indexOf(obj);
    date.className = 'todo__tasklist__box_date';
    if (obj.deadline == 'Без даты') {
        date.textContent = obj.deadline;
    } else {
        date.textContent = new Date(obj.deadline).toISOString().slice(0, 10);
    }

    div.prepend(date);

    date.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const dateInput = document.createElement('input');
        date.parentNode.removeChild(date);
        div.prepend(dateInput);
        dateInput.setAttribute('type', 'date');
        dateInput.addEventListener('input', (event) => {
            const deadline = new Date(event.target.value);
            todo[indexOfTodo]['deadline'] = deadline;
            dateInput.parentNode.removeChild(dateInput);
            createDateLinkInTodoBox(div, todo[indexOfTodo]);
            updateLocal();
        });
    });
}

//Удаляет todo
const deleteTodo = function (obj, todoBox) {
    const ind = findIndexById(obj.id, todo);
    todoBox.remove();
    todo.splice(ind, 1);
    updateLocal();
};

//Создает список todo
function createTodoList(arr) {
    sortTodoListByDefault();
    todoContainer.innerHTML = '';
    if (arr.length > 0) {
        arr.forEach((el, ind, arr) => {
            createTodoBox(el);
        });
    }
}

//Изменяет todo completed. Вызывается при нажатии на чекбокс todo
const toggleTodoCompeted = function (event, todoBox) {
    console.log('toggleTodoCompleted runs');
    todoBox.classList.toggle('todocompleted');
    const id = todoBox.id;
    const ind = findIndexByDomId(id, todo);

    if (event.target.checked) {
        todo[ind]['completed'] = true;
    } else {
        todo[ind]['completed'] = false;
    }
    updateLocal();
};

const createCurrentTodoList = function () {
    sortTodoListByDefault();
    const activeMenuPoint = menu.querySelector('.active');
    const menuId = activeMenuPoint.id;
    const activePath = findActivePath();
    console.log(activePath);
    const pathName = activePath.querySelector('span').textContent;
    const allTasks = 'Все задачи';
    let filteredTodo;

    if (pathName == allTasks) {
        filteredTodo = todo;
    } else {
        filteredTodo = filterArrByObjValue(todo, 'listName', pathName);
    }

    if (menuId == 'inbox') {
        filteredTodo = filterArrByObjValue(filteredTodo, 'completed', false);
    }
    if (menuId == 'today') {
        filteredTodo = filterArrByObjValue(filteredTodo, 'completed', false);
        filteredTodo = filterIfToday(filteredTodo);
    }

    if (menuId == 'thisWeek') {
        console.log(filteredTodo);
        filteredTodo = filterArrByObjValue(filteredTodo, 'completed', false);
        console.log(filteredTodo);
        filteredTodo = filterNextWeek(filteredTodo);
        console.log(filteredTodo);
    }
    if (menuId == 'someday') {
        filteredTodo = filterArrByObjValue(filteredTodo, 'completed', false);
        filteredTodo = filterTimePeriod(filteredTodo, weekFromTodayInMiliseconds, Infinity);
    }
    if (menuId == 'deleted') {
        filteredTodo = filterArrByObjValue(filteredTodo, 'completed', true);
    }
    if (menuId == 'overdue') {
        filteredTodo = filterArrByObjValue(filteredTodo, 'completed', false);
        filteredTodo = filterTimePeriod(
            filteredTodo,
            -Infinity,
            todayDateMiliseconds - dayInMiliseconds
        );
    }
    createTodoList(filteredTodo);

    //filteredTodo = filterArrByObjValue()
};

//СПИСКИ
//=====

//Создание списка paths из массива
const createPathsList = function (arr) {
    arr.forEach((el) => createPath(el));
};

//Конструктор списков
function TaskList(descrition) {
    this.listName = descrition;
    this.id = createId();
}

//Создание PATH в html
const createPath = function (obj) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.id = 'pathNameNode';
    const a = document.createElement('a');
    const div = document.createElement('div');
    li.id = 'id' + obj.id;
    span.textContent = obj.listName;
    li.appendChild(span);
    a.className = 'minusList';
    li.appendChild(a);
    a.appendChild(div);
    pathsContainer.appendChild(li);
    toggleActiveClassList(li);
    console.log('function createPath just runned toggleActiveClassList');
    createCurrentTodoList();
    //Make paths active by click
    li.addEventListener('click', (event) => {
        if (event.target == a) {
            return;
        }
        event.preventDefault();
        sortTodoListByDefault();
        toggleActiveClassList(li);
        createCurrentTodoList();
    });

    //Delete listItem pushing cross
    a.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const ind = findIndexByDomId(li.id, paths);
        updateTodoDeletedPath(paths[ind]['listName']);

        if (li.className == 'active') {
            console.log('deleting active path');
            switchOnAllTasksPath();
            createCurrentTodoList();
        }

        paths.splice(ind, 1);
        li.remove();
        updateLocal();
    });
};

//Создает объект + отображает новую path в html
const createAndPaintNewPath = function () {
    let path = new TaskList(modalInput.value);
    paths.push(path);
    createPath(path);
};

/*
6. Загружка HTML, задачи по дефолту
======================================================
*/

//Распаковка LocalStorage
let paths;
let todo;

!localStorage.paths ? (paths = []) : importPathsFromLocal();

!localStorage.todo ? (todo = []) : importTodoFromLocal();

//Распаковка прорисовка начально HTML
const setHtml = () => {
    pathsContainer.innerHTML = allTasksPath;
    const allTasks = document.querySelector('#allTasks');
    createPathsList(paths);
    console.log(allTasks);
    if (allTasks.className != 'active') {
        switchOnAllTasksPath();
    }
    createCurrentTodoList();

    //set event listener to allTasks
    allTasks.addEventListener('click', (event) => {
        event.preventDefault();
        if (allTasks.className !== 'active') {
            toggleActiveClassList(allTasks);
        }
        createCurrentTodoList();
    });
};

setHtml();

/*
7. Default EventListeners
======================================================
*/

//События меню
menu.addEventListener('click', (event) => {
    event.preventDefault();
    const inbox = menu.querySelector('#inbox');
    const today = menu.querySelector('#today');
    const thisWeek = menu.querySelector('#thisWeek');
    const someday = menu.querySelector('#someday');
    const deleted = menu.querySelector('#deleted');
    const overdue = menu.querySelector('#overdue');
    const id = event.target.id;

    if (id == 'inbox') {
        toggleActiveMenuPoint(inbox);
        createCurrentTodoList();
    }
    if (id == 'today') {
        toggleActiveMenuPoint(today);
        createCurrentTodoList();
    }
    if (id == 'thisWeek') {
        toggleActiveMenuPoint(thisWeek);
        createCurrentTodoList();
    }
    if (id == 'someday') {
        toggleActiveMenuPoint(someday);
        createCurrentTodoList();
    }
    if (id == 'deleted') {
        toggleActiveMenuPoint(deleted);
        createCurrentTodoList();
    }
    if (id == 'overdue') {
        toggleActiveMenuPoint(overdue);
        createCurrentTodoList();
    }
});

//Добавить новую задачу по нажатию enter
addTaskInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        if (addTaskInput.value == '') {
            return;
        }

        const newTask = new Todo(addTaskInput.value, 'Без даты', setTodoPathName()); //(!!!Доделать 2 значения)
        todo.push(newTask);
        createTodoBox(newTask);
        updateLocal();
        addTaskInput.value = '';
    }
});

//Добавить новую задачу по клику на кнопку
addTaskBtn.addEventListener('click', (event) => {
    if (addTaskInput.value == '') {
        return;
    }
    const newTask = new Todo(addTaskInput.value, 'Без даты', setTodoPathName()); //(!!!Доделать 2 значения)
    todo.push(newTask);
    createTodoBox(newTask);
    updateLocal();
    addTaskInput.value = '';
});

//Нажатие кнопки + (добавить новый path)
addNewPathBtn.addEventListener('click', (event) => {
    event.preventDefault();
    togglePopupWindow();
    refreshTodoList(todo);

    //Add PATH by enter
    modalInput.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
            if (modalInput.value == '') {
                return;
            }
            console.log('keydown listener just started');
            if (filterArrByObjValue(paths, 'listName', modalInput.value).length > 0) {
                alert('Список с именем "' + modalInput.value + '" уже есть');
                modalInput.value = '';
                return;
            }
            createAndPaintNewPath();
            modalInput.value = '';
            togglePopupWindow();
            updateLocal();
        }
    });

    //Add PATH by button
    modalButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (modalInput.value == '') {
            return;
        }
        createAndPaintNewPath();
        modalInput.value = '';
        togglePopupWindow();
        updateLocal();
    });

    //Закрытие модального окна
    modalClose.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.remove('show');
        page.classList.remove('noscroll');
    });
});
