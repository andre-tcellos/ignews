import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope: 'read:user'
        })
    ],
    callbacks: {
        async signIn(user, account, profile) {
            const { email } = user;

            try {
                await fauna.query(
                    // Evita Erro de Usuários Duplicados no Banco
                    // Condição: Se NÃO EXISTE usuário no Banco com o e-mail especificado
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(user.email)
                                )
                            )
                        ),
                        // Então registra/salva o usuário no Banco
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),
                        // Se não (Se JÁ EXISTE), então retorna as informações do Usuário
                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(user.email)
                            )
                        )
                    )
                );

                return true;
            } catch {
                return false;
            };
        }
    }
});