const { dbQuery } = require("../../lib/db-query");
const bcrypt = require('bcrypt');

const User = (function () {

  let _password;

  return {
    _targets: undefined,

    fetchEligibleResults: async function (results) {
      try {
        let storedAdresses = await this.getStoredAddresses();
        const eligibleResults = results.filter(result => {
          return !storedAdresses.includes(result.address);
        });

        return eligibleResults;

      } catch (error) {
        console.log('getEligibleResults: ', error);
      }
    },

    getStoredAddresses: async function () {
      const FIND_ALL_TARGETS = "SELECT address FROM targets";
      const records =
        await dbQuery(FIND_ALL_TARGETS);
      return records.rows.map(record => record.address);
    },

    saveTargets: async function (username, targets) {
      try {
        const STORE_USER_TARGETS = "INSERT INTO targets (name, address, city, state, postal_code, phone, owner) VAlUES ($1, $2, $3, $4, $5, $6, $7)";

        for (let i = 0; i < targets.length; i++) {
          let target = targets[i];
          var result =
            await dbQuery(STORE_USER_TARGETS, target.name, target.address, target.city, target.state, target.postal_code, target.phone, username);
        }

        return result.rowCount > 0;

      } catch (error) {
        console.log('saveTargets Error: ', error.detail);
        throw error;
      }
    },

    saveUser: async function (userInfo) {
      const CHECK_CLIENTS =
        "SELECT FROM clients WHERE email = $1 OR username = $2";

      const SAVE_USER = "INSERT INTO clients (first_name, last_name, email, username, password) VALUES ($1, $2, $3, $4, $5)";

      try {
        const data =
          await dbQuery(CHECK_CLIENTS, userInfo.email, userInfo.username);

        if (data.rowCount != 0) return false;

        this.setPassword(await bcrypt.hash(userInfo.password, 10));

        var result =
          await dbQuery(SAVE_USER, userInfo.firstname, userInfo.lastname, userInfo.email, userInfo.username, _password);

        return result.rowCount > 0;
    
      } catch(error) {
      console.log(error);
      throw error;
    }

  },

    setPassword(value) { _password = value; },

  getTargets() { return this._targets; },

  setTargets(results) { this._targets = results; }
}

}());

module.exports = User;
