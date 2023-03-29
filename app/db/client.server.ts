import { GraphQLClient } from 'graphql-request'
import {
  QueryGetPostBySlug,
  QueryGetPosts,
  QueryGetPostsByTag,
  QueryGetTags
} from './queries'
import { Tag, Post } from '~/types/codegen'

export interface GetPostsReturnType {
  posts: Array<Post>
}
export interface GetPostBySlugReturnType {
  post: Post
}
export interface GetTagsReturnType {
  tags: Array<Tag>
}

const client = new GraphQLClient(process.env.HYGRAPH_API_URL!)

export const getPosts = client.request<GetPostsReturnType>(QueryGetPosts)

export const getPostBySlug = async (slug: string) => {
  return client.request<GetPostBySlugReturnType>(QueryGetPostBySlug, { slug })
}

export const getPostsByTag = async (tag: string) => {
  return client.request<GetPostsReturnType>(QueryGetPostsByTag, { tag })
}

export const getTags = client.request<GetTagsReturnType>(QueryGetTags)
