import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";

import styles from './post.module.scss';

interface PostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    };
};

export default function Post({ post }: PostProps) {
    return (
        <>
            <Head>
                <title>{post.title} | IG.News</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req });
    const { slug } = params;

    if (!session?.activeSubscription) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    };

    const prismic = getPrismicClient(req);
    const response = await prismic.getByUID('post', String(slug), {});

    const dataPost = new Date(response.last_publication_date);
    const mesesPtBR = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const post = {
        slug,
        title: RichText.asText(response.data.posttitle),
        content: RichText.asHtml(response.data.postcontent),
        updatedAt: ((dataPost.getDate() <= 9) ? "0" + dataPost.getDate() : dataPost.getDate()) + " de " + mesesPtBR[dataPost.getMonth()] + " de " + dataPost.getFullYear(),
            
        // Esse UpdatedAt não funcionou como eu queria...
        //updatedAt: dataPost.toLocaleDateString('pt-br', { day: 'numeric', month: 'long', year: 'numeric', })
    };

    return {
        props: {
            post
        }
    };
};