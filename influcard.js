import { loadPieHeader } from "./utils/pieheader.js";

window.onload = () => {
  loadData();
};

const loadData = async () => {
  const data = await fetchData();
  const influcard = data.influcard;

  loadHeaderData(influcard);
  console.log(influcard);
};

async function fetchData() {
  try {
    let response = await fetch("./data.json");
    let data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

const loadHeaderData = (influcard) => {
  loadPieHeader(influcard);
  const profile_img = document.getElementById("profile_img");
  profile_img.setAttribute("src", influcard.account_picture);

  const headername = document.getElementById("headername");
  const headernameurl = document.getElementById("headernameurl");
  headername.textContent = influcard.username;
  headernameurl.textContent = ` ${influcard.username}`;
  const headerulricon = document.createElement("i");
  const classsicon = influcard.rrss_icon.split(" ");

  classsicon.map((c) => headerulricon.classList.add(c));
  headerulricon.classList.add("url_icon");
  headernameurl.prepend(headerulricon);
  headernameurl.setAttribute("href", influcard.account_url);
  const dateinfo = document.getElementById("date_info");
  dateinfo.textContent =
    dateinfo.textContent + " " + influcard.updated_at_formated;
  const gender = influcard.gender == 0 ? "Hombre" : "Mujer";
  const personal_data = document.getElementById("personal_data");
  personal_data.textContent = `${influcard.country} - ${gender}, ${influcard.age} Años`;
};
