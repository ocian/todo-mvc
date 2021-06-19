const lists = Array.from({ length: 12 }).map((_: undefined, index: number) => ({
  id: index + 1,
  checked: getChecked(),
  content: getContent(),
}))

export const getList = () =>
  Promise.resolve(
    lists
      .map((item) => ({ [item.id]: item }))
      .reduce((l, r) => ({ ...l, ...r }), {})
  )

function getChecked() {
  return Math.random() > 0.5 ? true : false
}
function getContent() {
  return Math.floor(Math.random() * 1e16) + ''
}
