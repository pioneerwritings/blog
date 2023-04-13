import {
  LoaderArgs,
  json,
  V2_MetaFunction,
  V2_HtmlMetaDescriptor
} from '@remix-run/node'

import { getPostBySlug } from '~/db'
import { useLoaderData, Link } from '@remix-run/react'
import { DateTime } from 'luxon'
import { useCallback } from 'react'

export const loader = async ({ params }: LoaderArgs) => {
  const { post } = await getPostBySlug(params.id!)

  return json({
    post
  })
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, matches }) => {
  const { author, publishedAt, title, excerpt } = data.post

  const parentMeta = matches.reduce((current, { meta }) => {
    return meta ? current.concat(meta) : []
  }, [] as V2_HtmlMetaDescriptor[])

  return [
    ...parentMeta,
    {
      property: 'og:title',
      content: title
    },
    {
      property: 'og:description',
      content: excerpt
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      property: 'og:author',
      content: author?.name!
    },
    {
      property: 'article:author',
      content: author?.name!
    },
    {
      property: 'article:published_time',
      content: publishedAt
    }
  ]
}

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>()

  const date = DateTime.fromJSDate(new Date(post.publishedAt))
  const published = date.toLocaleString(DateTime.DATE_FULL)

  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className='p-10 lg:p-16 sm:border-x'>
      <div className='flex items-center mb-6'>
        <div className='flex items-center'>
          <img
            className='w-12 h-auto rounded-full mr-5'
            src={post.author?.picture?.url}
            alt="The author's avatar"
          />
          <div className='mr-5 flex flex-col'>
            <span className='text-slate-500 text-sm'>
              {post.author?.name} <span className='text-slate-500 mx-3'>|</span>{' '}
              {published}
            </span>
          </div>
        </div>

        <Link to={`/tag/${post.tag?.text}`}>
          <span className='border border-indigo px-3 flex items-center justify-center rounded-full text-indigo capitalize text-sm'>
            {post.tag?.text}
          </span>
        </Link>
      </div>

      <h1 className='font-extrabold text-3xl lg:text-4xl text-midnight max-w-2xl'>
        {post.title}
      </h1>

      <div
        className='mt-8 prose prose-slate sm:prose-sm md:prose-lg lg:prose-xl prose-h3:text-midnight prose-h3:font-extrabold prose-a:text-indigo prose-p:font-light prose-blockquote:font-normal prose-blockquote:text-slate-500'
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      />

      <button
        onClick={handleBackToTop}
        type='button'
        aria-label='Back to top'
        className='py-12 hover:underline text-slate-500 text-sm flex items-center'>
        <img src='/img/top-arrow.svg' aria-hidden className='mr-2' /> Back to
        top
      </button>
    </div>
  )
}
