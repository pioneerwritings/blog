import { gql } from 'graphql-request'

export const QueryGetPosts = gql`
  query GetPosts {
    posts {
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
