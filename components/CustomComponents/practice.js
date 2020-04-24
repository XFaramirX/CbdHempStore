import Link from 'next/link';
// import fetch from 'isomorphic-unfetch'
import axios from 'axios';

const Index = (props) => (
  <div>
    <h1>Batman TV Shows</h1>
    <ul>
      {props.data.map(({ show }) => (
        <li key={show.id}>
          <Link as={`/p/${show.id}`} href={`/post?id=${show.id}`}>
            <a>{show.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

Index.getInitialProps = async function() {
  // fetch('https://api.tvmaze.com/search/shows?q=batman')
  // const data = await res.json()
  const res = await axios.get('https://api.tvmaze.com/search/shows?q=batman');
  const data = await res.data;

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    data: data,
  };
};

export default Index;
