const calculateVisibility = (meter) => {
    const kilometer = meter / 1000;

    return Math.round(kilometer) + "km"
}
calculateVisibility();
console.log(calculateVisibility(10000));
