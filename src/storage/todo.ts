/**
 * save data into localStorage
 * id       [number]
 * checked  [boolean]
 * content  [string]
 * deleteAt [number | null]
 * createAt [number]
 */

import { timeoutStorage } from '../constant/index'

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
const getDelayPromise = (delay?: number) => {
  if (!delay && !timeoutStorage) return Promise.resolve()
  return new Promise((resolve) => {
    setTimeout(resolve, delay || timeoutStorage)
  })
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
  return getDelayPromise().then(() => ({ id }))
}

const updateTodo: (params: ListItemParamed) => Promise<{ message?: string }> = (
  params
) => {
  const list = getList()
  const todo = getTodo({ id: params.id })
  if (!todo) {
    return getDelayPromise().then(() =>
      Promise.reject({ message: 'Id matchs no data!' })
    )
  }

  if (params.checked !== undefined) todo.checked = params.checked
  if (params.content !== undefined) todo.content = params.content
  const index = getIndex(params.id)
  list[index] = todo
  setList(list)
  return getDelayPromise().then(() => ({}))
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
  if (idsError.length < params.length) {
    return getDelayPromise().then(() => ({ idsError }))
  } else {
    // all failed
    return getDelayPromise().then(() => ({ idsError }))
  }
}

const deleteTodo: (params: { id: number }) => Promise<{ message?: string }> = (
  params
) => {
  const list = getList()
  const todo = getTodo({ id: params.id })
  if (!todo)
    return getDelayPromise().then(() => ({ message: 'Id matchs no data!' }))
  todo.deleteAt = Date.now()
  const index = getIndex(params.id)
  list[index] = todo
  setList(list)
  return getDelayPromise().then(() => ({}))
}

const deleteTodos: (params: {
  ids: number[]
}) => Promise<{ idsError: number[] }> = (params) => {
  const list = getList()
  const idsError = []
  const { ids } = params
  ids.forEach((id) => {
    const todo = getTodo({ id })
    if (!todo) {
      idsError.push(id)
      return
    }
    todo.deleteAt = Date.now()
    const index = getIndex(id)
    list[index] = todo
  })
  setList(list)
  if (idsError.length < ids.length)
    return getDelayPromise().then(() => ({ idsError }))
  else return getDelayPromise().then(() => Promise.reject({ idsError }))
}

export default { getListTodo, addTodo, updateTodo, updateTodos, deleteTodo, deleteTodos }
