import Title from '../components/title'
import CheckboxGroup from '../components/checkbox_group'
import React, { useEffect, useState } from 'react'
import styles from './todo.module.scss'
import storageTodo from '../storage/todo'
import Checkbox from '../components/checkbox'
import Content from '../components/content'
import clsx from 'clsx'

interface ListItem {
  [key: number]: { content: string }
}

export default function ViewTodo() {
  const [list, setList] = useState<ListItem>({})
  const [selections, setSelections] = useState<number[]>([])
  const [input, setInput] = useState<string>('')

  // get data from apis, and use it into state
  function setData(todoList: ListItem) {
    const _list = {}
    for (let id in todoList) {
      if (todoList.hasOwnProperty(id)) {
        const todo = todoList[id]
        _list[id] = { content: todo.content }
      }
    }
    setList(_list)

    const _selectons = Object.entries(todoList)
      .filter(([id, todo]) => todo.checked)
      .map(([id]) => +id)
    setSelections(_selectons)
  }
  function changeContent(params: { id: number; content: string }) {
    const { id, content } = params
    if (list[id].content === content) return
    const todo = { content }
    const prevTodo = { content: list[id].content }
    setList({ ...list, [id]: todo })
    storageTodo.updateTodo({ id, content }).catch(() => {
      setList((prevList) => ({ ...prevList, [id]: prevTodo }))
    })
  }
  function createTodo(params: { content: string }) {
    if (!params.content.trim()) return
    const { content } = params
    const todo = { checked: false, content }
    storageTodo
      .addTodo({ content })
      .then(({ id }) => {
        setList((prevList) => ({ ...prevList, [id]: todo }))
      })
      .catch(() => {
        console.log('create failed')
      })
  }
  function removeTodo(params: { id: number }) {
    const _list = {}
    for (let id in list) {
      if (list.hasOwnProperty(id) && +id !== params.id) {
        _list[id] = list[id]
      }
    }
    setList(_list)
    const todoDeleted = list[params.id]
    storageTodo.deleteTodo({ id: params.id }).catch(() => {
      setList((prevList) => ({ ...prevList, [params.id]: todoDeleted }))
    })
  }

  function changeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value)
  }
  function pressKeyEnter(event: React.KeyboardEvent) {
    if (event.key !== 'Enter') return
    const _input = input
    setInput('')
    createTodo({ content: _input })
  }
  function changeSelections(newIds: number[]) {
    const allIds = Array.from(new Set([].concat(newIds, selections)))
    const addeds = []
    const removeds = []
    allIds.map((id) => {
      newIds.includes(id) && !selections.includes(id) && addeds.push(id)
      !newIds.includes(id) && selections.includes(id) && removeds.push(id)
    })
    setSelections(newIds)
    storageTodo
      .updateTodos(
        [].concat(
          addeds.map((id) => ({ id, checked: true })),
          removeds.map((id) => ({ id, checked: false }))
        )
      )
      .then(syncSelections)
      .catch(syncSelections)

    function syncSelections({ idsError }: { idsError: number[] }) {
      setSelections((prevSelections) => {
        const addsError = []
        const removesError = []
        idsError.forEach((id) => {
          if (addeds.includes(id)) addsError.push(id)
          else removesError.push(id)
        })
        return prevSelections
          .filter((id) => !addsError.includes(id))
          .concat(removesError)
      })
    }
  }

  function toggleSelectAll() {
    let ids: number[] = []
    if (selections.length < Object.keys(list).length) {
      ids = Object.keys(list).map((id) => +id)
    }
    setSelections(ids)
    changeSelections(ids)
  }

  async function fetchList() {
    const result = await storageTodo.getListTodo()
    setData(result || [])
  }
  async function clearDone() {
    if (!selections.length) return
    const _selections = selections.concat()
    const todosDeleted = {}
    setSelections([])
    setList((list) => {
      const _list = {}
      for (let id in list) {
        if (!_selections.includes(+id)) _list[id] = list[id]
        else todosDeleted[id] = list[id]
      }
      return _list
    })
    storageTodo.deleteTodos({ ids: _selections }).then(syncIds).catch(syncIds)

    function syncIds({ idsError }: { idsError: number[] }) {
      const listIdError = {}
      idsError.forEach((id) => {
        listIdError[id] = todosDeleted[id]
      })
      setSelections(idsError)
      setList((prevList) => ({ ...prevList, ...listIdError }))
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className={styles.page}>
      <Title>todos</Title>
      <div className={styles.line_input}>
        <div
          className={clsx('icon-check', {
            checked:
              Object.keys(list).length > 0 &&
              selections.length === Object.keys(list).length,
            uncheck:
              Object.keys(list).length === 0 ||
              selections.length < Object.keys(list).length,
          })}
          onClick={toggleSelectAll}
        ></div>
        <input
          type="text"
          className={styles.input}
          placeholder="What needs to be done?"
          value={input}
          onChange={changeInput}
          onKeyPress={pressKeyEnter}
        />
      </div>
      <div className={styles.list}>
        {!Object.entries(list).length && (
          <div className={styles.no_data}>no data</div>
        )}
        <CheckboxGroup
          selections={selections}
          onChange={changeSelections}
          clearChecked={clearDone}
        >
          {Object.entries(list).map(([id, item]) => (
            <Checkbox
              key={id}
              id={+id}
              checked={item.checked}
              label={
                <Content
                  text={item.content}
                  onChange={(newContent: string) =>
                    changeContent({ id: +id, content: newContent })
                  }
                  disabled={selections.includes(+id)}
                />
              }
              onRemove={() => removeTodo({ id: +id })}
            />
          ))}
        </CheckboxGroup>
      </div>
    </div>
  )
}
