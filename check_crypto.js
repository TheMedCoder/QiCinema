
if (typeof crypto === 'undefined') {
  console.log("Crypto is undefined");
} else if (typeof crypto.randomUUID === 'function') {
  console.log("crypto.randomUUID is supported");
  console.log(crypto.randomUUID());
} else {
  console.log("crypto.randomUUID is NOT supported");
}
