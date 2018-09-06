import Model from './model';
import View from './view';

export default class {
    constructor(apiVk) {
        this.apiVk = apiVk;
        this.model = new Model(apiVk);
        this.view = new View();
        this.init();
        this.localStorage = {
            leftList: {
                items: []
            },
            rightList: {
                items: []
            }
        }
    }

    init() {
        this.user();
        this.friends();
        this.dnd().setSelector('#friends__list_0');
      
        document.querySelector('#out')
            .addEventListener('click', () => {
                this.apiVk.remoke(() => {
                    alert('МЫ вышли!');
                })
            });
        
        document.querySelector('#save')
            .addEventListener('click', () => {
                localStorage.setItem('friends', JSON.stringify(this.localStorage));
                console.log(this.localStorage); 
            });
        
        window.addEventListener('storage', () => {
            load.click(); // загружаем локал сторедж в соседние вкладки
        });

        document.querySelector('#friends__list_0')
            .addEventListener('click', (e) => {
                if (e.target.tagName == 'BUTTON') {
                    let leftList = document.querySelector('#friends__list_1');
                    leftList.appendChild(e.target.parentNode.parentNode);
                    // console.log(e.target.parentNode.parentNode);
                    let id = e.target.parentNode.dataset.id;
                    // console.log(id);
                    this.appendData(id, 'leftList', 'rightList');
                 }
            });

        document.querySelector('#friends__list_1')
            .addEventListener('click', (e) => {
                if (e.target.tagName == 'BUTTON') {
                    let rightList = document.querySelector('#friends__list_0');
                    rightList.appendChild(e.target.parentNode.parentNode);
                    console.log(e.target.parentNode.parentNode);
                    let id = e.target.parentNode.dataset.id;
                    this.appendData(id, 'rightList', 'leftList');

                }
            })
        
        document.querySelector('#search_1')
            .addEventListener('keyup', (e) => {
                let leftList = document.querySelector('#friends__list_0');
                let list = leftList.children;
                this.filter(e.target.value, list);

            });

        document.querySelector('#search_2')
            .addEventListener('keyup', (e) => {
                let leftList = document.querySelector('#friends__list_1');
                let list = leftList.children;
                this.filter(e.target.value, list);
            });
    }

    filter(chunk, list) {
        // console.log(chunk, list);
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const listn = item.querySelector('.friend__name').textContent;

            if (listn.toUpperCase().includes(chunk.toUpperCase())) {
                list[i].style.display = "block";    
            } else {
                list[i].style.display = "none"; 
            }
            
        }
    }

    async user() {
        const [user] = await this.model.user;

        document.querySelector('#user')
            .innerHTML = this.view.render('user', user);
    }

    async friends() {
       try {
        const friends = await this.model.friends
        
           let myLocalData = localStorage.getItem('friends');
           let parcefriends = JSON.parse(myLocalData);
           console.log(parcefriends, 'parcefriends');

           if (!parcefriends) {
               this.localStorage.leftList.items = friends.items;
           } else {
               let data = friends.items;
               let listSecondFriend = parcefriends.rightList.items;
               let secondListFriends = this.localStorage.rightList.items;
               let firstListFriends = this.localStorage.leftList.items;
               
               outer: for (let i = 0, length = data.length; i < length; i++) {
                   let friendId = data[i].id;

                   for (let j = 0; j < listSecondFriend.length; j++) {
                       let listFriendId = listSecondFriend[j].id;

                       if (listFriendId == friendId) {
                           secondListFriends.push(listSecondFriend[j]);
                           continue outer;
                       }
                   }
                   firstListFriends.push(data[i]);
               }
           }
        // console.log(friends.items)
        // console.log(this)
        
        

        document.querySelector('#friends__list_0')
            .innerHTML = this.view.render('item', this.localStorage.leftList);
        document.querySelector('#friends__list_1')
               .innerHTML = this.view.render('item', this.localStorage.rightList);
       } catch (error) {
           
       }
    }

    appendData(id, input, output) {
        let inputList = this.localStorage[input].items;
        let outputList = this.localStorage[output].items;
        console.log(inputList);
        inputList.forEach((friend, i) => {
            if (friend.id == id) {
                console.log(friend, 'friend appendData')
                outputList.push(friend);
                inputList.splice(i, 1); // удаление
            } 
        });
            
        

    }


    dnd() {
    let list,
        dragObj = {},
        handlers = {
            handlerMouseDown: event => {
                if (event.target.tagName == 'BUTTON' || event.which != 1) return;

                const element = event.target.closest('.friends__item');

                if (!element) return;

                dragObj.element = element;

                document.addEventListener('mousemove', handlers.handlerMouseMove);
            },
            handlerMouseMove: event => {
                if (!dragObj.element) return;

                dragObj.item = _createItem();

                dragObj.item.style.position = 'absolute';
                dragObj.item.style.zIndex = 9999;
                dragObj.item.style.left = event.pageX - dragObj.item.offsetWidth / 2 + 'px';
                dragObj.item.style.top = event.pageY - dragObj.item.offsetHeight / 2 + 'px';
            },
            handlerMouseUp: event => {
                let elem,
                    list;

                if (!dragObj.item) return;

                dragObj.item.hidden = true;
                elem = document.elementFromPoint(event.clientX, event.clientY);
                console.log(elem);
                dragObj.item.hidden = false;
                list = elem.closest('#friends__list_1');

                if (list) {
                    dragObj.item.rollback();
                    list.appendChild(dragObj.item);
                    let id = dragObj.item.firstElementChild.dataset.id;
                    console.log(id, dragObj.item);
                    this.appendData(id, 'leftList', 'rightList');
                } else {
                    dragObj.item.rollback();
                }

                document.removeEventListener('mousemove', handlers.handlerMouseMove);
                dragObj = {};
            }
        };

    const addListeners = () => {
        list.addEventListener('mousedown', handlers.handlerMouseDown);
        document.addEventListener('mouseup', handlers.handlerMouseUp);
        
    }

    const _createItem = () => {
        let item = dragObj.element,
            old = {
                position: item.position || '',
                left: item.left || '',
                top: item.top || '',
                zIndex: item.zIndex || ''
            };

        item.rollback = function () {
            item.style.position = old.position;
            item.style.left = old.left;
            item.style.top = old.top;
            item.style.zIndex = old.zIndex
        };

        return item;
    }

    return {
        setSelector: (selector) => {
            list = document.querySelector(selector);
            addListeners();
        }
    }

}
}