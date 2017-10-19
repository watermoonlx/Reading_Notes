let createTodoItem = (val: string) => {
    const result = <HTMLLIElement>document.createElement('LI')
    result.classList.add('list-group-item')
    const innerHTML = `
    ${val}
    <button type="button" class="btn btn-default button-remove" aria-label="right Align">
      <span class="glyphicon glyphicon-remove" aria-hidden="true">Delete</span>
    </button>
  `
    result.innerHTML = innerHTML
    return result
}

const $input = <HTMLInputElement>document.querySelector('.todo-val')
const $list = <HTMLUListElement>document.querySelector('.list-group')
const $add = document.querySelector('.button-add')

const enter$ = Rx.Observable.fromEvent<KeyboardEvent>($input, 'keydown')
    .filter(r => r.keyCode === 13);

const clickAdd$ = Rx.Observable.fromEvent<MouseEvent>($add, 'click');

const input$ = enter$.merge(clickAdd$);

const item$ = input$ 
    .map(() => $input.value)
    .filter(r => r !== '')
    .map(createTodoItem)
    .observeOn(Rx.Scheduler.asap)
    .do((ele: HTMLLIElement) => {
        $list.appendChild(ele)
        $input.value = ''
    });

const toggle$ = item$.flatMap($todoItem => {
    console.log('toggle:');
    console.log($todoItem);
    return Rx.Observable.fromEvent<MouseEvent>($todoItem, 'click')
        .filter(e => e.target === $todoItem)
        .mapTo($todoItem)
})
    .do(($todoItem: HTMLElement) => {
        if ($todoItem.classList.contains('done')) {
            $todoItem.classList.remove('done');
            console.log("Done!");
        } else {
            $todoItem.classList.add('done')
            console.log("Undone!");
        }
    });

const remove$ = item$.flatMap($todoItem => {
    console.log('InRemove:');
    console.log($todoItem);
    const $removeButton = $todoItem.querySelector('.button-remove');
    return Rx.Observable.fromEvent($removeButton, 'click')
        .mapTo($todoItem)
})
    .do(($todoItem: HTMLElement) => {
        // 从 DOM 上移掉 todo item
        const $parent = $todoItem.parentNode
        $parent.removeChild($todoItem)
    })

const app$ = toggle$.merge(remove$)
    .do(r => console.log(r))

app$.subscribe()


const range$ = Rx.Observable.range(1, 10);

range$.subscribe((n) => {
    console.log(n);
});

range$.subscribe((n) => {
    console.log(n);
});

console.log('done!');
