import clsx from 'clsx'
import { useMemo } from 'react'
import styles from './index.module.scss'

interface CheckBoxProps {
  id: string
  label: React.ReactNode
  checked: boolean
  onChange: (newStatus: boolean) => void
  onRemove: () => void
}

export default function Checkbox(props: CheckBoxProps) {
  const isDeleteable = useMemo(
    () => typeof props.onRemove === 'function',
    [props.onRemove]
  )

  function changeChecked() {
    if (typeof props.onChange !== 'function') return
    props.onChange(!props.checked)
  }
  function del() {
    if (!isDeleteable) return
    props.onRemove()
  }

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
        {props.label}
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