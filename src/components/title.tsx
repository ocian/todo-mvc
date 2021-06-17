import { PropsWithChildren } from 'react'
import styles from './title.module.scss'

interface TitleProps {}

export default function Title(props: PropsWithChildren<TitleProps>) {
  return <div className={styles.title}>{props.children}</div>
}
