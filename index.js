const api_url = 'http://localhost:3000'
const form__button = document.querySelector('.form__button')
const form__input = document.querySelector('.form__input')
const todos__wrapper = document.querySelector('.todos__wrapper');

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

form__button.addEventListener('click', () => {
    if (form__input.value) {
        addTodo({data: form__input.value})
        form__input.value = '';
    }
})

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

const state = { todos: [] };

(() => {
    getTodos();
})()

var observer = new Observer(state, "todos");

observer.Observe(updatedPosts => {
    if (todos__wrapper.hasChildNodes()) {
        todos__wrapper.innerHTML = '';
    }
    return updatedPosts.map(post => {
        const post__container = document.createElement('div');
        post__container.setAttribute('class', 'post__container');
        post__container.innerText = post.body;
        todos__wrapper.appendChild(post__container);
    })
});

