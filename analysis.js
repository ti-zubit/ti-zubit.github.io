fetch('https://script.google.com/macros/s/AKfycbxlWrZgWzAOj9NetJzWIt2wjvJ_fCa87JLjkJwvxi85fYniCQJeKwTXGmiDpU0Is11Q/exec?yearmonth=2023-10')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // JSONデータを取得する例
  })
  .then(data => {
    console.log(data); // サーバーから取得したデータを表示
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });