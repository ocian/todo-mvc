// const list = Array.from({ length: 12 }).map((_: undefined, index: number) => ({
//   id: index + 1,
//   checked: getChecked(),
//   content: getContent(),
//   deleteAt: null,
// }))

function getList() {
  const list = localStorage.getItem('todos')
  try {
    if (list) return JSON.parse(list)
    else return []
  } catch (e) {
    return []
  }
}
function setList(list) {
  localStorage.setItem('todos', JSON.stringify(list))
}

const getTodo = (params: { id: number }) => {
  const todo = getList().filter(
    (item) => item.id === params.id && item.deleteAt === null
  )[0]
  if (!todo) return false
  return todo
}

export const getListTodo = () => {
  const _list = getList()
    .filter(({ deleteAt }) => !deleteAt)
    .map(({ id, checked, content }) => ({
      [id]: { id, checked, content },
    }))
    .reduce((l, r) => ({ ...l, ...r }), {})
  return {
    code: 1,
    result: _list,
  }
}

export const addTodo: (params: {
  content: string
}) => Promise<{ code: number; result: { id: number } }> = (params) => {
  const list = getList()
  const id = list.length
  const todo = {
    checked: false,
    content: params.content,
    id,
    deleteAt: null,
  }
  list.push(todo)
  setList(list)
  return Promise.resolve({
    code: 1,
    result: { id },
  })
}

export const updateTodo = (params: {
  id: number
  checked?: boolean
  content?: string
}) => {
  const list = getList()
  const todo = getTodo({ id: params.id })
  if (!todo) return Promise.resolve({ code: -1, msg: 'Id matchs no data!' })

  if (params.checked) todo.checked = params.checked
  if (params.content) todo.content = params.content
  const index = getIndex(params.id)
  list[index] = todo
  setList(list)
  return Promise.resolve({ code: 1, result: true })
}

export const updateTodos = (
  params: {
    id: number
    checked?: boolean
    content?: string
  }[]
) => {
  const list = getList()
  const idsError = []
  params.map((param) => {
    const todo = getTodo({ id: param.id })
    if (!todo) {
      idsError.push(param.id)
      return
    }
    if (param.checked !== undefined) todo.checked = param.checked
    if (param.content !== undefined) todo.content = param.content
    const index = getIndex(param.id)
    list[index] = todo
  })
  setList(list)
  if (idsError.length < params.length)
    return Promise.resolve({ code: 1, result: { idsError } })
  else {
    return Promise.resolve({ code: -1, result: { idsError } })
  }
}

export const deleteTodo: (params: {
  id: number
}) => Promise<{ code: number; result?: true; msg?: string }> = (params) => {
  const list = getList()
  const todo = getTodo({ id: params.id })
  if (!todo) return Promise.resolve({ code: -1, msg: 'Id matchs no data!' })
  todo.deleteAt = Date.now()
  const index = getIndex(params.id)
  list[index] = todo
  setList(list)
  return Promise.resolve({ code: 1, result: true })
}

function getChecked() {
  return Math.random() > 0.5 ? true : false
}
function getContent() {
  return Math.floor(Math.random() * 1e16) + ''
}
function getIndex(id: number) {
  const list = getList()
  let index = 0
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].id === id) {
      index = i
      break
    }
  }
  return index
}
