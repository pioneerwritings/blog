import { gql } from 'graphql-request'

export const QueryGetOGImage = gql`
  query GetOGImage($id: ID!) {
    asset(where: { id: $id }) {
      url
      width
      height
    }
  }
`

export const QueryGetTags = gql`
  query GetTags {
    tags {
      id
      text
    }
  }
`

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
      seo {
        title
        description
      }
    }
  }
`
