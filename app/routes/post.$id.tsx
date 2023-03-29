import { LoaderArgs, defer } from '@remix-run/node'
import { Await } from '@remix-run/react'
import { getPostBySlug } from '~/db'
import { useLoaderData, Link } from '@remix-run/react'
import { Suspense } from 'react'
import { DateTime } from 'luxon'

export const loader = async ({ params }: LoaderArgs) => {
  return defer({
    post: getPostBySlug(params.id!)
  })
}

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>()

  return (
    <Suspense>
      <Await resolve={post}>
        {({ post }) => {
          const date = DateTime.fromJSDate(new Date(post.publishedAt))
          const published = date.toLocaleString(DateTime.DATE_FULL)

          return (
            <div className='p-10 lg:p-16'>
              <div className='flex items-center mb-6'>
                <img
                  className='w-8 h-8 rounded-full mr-5'
                  src={post.author?.picture?.url}
                  alt="The author's avatar"
                />
                <span className='mr-5 text-ash text-sm'>{published}</span>

                <Link to={`/tag/${post.tag?.text}`}>
                  <span className='border border-cornflower px-3 flex items-center justify-center rounded-full text-cornflower capitalize text-sm'>
                    {post.tag?.text}
                  </span>
                </Link>
              </div>

              <h1 className='font-extrabold text-3xl lg:text-4xl text-midnight max-w-2xl'>
                {post.title}
              </h1>

              <div
                className='mt-8 prose prose-slate sm:prose-sm md:prose-lg lg:prose-xl prose-h3:text-midnight prose-h3:font-extrabold prose-a:text-indigo prose-p:font-light'
                dangerouslySetInnerHTML={{ __html: post.content.html }}></div>
            </div>
          )
        }}
      </Await>
    </Suspense>
  )
}
