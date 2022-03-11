const fs = require('fs');
const bcrypt = require('bcrypt');




const Utilities = {

  createCSV: (targets) => {
    const csvStr = [
      [
        "Name",
        "Address",
        "City",
        "State",
        "Postal Code",
        "Phone"
      ],

      ...targets.map(target => [
        target.name.replace(',', ''),
        target.address,
        target.city,
        target.state,
        target.postal_code,
        target.phone
      ])
    ]
      .map(e => e.join(","))
      .join("\n");

    return csvStr;
  },

  writeToCSVFile: (username, targets) => {
    const csvStr = Utilities.createCSV(targets);
    const filename = `csv_files/${username}_targets.csv`;
    fs.writeFile(filename, csvStr, err => {
      if (err) {
        console.log('Error writing to csv file', err);
      } else {
        console.log(`saved as ${filename}`);
      }
    });
  },

 formatPhoneNumber: (phoneNumber) => {
    let cleanedNumber = phoneNumber.replace(/[^\d]/g, "").substring(1);
    let formattedNumber = cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    return formattedNumber;
  },

  formatPhoneNumbers: (results) => {
    const keys = [
      'name', 'address', 'city', 'state',
      'postal_code', 'phone', 'group_sic_code', 'lat', 'lng'
    ];

    return results.map(result => {
      return keys.reduce((acc, curr) => {
        if (curr === 'phone') {
          acc[curr] = Utilities.formatPhoneNumber(result[curr]);
        } else {
          acc[curr] = result[curr];
        }

        return acc;
      }, {});
    });
  }
}

module.exports = Utilities;