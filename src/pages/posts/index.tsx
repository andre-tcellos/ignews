import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
};

interface PostsProps {
    posts: Post[],
};

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | IG.News</title>
            </Head>

            <main className={styles.container}>
                <ul className={styles.posts}>
                    { posts.map(post => (
                        <li key={post.slug}>
                            <Link href={`/posts/${post.slug}`}>
                                <a>
                                    <time>{post.updatedAt}</time>
                                    <strong>{post.title}</strong>
                                    <p>{post.excerpt}</p>
                                </a>
                            </Link>
                        </li>
                    )) }
                </ul>
            </main>
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'post')
    ], {
        fetch: ['post.posttitle', 'post.postcontent'],
        pageSize: 100
    });

    const posts = response.results.map(post => {
        const dataPost = new Date(post.last_publication_date);
        const mesesPtBR = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        return {
            slug: post.uid,
            title: RichText.asText(post.data.posttitle),
            excerpt: post.data.postcontent.find((content: { type: string; }) => content.type === 'paragraph')?.text ?? '',
            updatedAt: ((dataPost.getDate() <= 9) ? "0" + dataPost.getDate() : dataPost.getDate()) + " de " + mesesPtBR[dataPost.getMonth()] + " de " + dataPost.getFullYear(),
            
            // Esse UpdatedAt não funcionou como eu queria...
            //updatedAt: dataPost.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'nomeric' }),
        };
    });

    return {
        props: {
            posts
        }
    }
};