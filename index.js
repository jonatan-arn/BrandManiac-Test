window.onload = () => {
  fetch("./data.json")
    .then((response) => response.json())
    .then((json) => {
      const data = json;
      console.log(data);
    });
};
