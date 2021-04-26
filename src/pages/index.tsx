import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './index.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
};

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | IG.News</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Olá, seja bem-vindo</span>
          <h1>Notícias sobre o mundo do <span>React</span>.</h1>
          <p>
            Tenha acesso a todas as publicações <br />
            <span>por {product.amount}/mês</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Imagem de uma garota programando."/>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IkX2kGqHs1gzcQty4kJHVdy');
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price.unit_amount / 100)
  };

  return {
    props: {
      product
    },
    // Segundos * Minutos * Horas = Total
    revalidate: 60 * 60 * 24 // = 24 horas
  };
};