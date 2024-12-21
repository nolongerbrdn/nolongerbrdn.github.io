fetch('https://fastidious-mousse-e02a5c.netlify.app/api/hello', {
    mode: 'cors'
})
    .then(response => response.json())
    .then(data => console.log(data.message))  // Logs "Hello from the backend!"
    .catch(error => console.error('Error fetching data:', error));
