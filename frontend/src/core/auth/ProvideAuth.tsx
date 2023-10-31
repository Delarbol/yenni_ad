const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (process.env.REACT_APP_PASSWORD === token) {
    return true;
  }
}

export default isLoggedIn;
