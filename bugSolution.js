// bugSolution.js
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default function MyComponent({ data }) {
  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context, authOptions);
  try {
    const res = await fetch(`https://api.example.com/data?id=${context.params.id}`);
    if (!res.ok) {
      // Handle non-2xx responses
      const errorData = await res.json();
      console.error(`API Error: ${res.status} - ${JSON.stringify(errorData)}`); //Detailed logging
      return {
        notFound: true,
      };
    }
    const data = await res.json();
    return { props: { data } };
  } catch (error) {
    console.error('Data fetching error:', error); //Detailed logging
    return {
      props: {
        data: null
      },
      notFound: true
    };
  }
}
