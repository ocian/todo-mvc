import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

interface ContentProps {
  text: string
  onChange: (newText: string) => void
  disabled?: boolean
}

export default function Content(props: ContentProps) {
  const [input, setInput] = useState<string>(() => '')
  const [editing, setEditing] = useState<boolean>(() => false)
  const refInput = useRef<HTMLInputElement>()

  function clickDouble() {
    if (props.disabled || typeof props.onChange !== 'function') return
    setInput(props.text)
    setEditing(true)
  }
  function changeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value)
  }
  function finishInput() {
    props.onChange(input)
    setEditing(false)
  }
  function pressKeyEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') finishInput()
  }

  useEffect(() => {
    if (editing) {
      refInput.current && refInput.current.focus()
    }
  }, [editing, refInput])

  return (
    <div
      className={clsx(styles.content, {
        [styles.disabled]: props.disabled,
        [styles.enabled]: !props.disabled,
      })}
    >
      {!editing && (
        <span onDoubleClick={clickDouble} className={styles.text}>
          {props.text}
        </span>
      )}
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
  )
}
