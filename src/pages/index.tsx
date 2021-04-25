

import { api } from '../services/api';
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt'
import { GetStaticProps } from 'next';
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import Button from '../components/Button'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';

import { PlayerContext, usePlayer } from '../contexts/PlayerContext';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number
  durationAsString: string;
  url: string;

}

type HomeProps = {
  latesEpisodes: Episode[];
  allEpisodes: Episode[];

}

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {

  const { playList } = usePlayer();

  const episodeList = [...latesEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latesEpisodes}>
        <h2>Últimos Lançamentos </h2>

        <ul>
          {latesEpisodes.map((episodes, index) => {
            return (
              <li key={episodes.id}>
                <Image width={192}
                  height={192}
                  src={episodes.thumbnail}
                  alt={episodes.title} objectFit="cover" />


                <div className={styles.episodesDetails}>
                  <Link href={`/episodes/${episodes.id}`}>
                    <a >{episodes.title}</a>
                  </Link>
                  <p>{episodes.members}</p>
                  <span>{episodes.publishedAt}</span>
                  <span>{episodes.durationAsString}</span>
                </div>
                <button type="button" onClick={() => playList(episodeList, index)} >
                  <img src="./play-green.svg" alt="tocar episodio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos epsódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episodes, index) => {
              return (
                <tr key={episodes.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episodes.thumbnail}
                      alt={episodes.title} objectFit="cover" />
                  </td>
                  <td>
                    <Link href={`/episodes/${episodes.id}`}>
                      <a >{episodes.title}</a>
                    </Link>
                  </td>
                  <td>{episodes.members}</td>
                  <td style={{ width: 100 }}>{episodes.publishedAt}</td>
                  <td>{episodes.durationAsString}</td>
                  <td><Button type="button" onClick={() => playList(episodeList, index + latesEpisodes.length)} src="/play-green.svg" alt="Tocar episódio" />
                  </td>

                </tr>
              )
            })}
          </tbody>

        </table>




      </section>
    </div>

  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limits: 12,
      _sort: 'published_at',
      _order: 'desc'

    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,

    }
  })

  const latesEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latesEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8.
  }
}