import { LoaderArgs, defer } from '@remix-run/node'
import { Await, Link } from '@remix-run/react'
import { getPosts, getPostsByTag } from '~/db'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { DateTime } from 'luxon'

export function headers() {
  return {
    'Cache-Control':
      's-max-age=2592000, stale-while-revalidate=86400, stale-if-error=604800'
  }
}

export const loader = async ({ params }: LoaderArgs) => {
  const tag = params.id ?? 'all'
  const posts = tag === 'all' ? getPosts : getPostsByTag(tag)

  return defer({
    posts
  })
}

const PostSkeleton = () => {
  return (
    <div className='w-full border-b border-b-gray-200 p-10 lg:p-16'>
      <div className='flex items-center mb-6'>
        <span className='w-8 h-8 mr-5 bg-gray-100 rounded-full block' />
        <span className='mr-5 bg-gray-100 rounded-sm h-2 w-20 block' />
        <span className='w-10 h-3 px-3 rounded-full bg-gray-100 block' />
      </div>

      <span className='w-full max-w-md h-8 bg-gray-100 mb-3 block rounded-full' />

      <div className='w-full max-w-2xl mt-2'>
        {Array.from({ length: 3 }).map((_, i) => {
          return (
            <span
              key={i}
              className='w-full h-3 bg-gray-100 rounded-md mb-3 block'
            />
          )
        })}
      </div>
    </div>
  )
}

export default function DynamicTagPage() {
  const { posts } = useLoaderData<typeof loader>()

  return (
    <>
      <div className='border-b border-b-gray-200 p-10 lg:p-16 bg-gradient-to-r from-white via-[#FCF0FF] to-cornflower/10'>
        <h1 className='font-extrabold text-2xl lg:text-3xl mb-2 text-midnight'>
          Latest Updates
        </h1>

        <p className='md:text-lg font-light mb-3'>
          The latest Pioneer Writings news, straight from the team.
        </p>
      </div>

      <Suspense
        fallback={Array.from({ length: 3 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}>
        <Await resolve={posts} errorElement={<p>Something broke</p>}>
          {({ posts }) => {
            return posts.map(
              ({ id, title, excerpt, publishedAt, tag, author, slug }) => {
                const date = DateTime.fromJSDate(new Date(publishedAt))
                const published = date.toLocaleString(DateTime.DATE_FULL)

                return (
                  <Link to={`/post/${slug}`} key={id} prefetch='intent'>
                    <div className='w-full border-b border-b-gray-200 p-10 lg:p-16 cursor-pointer'>
                      <div className='flex items-center mb-6'>
                        <img
                          className='w-8 h-8 rounded-full mr-5'
                          src={author?.picture?.url}
                          alt="The author's avatar"
                        />
                        <span className='mr-5 text-ash text-sm'>
                          {published}
                        </span>

                        <span className='border border-cornflower px-3 flex items-center justify-center rounded-full text-cornflower capitalize text-sm'>
                          {tag?.text}
                        </span>
                      </div>

                      <h1 className='font-bold text-lg text-midnight'>
                        {title}
                      </h1>
                      <p className='font-light max-w-xl mt-2 text-slate-600'>
                        {excerpt}
                      </p>
                    </div>
                  </Link>
                )
              }
            )
          }}
        </Await>
      </Suspense>
    </>
  )
}
