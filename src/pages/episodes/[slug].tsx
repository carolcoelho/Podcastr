import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import Button from '../../components/Button';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head'

import { usePlayer } from '../../contexts/PlayerContext';


type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration: number
    durationAsString: string;
    url: string;
    description: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {

    const { play } = usePlayer();

    return (
        <div className={styles.episodes}>
            <Head>
                <title> {episode.title} | Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>

                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover" />


                <Button type="button" src="/play.svg" alt="Tocar episódio" onClick={() => play(episode)} />


            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />

        </div>




    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limits: 2,
            _sort: 'published_at',
            _order: 'desc'

        }
    })
    const paths = data.map(episodes => {
        return {
            params: {
                slug: episodes.id
            }
        }
    })

    return {
        paths,
        fallback: 'blocking'

    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)
    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }

    return {
        props: { episode, },
        revalidate: 60 * 60 * 24 // 24 horas 
    }

}

