/**
 * save data into localStorage
 * id       [number]
 * checked  [boolean]
 * content  [string]
 * deleteAt [number | null]
 * createAt [number]
 */

interface ListItem {
  id: number
  checked: boolean
  content: string
  deleteAt?: number | null
  createAt?: number
}
interface ListItemParamed {
  id: number
  checked?: boolean
  content?: string
}
interface KeyList {
  [key: number]: { id: number; checked: boolean; content: string }
}

function getList(): ListItem[] {
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
const getIndex = (id: number) => {
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

const getListTodo: () => Promise<KeyList> = () => {
  const list = getList()
    .filter(({ deleteAt }) => !deleteAt)
    .map(({ id, checked, content }) => ({
      [id]: { id, checked, content },
    }))
    .reduce((l, r) => ({ ...l, ...r }), {})
  return Promise.resolve(list)
}

const addTodo: (params: { content: string }) => Promise<{ id: number }> = (
  params
) => {
  const list = getList()
  const id = list.length
  const todo = { checked: false, content: params.content, id, deleteAt: null }
  list.push(todo)
  setList(list)
  return Promise.resolve({ id })
}

const updateTodo: (params: ListItemParamed) => Promise<{ message?: string }> = (
  params
) => {
  const list = getList()
  const todo = getTodo({ id: params.id })
  if (!todo) return Promise.reject({ message: 'Id matchs no data!' })

  if (params.checked !== undefined) todo.checked = params.checked
  if (params.content !== undefined) todo.content = params.content
  const index = getIndex(params.id)
  list[index] = todo
  setList(list)
  return Promise.resolve({})
}

const updateTodos: (
  params: ListItemParamed[]
) => Promise<{ idsError: number[] }> = (params) => {
  const list = getList()
  const idsError: number[] = []
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
  if (idsError.length < params.length) return Promise.resolve({ idsError })
  else {
    // all failed
    return Promise.reject({ idsError })
  }
}

const deleteTodo: (params: { id: number }) => Promise<{ message?: string }> = (
  params
) => {
  const list = getList()
  const todo = getTodo({ id: params.id })
  if (!todo) return Promise.reject({ message: 'Id matchs no data!' })
  todo.deleteAt = Date.now()
  const index = getIndex(params.id)
  list[index] = todo
  setList(list)
  return Promise.resolve({})
}

export default { getListTodo, addTodo, updateTodo, updateTodos, deleteTodo }
