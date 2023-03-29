import { Suspense, useMemo } from 'react'
import { MetaFunction, LinksFunction, LoaderArgs, defer } from '@remix-run/node'

import {
  LiveReload,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Await,
  Link,
  useLocation
} from '@remix-run/react'

import { Show } from '~/components'
import { getTags } from './db'

import clsx from 'clsx'
import tailwind from './tailwind.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Blog — Pioneer Writings',
  viewport: 'width=device-width,initial-scale=1,user-scalable=yes'
})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwind }
]

export function headers() {
  return {
    'Cache-Control':
      's-max-age=2592000, stale-while-revalidate=86400, stale-if-error=604800'
  }
}

export const loader = async ({}: LoaderArgs) => {
  return defer({
    tags: getTags
  })
}

const TagSkeleton = () => {
  return (
    <div className='flex flex-col mx-auto'>
      {Array.from({ length: 7 }).map((_, i) => {
        return (
          <span
            key={i}
            className='w-20 h-6 block rounded-full bg-gray-100 mb-4 last:mb-0'
          />
        )
      })}
    </div>
  )
}

export default function App() {
  const { tags } = useLoaderData<typeof loader>()
  const { pathname } = useLocation()

  const activeTagClasses = useMemo(() => {
    return (path: string) => {
      const isActive = pathname.toLowerCase().includes(path)

      return clsx(
        'text-xl py-3 px-6 cursor-pointer hover:bg-gray-50 rounded-full capitalize',
        {
          'font-bold bg-gray-50': isActive
        }
      )
    }
  }, [pathname])

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
        <link rel='preconnect' href='https://rsms.me/' />
        <link rel='stylesheet' href='https://rsms.me/inter/inter.css' />
      </head>
      <body>
        <div className='app flex items-center container mx-auto'>
          <aside className='sidebar hidden w-full lg:flex lg:w-1/4 h-screen border-x border-r-gray-200 lg:flex-col'>
            <div className='h-16 mb-8 flex justify-center pt-5'>
              <img src='/img/logo.svg' aria-hidden alt='' />
            </div>

            <Show when={pathname.includes('/tag')}>
              <Suspense fallback={<TagSkeleton />}>
                <Await resolve={tags} errorElement={<p>Something broke</p>}>
                  {({ tags }) => {
                    return (
                      <ul className='mx-auto'>
                        <Link to={`/tag/all`} prefetch='intent'>
                          <li className={activeTagClasses('all')}>all</li>
                        </Link>

                        {tags.map(({ text }, i) => {
                          return (
                            <Link
                              to={`/tag/${text}`}
                              key={`${text}-${i}`}
                              prefetch='intent'>
                              <li className={activeTagClasses(text!)}>
                                {text}
                              </li>
                            </Link>
                          )
                        })}
                      </ul>
                    )
                  }}
                </Await>
              </Suspense>
            </Show>
          </aside>

          <main className='content w-full lg:w-3/4 h-screen sm:border-x lg:border-l-0 lg:border-r-gray-200 lg:overflow-y-scroll'>
            <header className='w-full h-16 pr-8 pl-10 lg:pl-16 py-2 border-b border-b-gray-200 flex items-center justify-between'>
              <Show when={pathname.includes('tag')}>
                <div className='logo flex items-center lg:hidden'>
                  <img src='/img/logomark.svg' aria-hidden alt='' />
                </div>
              </Show>

              <Show
                when={pathname.includes('post')}
                fallback={<div className='bg-transparent' />}>
                <Link
                  className='text-ash text-sm flex items-center'
                  to='/tag/all'
                  prefetch='intent'>
                  <img
                    className='mr-3'
                    src='/img/back-arrow.svg'
                    aria-hidden
                    alt=''
                  />{' '}
                  Back to Posts
                </Link>
              </Show>

              <a
                href='https://search-remix.vercel.app/'
                rel='no-referrer'
                target='_blank'
                className='flex items-center justify-end'>
                Home <img className='ml-3' src='/img/external.svg' />
              </a>
            </header>
            <Outlet />
          </main>
        </div>
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  )
}
