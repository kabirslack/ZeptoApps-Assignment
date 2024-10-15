const loader = (location, display = true) => {
  if (display) {
    location.innerHTML = "<div class='spinner'></div>";
  } else {
    location.innerHTML = "";
  }
};

export default loader;
