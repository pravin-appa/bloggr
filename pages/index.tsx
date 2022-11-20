import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {GraphQLClient, gql}  from 'graphql-request'
import BlogCard from '../components/BlogCard'
import logo from '../images/logo.png'
import wave from '../images/wave.svg'


const graphcms = new GraphQLClient(
  'https://api-ap-south-1.hygraph.com/v2/claipfqdw236k01uk0orgdr2t/master'
);

  const postQuery = gql`
  {
    posts {
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
//use static props => is a function that allows us to do an api request, after we do our api requst, next js will let us do static html pages
  //basically will read the data, then when uploaded on github, it will take every blog post and generate a file for it
  //when people visit your website, they will not need to make any api requests. All of these pages will be pregenerated. Another way to say it is that these posts are statically generated

export async function getStaticProps() {
  const { posts } = await graphcms.request(postQuery) 

  //when you use getStaticProps, you always want to return something here in props. The props property gets passed into the home component
  return  {
    props: {
      posts
    },
    revalidate: 10 
    }
}

export default function Home({posts}:any) {
  return (
    <div className={styles.container} >
      <Head>
        <title>Bloggy</title>
        <meta name="Blogging Website" content="Platform for blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className={styles.nav}>
          <Image id={styles.wv} src={wave} alt="" />
        <Image id={styles.lg} src={logo} alt='Logo'/>
          
        </div>
      </header>

      <main className={styles.main}>
        {posts.map((post:any) => (
          <BlogCard 
            key={post.id} 
            title={post.title} 
            author={post.author} 
            coverPhoto={post.coverPhoto} 
            datePublished={post.datePublished} 
            content={post.content} 
            slug={post.slug}/>
        ))}
      </main>

    </div>
  )
}