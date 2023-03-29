import { redirect } from '@remix-run/node'

export const loader = () => {
  return redirect('/tag/all')
}

export default function Index() {}
