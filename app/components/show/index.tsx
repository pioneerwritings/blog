import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  when: boolean
  fallback?: JSX.Element
}

export const Show = ({ when, children, fallback }: Props) => {
  return <>{when ? children : fallback ? fallback : null}</>
}
