import {
  LoaderArgs,
  json,
  V2_MetaFunction,
  V2_HtmlMetaDescriptor
} from '@remix-run/node'

import { getPostBySlug } from '~/db'
import { useLoaderData, Link } from '@remix-run/react'
import { DateTime } from 'luxon'

export const loader = async ({ params }: LoaderArgs) => {
  const { post } = await getPostBySlug(params.id!)

  return json({
    post
  })
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, matches }) => {
  const { seo, author } = data.post

  const parentMeta = matches.reduce((current, { meta }) => {
    return meta ? current.concat(meta) : []
  }, [] as V2_HtmlMetaDescriptor[])

  return [
    ...parentMeta,
    {
      property: 'og:title',
      content: seo?.title!
    },
    {
      property: 'og:description',
      content: seo?.description!
    },
    {
      property: 'og:image',
      content: seo?.image?.url!
    },
    {
      property: 'og:image:width',
      content: seo?.image?.width?.toString() ?? ''
    },
    {
      property: 'og:image:height',
      content: seo?.image?.height?.toString() ?? ''
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      property: 'og:author',
      content: author?.name!
    }
  ]
}

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>()

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
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      />
    </div>
  )
}
