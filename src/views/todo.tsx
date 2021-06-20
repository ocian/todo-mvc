import Title from 'Src/components/title'
import CheckboxGroup from 'Src/components/checkbox_group'
import { useEffect, useState } from 'react'
import styles from './todo.module.scss'
import { getList } from 'Src/mocks/todos'
import Checkbox from 'Src/components/checkbox'
import Content from 'Src/components/content'

interface ListItem {
  [key: string]: { id: number; checked: boolean; content: string }
}

export default function ViewTodo() {
  const [list, setList] = useState<ListItem>(() => ({}))
  // const [initing, setIniting] = useState<boolean>(() => true)

  function changeChecked(id: string) {
    const current = list[id]
    setList({ ...list, [id]: { ...current, checked: !current.checked } })
  }
  function changeContent(id, newContent: string) {
    const current = list[id]
    setList({ ...list, [id]: { ...current, content: newContent } })
  }
  function delTodo(id) {
    const _list = {}
    for (let key in list) {
      if ({}.hasOwnProperty.call(list, key)) {
        if (id !== key) _list[key] = { ...list[key] }
      }
    }
    setList(_list)
  }

  async function fetchList() {
    const list = await getList()
    setList(list)
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className={styles.page}>
      <Title>todos</Title>
      <div className={styles.list}>
        {!Object.entries(list).length && (
          <div className={styles.no_data}>no data</div>
        )}
        <CheckboxGroup>
          {Object.entries(list).map(([id, item]) => (
            <Checkbox
              key={id}
              id={id}
              checked={item.checked}
              label={
                <Content
                  text={item.content}
                  onChange={(newContent: string) =>
                    changeContent(id, newContent)
                  }
                  disabled={item.checked}
                />
              }
              onChange={() => changeChecked(id)}
              onRemove={() => delTodo(id)}
            />
          ))}
        </CheckboxGroup>
      </div>
    </div>
  )
}
