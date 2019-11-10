import { graphql, Link, useStaticQuery } from 'gatsby';
import React, { Fragment, FunctionComponent } from 'react';
import Helmet from 'react-helmet';
import { Bio, Shell } from '../components';

const GET_POSTS_QUERY = graphql`
  query IndexQuery {
    posts: allMarkdownRemark(sort: { fields: fields___slug, order: DESC }) {
      edges {
        node {
          frontmatter {
            title
            description
          }
          parent {
            ... on File {
              name
            }
          }
        }
      }
    }
  }
`;

interface IEdgeNode {
  node: {
    frontmatter: {
      title: string;
      description: string;
    };
    parent: {
      name: string;
    };
  };
}

interface IPostsResult {
  posts: {
    edges: IEdgeNode[];
  };
}

const IndexPage: FunctionComponent = () => {
  const { posts } = useStaticQuery<IPostsResult>(GET_POSTS_QUERY);

  return (
    <Shell>
      <Helmet>
        <title>Thoughts, Stories &amp; Ideas - Josh Manders</title>
      </Helmet>
      <Fragment>
        <h1 className="text-2xl md:text-5xl font-semibold mb-8">Thoughts, Stories &amp; Ideas</h1>
        <Bio className="mb-8 md:mb-16" />
        <section>
          <h3 className="text-xl md:text-3xl font-semibold mb-4">Things I Wrote</h3>
          {posts.edges.map(({ node: post }) => {
            const [, , slug] = /^(\d{4}-\d{2}-\d{2})-(.+)$/.exec(post.parent.name);
            return (
              <article className="mb-8" key={slug}>
                <h2 className="text-xl md:text-2xl mb-2">
                  <Link
                    className="border-b-2 border-brand hover:text-brand"
                    to={`/${slug}`}
                    title={post.frontmatter.title}
                  >
                    {post.frontmatter.title}
                  </Link>
                </h2>
                <p className="md:text-lg italic">{post.frontmatter.description}</p>
              </article>
            );
          })}
        </section>
      </Fragment>
    </Shell>
  );
};

export default IndexPage;
