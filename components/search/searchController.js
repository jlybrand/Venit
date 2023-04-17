const CONFIG = require("../../lib/config");
const SEARCH = require("./searchDAL");
const USER = require("../users/usersDAL");
const MAIL = require("../users/mailController");
const API_URL = CONFIG.API_URL;
let eligibilityMsg;
let claimMsg;

const getEligibility = (resultLength) => {
  if (resultLength >= 10) {
    eligibilityMsg = `Your search resulted in ${resultLength} ${SEARCH.getBusinessType()} within ${SEARCH.getRadius()} miles.`;

    claimMsg = `Register to Claim your Referrals`;

    return true;
  } else {
    eligibilityMsg = `Try increasing your search radius`;

    return false;
  }
};

const handleProspect = async () => {
  if (SEARCH.getProspect()) var prospectSaved = await SEARCH.saveProspect();

  if (prospectSaved) MAIL.prospectEmailToAdmin(SEARCH.getProspect());
};

const handleSearchResults = async (origin, searchResults) => {
  const filteredResults = SEARCH.filterAndSetProspect(origin, searchResults);
  const eligibleResults = await USER.fetchEligibleResults(filteredResults);
  SEARCH.setEligibleResults(eligibleResults);
  USER.setTargets(SEARCH._eligibleResults);
};

const submitSearch = async (req, res) => {
  const { address, zipcode, radius, sicCode } = req.body;
  const origin = `${address} ${zipcode}`;
  const params = {
    origin: origin,
    hostedDataList: [
      {
        tableName: "mqap.ntpois",
        extraCriteria: "group_sic_code LIKE ?",
        parameters: [`${sicCode}`],
        columnNames: [
          "name",
          "address",
          "city",
          "state",
          "postal_code",
          "phone",
          "group_sic_code",
          "lat",
          "lng",
        ],
      },
    ],
    options: {
      radius: radius,
      maxMatches: 4000,
    },
  };

  if (CONFIG.NODE_ENV !== "production") {
    console.log(`REQUEST: ${API_URL}?origin=${origin}, radius=${radius}`);
  }

  const rerenderSearchForm = (title, message) => {
    res.render("search", {
      title: title,
      errorMessages: [message],
      address,
      zipcode,
      radius,
      sicCode,
    });
  };

  try {
    const searchResults = await SEARCH.fetchData(params);

    if (searchResults === -1) {
      const errMsg = "Please ensure your address details are correct.";
      rerenderSearchForm("Correct Address", errMsg);
    } else {
      await handleSearchResults(origin, searchResults);
      SEARCH.setRadius(radius);
      SEARCH.setBusinessType(sicCode);
      const isEligible = getEligibility(SEARCH.getEligibleResults().length);

      if (isEligible) {
        res.render("register", {
          title: "Register",
          eligibilityMsg,
          claimMsg,
        });
      } else {
        const searchMsg = `Try increasing your search radius.`;
        rerenderSearchForm("Increase Search Radius", searchMsg);
      }
    }
  } catch (error) {
    console.log("submitSearch Error: ", error);
    const errMsg = "Error Encountered. Please Try Again";
    rerenderSearchForm("Search Form", errMsg);
  }

  handleProspect();
};

module.exports = {
  submitSearch,
};
