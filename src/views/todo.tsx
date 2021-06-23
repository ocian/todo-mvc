import Title from 'Src/components/title'
import CheckboxGroup from 'Src/components/checkbox_group'
import React, { useEffect, useState } from 'react'
import styles from './todo.module.scss'
import {
  deleteTodo,
  getListTodo,
  updateTodo,
  addTodo,
  updateTodos,
} from 'Src/mocks/todos'
import Checkbox from 'Src/components/checkbox'
import Content from 'Src/components/content'
import clsx from 'clsx'

interface ListItem {
  [key: string]: { id?: number; checked?: boolean; content: string }
}

export default function ViewTodo() {
  const [list, setList] = useState<ListItem>({})
  const [selections, setSelections] = useState<number[]>([])
  const [checkedAll, setCheckedAll] = useState<boolean>(false)
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
    setList({ ...list, [id]: todo })
    updateTodo({ id, content })
  }
  function createTodo(params: { content: string }) {
    const { content } = params
    const todo = { checked: false, content }
    addTodo({ content }).then(({ code, result }) => {
      const { id } = result
      setList({ ...list, [id]: todo })
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
    deleteTodo({ id: params.id })
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
    updateTodos(
      [].concat(
        addeds.map((id) => ({ id, checked: true })),
        removeds.map((id) => ({ id, checked: false }))
      )
    )
  }

  function toggleSelectAll() {
    if (selections.length < Object.keys(list).length) {
      setSelections(Object.keys(list).map((id) => +id))
    } else {
      setSelections([])
    }
  }

  async function fetchList() {
    const { code, result } = await getListTodo()
    if (code === 1) {
      setData(result)
    } else {
      console.log('get list failed')
    }
  }
  async function clearDone() {
    if (!selections.length) return
    const _selections = selections.concat()
    Promise.all(_selections.map((id) => deleteTodo({ id }))).then(() => {
      setSelections([])
      const _list = {}
      for (let id in list) {
        if (list.hasOwnProperty(id) && !_selections.includes(+id)) {
          _list[id] = list[id]
        }
      }
      setList(_list)
    })
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
