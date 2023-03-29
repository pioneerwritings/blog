import { gql } from 'graphql-request'

export const QueryGetPostBySlug = gql`
  query GetPost($slug: String!) {
    post(where: { slug: $slug }) {
      title
      publishedAt
      content {
        html
      }
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
