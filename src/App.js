import { useState } from 'react';
import './App.css';

const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
const clientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;

function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUser = async (user) => {
    try {
      const res = await fetch(
        `https://api.github.com/users/${user}?client_id=${clientId}&client_secret=${clientSecret}`
      );
      const data = await res.json();

      if (data.message === 'Not Found') {
        setError(true);
        setMessage('No profile with this user name.');
      } else {
        setError(false);
        setUser(data);
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setMessage('No profile with this user name.');
    }
  };

  const fetchRepos = async (user) => {
    try {
      const res = await fetch(
        `https://api.github.com/users/${user}/repos?sort=created&client_id=${clientId}&client_secret=${clientSecret}`
      );
      const data = await res.json();

      setRepos(data);
    } catch (err) {
      setError(true);
      setMessage('Problem fetching repos.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetchUser(username);
    fetchRepos(username);
  };

  console.log(user);

  return (
    <div className="App">
      <form className="user-form" onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Search a GitHub user"
        />
      </form>
      <main>
        {error ? (
          <div className="card">
            <h1>{message}</h1>
          </div>
        ) : (
          <>
            {user ? (
              <div className="card">
                <div>
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="avatar"
                  />
                </div>
                <div className="user-info">
                  <h2>{user.login}</h2>
                  <p>{user.bio ? user.bio : ''}</p>
                  <ul>
                    <li>
                      {user.followers} <strong>Followers</strong>
                    </li>
                    <li>
                      {user.following} <strong>Following</strong>
                    </li>
                    <li>
                      {user.public_repos} <strong>Repos</strong>
                    </li>
                  </ul>
                  <div className="repos" id="repos">
                    {repos.length > 0 &&
                      repos.slice(0, 10).map((repo) => (
                        <a
                          key={repo.id}
                          href={repo.html_url}
                          className="repo"
                          target="_blank"
                          rel="noreferrer nofollow"
                        >
                          {repo.name}
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
