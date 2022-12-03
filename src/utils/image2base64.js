async function image2base64(file) {
  var reader = new FileReader();
  return new Promise((r) => {
    reader.onload = function () {
      console.log(reader.result);
      r(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
export default image2base64;
