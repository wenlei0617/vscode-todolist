(() => {

  type IState = {
    finish: boolean;
    text: string;
    id: string;
  }

  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const state: IState[] = vscode.getState()?.todo || [];

  const listContainer = document.querySelector('#list');
  const addBtn = document.querySelector('#add');
  const input = document.querySelector('#input') as HTMLInputElement;

  state.map((n) => {
    listContainer?.appendChild(createTodo(n.text, n.finish, n.id));
  })

  addBtn?.addEventListener('click', addTodo);

  function addTodo() {
    if (input.value) {
      const li = createTodo(input.value);
      listContainer?.appendChild(li);
      state.push({
        finish: false,
        text: input.value,
        id: li.id
      });
      vscode.setState({ todo: state });
      input.value = '';
    }
  }

  function createTodo(text: string, isFinish: boolean = false, id: string = '') {
    const li = document.createElement('li');
    const btnCtn = document.createElement('div');
    const removeBtn = document.createElement('button');
    const finishBtn = document.createElement('button');
    const txt = document.createElement('span');

    txt.innerText = text;
    removeBtn.innerText = '删除';
    removeBtn.addEventListener('click', () => removeTodo(li))

    if (!isFinish) {
      finishBtn.innerText = '完成';
      finishBtn.addEventListener('click', () => finishTodo(li));
    } else {
      li.className = 'finish'
    }
    btnCtn.appendChild(removeBtn);
    !isFinish && btnCtn.appendChild(finishBtn);

    li.appendChild(txt);
    li.appendChild(btnCtn);
    li.id = id || randomStr();

    return li;
  }

  function removeTodo(node: HTMLLIElement) {
    listContainer?.removeChild(node);
    const index = state.findIndex(n => n.id === node.id);
    if (index > -1) {
      state.splice(index, 1);
      vscode.setState({ todo: state });
    }
  }

  function finishTodo(node: HTMLLIElement) {
    node.className = 'finish';
    const btnCtn = node.querySelector('div') as HTMLDivElement;
    btnCtn.removeChild(btnCtn.querySelectorAll('button')[1] as HTMLButtonElement);
    vscode.postMessage({ type: 'finishMessage' });
    const index = state.findIndex(n => n.id === node.id);
    if (index > -1) {
      state[index].finish = true;
      vscode.setState({ todo: state });
    }
  }

  function randomStr() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
})()