import { PropsWithChildren } from 'react'
import styles from './index.module.scss'

interface TodoGroupProps {}

export default function TodoGroup(props: PropsWithChildren<TodoGroupProps>) {
  return <div className={styles.todo_group}>{props.children}</div>
}
