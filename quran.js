fetch("quran.txt")
  .then(response => response.text())
  .then(data => {
    const lines = data.trim().split("\n");

    const quran = lines.map(line => {
      const parts = line.split("|");

      return {
        surah: Number(parts[0]),
        ayah: Number(parts[1]),
        text: parts.slice(2).join("|")
      };
    });

    console.log(quran);
  })
  .catch(error => {
    console.error("حصل خطأ في تحميل القرآن:", error);
  });