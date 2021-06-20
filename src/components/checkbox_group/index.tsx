import { PropsWithChildren } from 'react'
import styles from './index.module.scss'

interface CheckboxGroupProps {}

export default function CheckboxGroup(
  props: PropsWithChildren<CheckboxGroupProps>
) {
  return <div className={styles.todo_group}>{props.children}</div>
}
