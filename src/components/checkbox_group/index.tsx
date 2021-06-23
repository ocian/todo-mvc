import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  useState,
} from 'react'
import styles from './index.module.scss'

interface CheckboxGroupProps {
  selections: number[]
  onChange: (newSelections: number[]) => void
  clearChecked?: () => void
}

export default function CheckboxGroup(
  props: PropsWithChildren<CheckboxGroupProps>
) {
  const [status, setStatus] = useState<'all' | 'checked' | 'uncheck'>(
    () => 'all'
  )

  const wrappedChildren = Children.map(props.children, (child) => {
    if (!isValidElement(child)) return null
    const { id } = child.props

    const shown =
      status === 'all'
        ? true
        : (status === 'checked' && props.selections.includes(id)) ||
          (status === 'uncheck' && !props.selections.includes(id))
    if (!shown) return null

    const checked = props.selections.includes(id)
    const onChange = () => {
      const ids = props.selections.includes(id)
        ? props.selections.filter((item) => item !== id)
        : props.selections.concat(id)
      props.onChange(ids)
    }
    return cloneElement(child, { checked, onChange })
  })

  return (
    <div className={styles.todo_group}>
      <span>{wrappedChildren}</span>
      <div>
        left: {Children.count(props.children) - props.selections.length}
        <button onClick={() => setStatus('all')}>all</button>
        <button onClick={() => setStatus('checked')}>checked</button>
        <button onClick={() => setStatus('uncheck')}>uncheck</button>
        {typeof props.clearChecked === 'function' && (
          <button onClick={props.clearChecked}>clear completed</button>
        )}
      </div>
    </div>
  )
}
