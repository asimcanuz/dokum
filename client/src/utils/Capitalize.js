function Capitalize(string) {
  console.log(string);
  if (!string) {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { Capitalize };
