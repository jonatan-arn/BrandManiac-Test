import { loadPieHeader } from "./utils/pieheader.js";
import { loadYear } from "./utils/yearchart.js";
import { loadGenderPie } from "./utils/genderpie.js";
import { loadCountry } from "./utils/countrychart.js";
import { loadTerritorie } from "./utils/territoriechart.js";
import { loadDay } from "./utils/daychart.js";
import { loadVideoChart } from "./utils/videoratechart.js";

window.onload = () => {
  loadData();
};

const loadData = async () => {
  const data = await fetchData();
  const influcard = data.influcard;

  loadHeaderData(influcard);
  loadAudience(influcard);
  loadPublications(influcard);
  loadPerformance(influcard);
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

const loadAudience = (influcard) => {
  let audience = document.getElementById("audience");
  let audience_fake = document.getElementById("audience_fake");
  let audience_real = document.getElementById("audience_real");

  audience.textContent = influcard.followers_formated;

  audience_fake.textContent = `${influcard.fake_followers_formated}%`;
  audience_real.textContent = influcard.real_followers_formated;

  loadYear(influcard);

  loadGenderPie(influcard);
  loadCountry(influcard);
};
const loadPublications = (influcard) => {
  loadTerritorie(influcard);
  loadDay(influcard);

  let brands = influcard.brands_selected_arrray.splice(0, 6);

  for (let k in brands) {
    brands[k] = { ...influcard.brands[brands[k]] };
  }
  for (let img of influcard.brands_images) {
    let contains = brands.filter((f) => f.name == img.name);

    if (contains.length > 0) {
      let i = brands.findIndex((f) => f.name == img.name);
      brands[i].image = img.image;
    }
  }
  for (let b of brands) {
    let marcas = document.getElementById("marcas");

    let container = document.createElement("div");
    let text = document.createElement("span");
    let img = document.createElement("img");

    text.textContent = b.name;
    img.setAttribute("src", b.image);
    container.classList.add("brand_container");
    text.classList.add("text_brand");
    img.classList.add("img_brand");
    marcas.appendChild(container);
    container.appendChild(img);
    container.appendChild(text);
  }
};

const loadPerformance = (influcard) => {
  let perfomance = document.getElementById("perfomance");
  let perfomance_reach = document.getElementById("perfomance_reach");

  perfomance.textContent = influcard.followers_formated;

  perfomance_reach.textContent = influcard.reach_formated;

  let impressions = document.getElementById("impressions");
  let reach_percent = document.getElementById("reach_percent");
  let audience_percent = document.getElementById("audience_percent");
  impressions.textContent = `${influcard.avg_impressions_formated}`;

  reach_percent.textContent = `${influcard.reach}%`;

  audience_percent.textContent = `${influcard.resonance}%`;

  let views = document.getElementById("views");
  let view_reach = document.getElementById("view_reach");
  let view_audience = document.getElementById("view_audience");
  views.textContent = `${influcard.vplays_formated}`;

  view_reach.textContent = `${influcard.vr_alcance}%`;
  view_audience.textContent = `${influcard.vr_audiencia}%`;

  let engagement = document.getElementById("engagement");
  let engagement_reach = document.getElementById("engagement_reach");
  let engagement_audience = document.getElementById("engagement_audience");
  engagement.textContent = `${influcard.engagement_formated}`;

  engagement_reach.textContent = `${influcard.er_alcance}%`;
  engagement_audience.textContent = `${influcard.er_audiencia}%`;
  loadVideoChart(influcard);
};
