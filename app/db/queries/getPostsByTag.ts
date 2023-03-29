import { gql } from 'graphql-request'

export const QueryGetPostsByTag = gql`
  query GetPostsByTag($tag: String!) {
    posts(where: { tag: { text: $tag } }) {
      id
      slug
      title
      excerpt
      publishedAt
      tag {
        text
      }
      author {
        name
        title
        picture {
          url
        }
      }
    }
  }
`
