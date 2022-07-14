const dateHelper = dateHelperFactory();

function dateHelperFactory() {
  const padZero = (val, len = 2) => `${val}`.padStart(len, `0`);
  const setValues = (date) => {
    let vals = {
      yyyy: date.getUTCFullYear(),
      m: date.getUTCMonth() + 1,
      d: date.getUTCDate(),
      h: date.getUTCHours() > 12 ? date.getUTCHours() - 12 : date.getUTCHours(),
      mi: date.getUTCMinutes(),
      s: date.getUTCSeconds(),
      ms: date.getUTCMilliseconds(),
      p: date.getUTCHours() > 12 ? 'PM' : 'AM',
    };

    Object.keys(vals)
      .filter((k) => k !== `yyyy` && k !== `p`)
      .forEach(
        (k) => (vals[k[0] + k] = padZero(vals[k], (k === `ms` && 3) || 2))
      );
    return vals;
  };

  return (date) => ({
    values: setValues(date),
    toArr(...items) {
      return items.map((i) => this.values[i]);
    },
  });
}

const formatDate = (date) => {
  const vals = [...`yyyy,mm,dd,hh,mmi,ss,mms,p`.split(`,`)];
  const myDate = dateHelper(date).toArr(...vals);
  return myDate;
};

export default formatDate;
