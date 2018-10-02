import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return window.fetch('https://jsonplaceholder.typicode.com/comments').then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          return json;
        })
      }
    })
  }
});