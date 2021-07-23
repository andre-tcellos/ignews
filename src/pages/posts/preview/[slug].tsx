import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import Link from "next/link";
import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss';

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    };
};

export default function PostPreview({ post }: PostPreviewProps) {
    const [session] = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`);
        };
    }, [session]);

    return (
        <>
            <Head>
                <title>{post.title} | IG.News</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className={styles.continueReading}>
                        Quer continuar lendo?
                        <Link href="/">
                            <a href="">Inscreva-se agora 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient();
    const response = await prismic.getByUID('post', String(slug), {});

    const dataPost = new Date(response.last_publication_date);
    const mesesPtBR = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const post = {
        slug,
        title: RichText.asText(response.data.posttitle),
        content: RichText.asHtml(response.data.postcontent.splice(0, 3)),
        updatedAt: ((dataPost.getDate() <= 9) ? "0" + dataPost.getDate() : dataPost.getDate()) + " de " + mesesPtBR[dataPost.getMonth()] + " de " + dataPost.getFullYear(),
            
        // Esse UpdatedAt não funcionou como eu queria...
        //updatedAt: dataPost.toLocaleDateString('pt-br', { day: 'numeric', month: 'long', year: 'numeric', })
    };

    return {
        props: {
            post
        },
        redirect: 60 * 30, // 30 minutos
    };
};