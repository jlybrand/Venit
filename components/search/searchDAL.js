const config = require("../../lib/config");
const { dbQuery } = require("../../lib/db-query");
const utils = require("../../lib/utilities");
const axios = require("axios");
const API_URL = config.API_URL;
const API_KEY_NAME = config.API_KEY_NAME;
const API_KEY_VALUE = config.API_KEY_VALUE;
const businessTypes = {
  ["802101"]: "dentists",
  ["801101"]: "doctors",
  ["599504"]: "opticians",
  ["591205"]: "pharmacies",
};

const MqSearch = {
  _prospect: undefined,
  _radius: undefined,
  _eligibleResults: undefined,
  _businessType: undefined,

  fetchData: async function (params) {
    try {
      const apiResponse = await axios.post(
        `${API_URL}?${API_KEY_NAME}=${API_KEY_VALUE}`,
        params
      );
      if (apiResponse.data.resultsCount) {
        const searchResults = apiResponse.data.searchResults.map((result) => {
          return result.fields;
        });

        return searchResults;
      } else return -1;
    } catch (error) {
      console.log("Error from search.fetchData: ", error.response.data);
      throw error;
    }
  },

  filterAndSetProspect: function (origin, results) {
    for (let i = 0; i < results.length; i++) {
      if (
        origin.includes(results[i].address) &&
        origin.includes(results[i].postal_code)
      ) {
        this.setProspect(results[i]);
        results.splice(i, 1);
        break;
      }
    }

    return results;
  },

  saveProspect: async function () {
    const prospect = this.getProspect();
    const CHECK_PROSPECTS = "SELECT FROM prospects WHERE address = $1";

    try {
      const data = await dbQuery(CHECK_PROSPECTS, prospect.address);

      if (data.rowCount != 0) {
        return false;
      } else {
        prospect.phone = utils.formatPhoneNumber(prospect.phone);

        const INSERT_PROSPECT =
          "INSERT INTO prospects (name, address, city, state, postal_code, phone) VALUES ($1, $2, $3, $4, $5, $6)";

        const result = await dbQuery(
          INSERT_PROSPECT,
          prospect.name,
          prospect.address,
          prospect.city,
          prospect.state,
          prospect.postal_code,
          prospect.phone
        );

        return result.rowCount > 0;
      }
    } catch (error) {
      console.log("storeProspect Error: ", error);
      return false;
    }
  },

  getProspect() {
    return this._prospect;
  },

  setProspect(value) {
    this._prospect = value;
  },

  getRadius() {
    return this._radius;
  },

  setRadius(radius) {
    this._radius = radius;
  },

  getBusinessType() {
    return this._businessType;
  },

  setBusinessType(sicCode) {
    this._businessType = businessTypes[sicCode];
  },

  getEligibleResults() {
    return this._eligibleResults;
  },

  setEligibleResults(value) {
    this._eligibleResults = value;
  },
};

module.exports = MqSearch;
