(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/get-now-playing');
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();