import styles from './index.module.scss'
import clsx from 'clsx'
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface TodoProps {
  content: string
  checked?: boolean
  onChangeChecked?: (newVal: boolean) => void
  onChangeContent?: (newVal: string) => void
  onDelete?: () => void
}

export default function Todo(props: TodoProps) {
  const [input, setInput] = useState<string>(() => '')
  const [editing, setEditing] = useState<boolean>(() => false)
  const refInput = useRef<HTMLInputElement>()

  const isDeleteable = useMemo(
    () => typeof props.onDelete === 'function',
    [props.onDelete]
  )

  function changeChecked() {
    if (typeof props.onChangeChecked !== 'function') return
    props.onChangeChecked(!props.checked)
  }
  function clickDouble() {
    if (editing || props.checked || typeof props.onChangeContent !== 'function')
      return
    setInput(props.content)
    setEditing(true)
  }
  function changeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value)
  }
  function finishInput() {
    // if (typeof props.onChangeContent !== 'function') return
    setEditing(false)
    props.onChangeContent(input)
  }
  function pressKeyEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') finishInput()
  }
  function del() {
    if (!isDeleteable) return
    props.onDelete()
  }

  useEffect(() => {
    if (editing) {
      refInput.current && refInput.current.focus()
    }
  }, [editing, refInput])

  return (
    <div className={styles.todo}>
      <div
        className={clsx(styles.check, {
          [styles.checked]: props.checked,
          [styles.uncheck]: !props.checked,
        })}
        onClick={changeChecked}
      />
      <div className={styles.content_wrapper}>
        <div
          className={clsx(styles.content, {
            [styles.checked]: props.checked,
            [styles.uncheck]: !props.checked,
          })}
        >
          {!editing && <span onDoubleClick={clickDouble}>{props.content}</span>}
          {editing && (
            <input
              className={styles.input_area}
              value={input}
              onChange={changeInput}
              onBlur={finishInput}
              onKeyPress={pressKeyEnter}
              ref={refInput}
            />
          )}
        </div>
        <div
          className={clsx(styles.icon_delete, {
            [styles.disabled]: !isDeleteable,
          })}
          onClick={del}
        />
      </div>
    </div>
  )
}
