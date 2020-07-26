const api_url = 'http://localhost:3000';
const DOM__formButton = document.querySelector('.form__button');
const DOM__formInput = document.querySelector('.form__input');
const DOM__todosWrapper = document.querySelector('.todos__wrapper');

function Observer(o, property) {
    var _this = this;
    var value = o[property];
    this.observers = [];
    
    this.Observe = function (notifyCallback){
        _this.observers.push(notifyCallback);
    }

    Object.defineProperty(o, property, {
        set: function(val){
            console.log(1, o, property, val);
            _this.value = val;
            for(var i = 0; i < _this.observers.length; i++) _this.observers[i](val);
        },
        get: function(){
            console.log(2);
            return _this.value;
        }
    });
}

DOM__formButton.addEventListener('click', () => {
    if (DOM__formInput.value) {
        addTodo({data: DOM__formInput.value})
        DOM__formInput.value = '';
    }
})

function postHTMLCreator({_id, body}) {
    const postContainer = document.createElement('div');
    postContainer.setAttribute('class', 'post__container');

    const postContent = document.createElement('div');
    postContent.setAttribute('class', 'post__content');
    postContent.innerText = body;

    const postDeleteButton = document.createElement('button');
    postDeleteButton.setAttribute('class', 'post__button');
    postDeleteButton.setAttribute('class', 'post__delete-button');
    postDeleteButton.addEventListener('click', () => deleteTodo(_id));
    postDeleteButton.innerText = 'delete';

    postContainer.appendChild(postContent);
    postContainer.appendChild(postDeleteButton);
    return DOM__todosWrapper.appendChild(postContainer);  
}

function getTodos() {
    fetch(`${api_url}/todos`)
    .then(response => response.json())
    .then(todos => {
        state.todos = todos;
    })
    .catch(e => console.log(e))
}

async function addTodo({data}) {
    try {
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data}),
          };
        await fetch(`${api_url}/todo`, options);
        await getTodos();   
    } catch (error) {
        throw new Error(error)
    }
}

async function deleteTodo(_id) {
    try {
        const options = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
          };
        await fetch(`${api_url}/todo/${_id}`, options);
        await getTodos();   
    } catch (error) {
        throw new Error(error)
    }
}

const state = { todos: [] };

(() => {
    getTodos();
})()

var observer = new Observer(state, "todos");

observer.Observe(updatedPosts => {
    if (DOM__todosWrapper.hasChildNodes()) {
        DOM__todosWrapper.innerHTML = '';
    }
    return updatedPosts.map(post => {
        const createdPost = postHTMLCreator(post);
        DOM__todosWrapper.appendChild(createdPost);
    })
});

