import styles from "../../styles/Slug.module.css"
import {GraphQLClient, gql}  from 'graphql-request'

const graphcms = new GraphQLClient(
    'https://api-ap-south-1.hygraph.com/v2/claipfqdw236k01uk0orgdr2t/master'
  );
  
    const postQuery = gql`
    
      query Post($slug: String!){
        post(where : {slug: $slug}){
            id
            title
            datePublished
            slug
            content{
                html
            }
            author{
                tokenName
                avatar {
                url
                }
            }
            coverPhoto {
                url
            }
        }
      }
    
  `;

  const SLUGLIST = gql`
     {
      posts{
        slug
        }
     }
  `;

  export async function getStaticPaths(){
    const {posts} = await graphcms.request(SLUGLIST);

    return{
        paths: posts.map((post) => ({params :{slug : post.slug}})),
        fallback: false,
    };
  }
  
  export async function getStaticProps({params}) {
    const slug = params.slug;
    const data = await graphcms.request(postQuery,{slug});
    const post = data.post;
    console.log(post);
  
    return  {
      props: {
        post
      },
      revalidate: 10 
      }
  }

  export default function BlogPost({post}){
    return(
            <main className={styles.blog}>
        <div className={styles.coverPhotoContainer}>
            <img
            layout="fill"
            src={post.coverPhoto.url}
            className={styles.cover}
            alt="Blog Post cover photo"
            />
        </div>
        <div className={styles.title}>
            <div className={styles.avatarContainer}>
            <img
                layout="fill"

                src={post.author.avatar.url}
                className={styles.avatar}
                alt="Author avatar"

            />
            </div>
            <div className={styles.authtext}>
            <h6>By {post.author.tokenName}</h6>
            <h6 className={styles.data}>{post.datePublished}</h6>
            </div>
        </div>
        <h2>{post.title}</h2>
        <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content.html }}
        ></div>
        </main>
    );

  }