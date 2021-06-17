declare module '*.module.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}
declare module '*.css'
declare module '*.scss'